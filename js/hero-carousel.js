/**
 * ============================================================================
 * LOYLIZ | Carrusel Interactivo de la Sección Hero (Vanilla JS)
 * ============================================================================
 * Carrusel ligero, accesible y autónomo (sin dependencias externas).
 * 
 * GUÍA RÁPIDA PARA EL ADMINISTRADOR / DISEÑADOR:
 * Para actualizar las fotografías o textos de las diapositivas, edita el
 * siguiente arreglo 'HERO_SLIDES'.
 * - 'image': Ruta local de la fotografía (ej: 'img/hero-1.jpg') o URL web.
 * - 'fallback': Imagen de contingencia automática si el archivo local aún no existe.
 * - 'alt': Texto alternativo descriptivo para SEO y accesibilidad.
 * - 'tag': Insignia o colección destacada (ej: 'LOYLIZ · COLECCIÓN 2026').
 * - 'title': Nombre o título de la línea textil.
 * - 'subtitle': Descripción breve destacando confort, tela y confección.
 */

(function () {
    'use strict';

    // Imagen de respaldo oficial LOYLIZ (Confección Quirúrgica & Clínica)
    const DEFAULT_HERO_FALLBACK = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80';

    // ========================================================================
    // 1. CONFIGURACIÓN EDITABLE DE DIAPOSITIVAS (HERO_SLIDES)
    // ========================================================================
    const HERO_SLIDES = [
        {
            // Diapositiva 1: Sanitaria & Quirúrgica (Conserva la foto actual para garantizar disponibilidad inmediata)
            image: 'img/hero-1.jpg',
            fallback: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80',
            alt: 'LOYLIZ - Línea Sanitaria & Quirúrgica',
            tag: 'LOYLIZ · COLECCIÓN 2026',
            title: 'Línea Sanitaria & Quirúrgica',
            subtitle: 'Bioseguridad, estética clínica y confort en cada guardia médica.'
        },
        {
            // Diapositiva 2: Corporativos & Ejecutivos
            image: 'img/hero-2.jpg',
            fallback: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
            alt: 'LOYLIZ - Uniformes Corporativos & Ejecutivos',
            tag: 'LOYLIZ · IDENTIDAD EMPRESARIAL',
            title: 'Uniformes Corporativos & Ejecutivos',
            subtitle: 'Elegancia sastre, durabilidad textil y presencia impecable para tu equipo.'
        },
        {
            // Diapositiva 3: Deportiva & Alto Rendimiento (Jerseys LVBP y prendas atléticas)
            image: 'img/hero-3.jpg',
            fallback: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80',
            alt: 'LOYLIZ - Línea Deportiva & Alto Rendimiento',
            tag: 'LOYLIZ · PASIÓN EN MOVIMIENTO',
            title: 'Línea Deportiva & Alto Rendimiento',
            subtitle: 'Jerseys, telas dry-fit transpirables y máxima libertad de movimiento.'
        },
        {
            // Diapositiva 4: Confección Personalizada & Asesoría de Imagen
            image: 'img/hero-4.jpg',
            fallback: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80',
            alt: 'LOYLIZ - Confección Personalizada & Asesoría de Imagen',
            tag: 'LOYLIZ · ASESORÍA EXCLUSIVA',
            title: 'Confección Personalizada & Asesoría',
            subtitle: 'Acompañamiento integral en diseño, selección textil y patronaje a medida.'
        }
    ];

    // Constantes de temporización y transición
    const AUTOPLAY_INTERVAL_MS = 4500;
    const SWIPE_THRESHOLD_PX = 40;

    // Estado interno del carrusel
    let currentIndex = 0;
    let autoplayTimer = null;
    let progressStartTime = 0;
    let progressAnimationId = null;
    let isPaused = false;
    let touchStartX = 0;
    let touchEndX = 0;

    // Referencias al DOM
    let carouselContainer = null;
    let slidesTrack = null;
    let btnPrev = null;
    let btnNext = null;
    let dotsContainer = null;
    let progressBar = null;
    let slideElements = [];
    let dotElements = [];

    /**
     * Construye e inyecta dinámicamente las diapositivas en el track.
     * La primera diapositiva ya está presente en HTML para CLS = 0; esta función la hidrata
     * y genera las diapositivas 2, 3 y 4 con carga diferida (loading="lazy").
     */
    function renderSlides() {
        if (!slidesTrack) return;

        slidesTrack.innerHTML = '';
        slideElements = [];

        HERO_SLIDES.forEach((slide, idx) => {
            const isFirst = idx === 0;
            const slideEl = document.createElement('div');
            slideEl.className = `hero-slide absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isFirst ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
            }`;
            slideEl.setAttribute('role', 'group');
            slideEl.setAttribute('aria-roledescription', 'diapositiva');
            slideEl.setAttribute('aria-label', `${idx + 1} de ${HERO_SLIDES.length}: ${slide.title}`);
            slideEl.setAttribute('aria-hidden', isFirst ? 'false' : 'true');
            slideEl.dataset.index = idx;

            // Escapar comillas en el fallback para el atributo onerror
            const fallbackUrl = slide.fallback || DEFAULT_HERO_FALLBACK;
            const primaryUrl = slide.image || fallbackUrl;

            slideEl.innerHTML = `
                <!-- Fotografía con efecto de escala suave -->
                <img src="${primaryUrl}" 
                     onerror="this.onerror=null; this.src='${fallbackUrl}';"
                     alt="${slide.alt}" 
                     loading="${isFirst ? 'eager' : 'lazy'}" 
                     ${isFirst ? 'fetchpriority="high"' : ''}
                     class="hero-slide-img w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out ${
                         isFirst ? 'scale-100' : 'scale-105'
                     }">
                
                <!-- Gradiente cinematográfico de marca LOYLIZ -->
                <div class="absolute inset-0 bg-gradient-to-t from-brand-navyDark/95 via-brand-navy/40 to-transparent"></div>

                <!-- Textos elevados para despejar totalmente los badges flotantes (Cero Solapamiento) -->
                <div class="hero-slide-caption absolute bottom-0 inset-x-0 p-6 sm:p-8 pb-24 sm:pb-20 text-white z-10 flex flex-col justify-end transition-all duration-500 transform ${
                    isFirst ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                }">
                    <span class="inline-block self-start px-2.5 py-1 bg-brand-gold text-brand-navy font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-md mb-2 shadow-xs">
                        ${slide.tag}
                    </span>
                    <h3 class="text-xl sm:text-2xl font-display font-extrabold text-white leading-tight">
                        ${slide.title}
                    </h3>
                    <p class="text-xs sm:text-sm text-gray-200 mt-1.5 max-w-md font-normal leading-relaxed">
                        ${slide.subtitle}
                    </p>
                </div>
            `;

            slidesTrack.appendChild(slideEl);
            slideElements.push(slideEl);
        });
    }

    /**
     * Construye los puntos minimalistas de paginación (Dots).
     */
    function renderDots() {
        if (!dotsContainer) return;

        dotsContainer.innerHTML = '';
        dotElements = [];

        HERO_SLIDES.forEach((slide, idx) => {
            const isFirst = idx === 0;
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = `rounded-full transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-brand-gold ${
                isFirst ? 'w-7 h-2 bg-brand-gold shadow-xs' : 'w-2 h-2 bg-[#FAECDA]/50 hover:bg-white/80'
            }`;
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-selected', isFirst ? 'true' : 'false');
            dot.setAttribute('aria-label', `Ir a diapositiva ${idx + 1} de ${HERO_SLIDES.length}: ${slide.title}`);
            dot.dataset.index = idx;

            dot.addEventListener('click', () => {
                goToSlide(idx);
                restartAutoplay();
            });

            dotsContainer.appendChild(dot);
            dotElements.push(dot);
        });
    }

    /**
     * Cambia la diapositiva activa con transición suave y actualiza la accesibilidad.
     * @param {number} targetIndex - Índice destino (0 a HERO_SLIDES.length - 1)
     */
    function goToSlide(targetIndex) {
        if (targetIndex < 0) {
            targetIndex = HERO_SLIDES.length - 1;
        } else if (targetIndex >= HERO_SLIDES.length) {
            targetIndex = 0;
        }

        if (targetIndex === currentIndex && slideElements.length > 0) return;

        // Desactivar diapositiva anterior
        const prevSlide = slideElements[currentIndex];
        if (prevSlide) {
            prevSlide.classList.remove('opacity-100', 'pointer-events-auto', 'z-10');
            prevSlide.classList.add('opacity-0', 'pointer-events-none', 'z-0');
            prevSlide.setAttribute('aria-hidden', 'true');

            const prevImg = prevSlide.querySelector('.hero-slide-img');
            if (prevImg) {
                prevImg.classList.remove('scale-100');
                prevImg.classList.add('scale-105');
            }

            const prevCaption = prevSlide.querySelector('.hero-slide-caption');
            if (prevCaption) {
                prevCaption.classList.remove('translate-y-0', 'opacity-100');
                prevCaption.classList.add('translate-y-2', 'opacity-0');
            }
        }

        // Desactivar punto anterior
        const prevDot = dotElements[currentIndex];
        if (prevDot) {
            prevDot.className = 'w-2 h-2 rounded-full bg-[#FAECDA]/50 hover:bg-white/80 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-brand-gold';
            prevDot.setAttribute('aria-selected', 'false');
        }

        currentIndex = targetIndex;

        // Activar nueva diapositiva
        const nextSlide = slideElements[currentIndex];
        if (nextSlide) {
            nextSlide.classList.remove('opacity-0', 'pointer-events-none', 'z-0');
            nextSlide.classList.add('opacity-100', 'pointer-events-auto', 'z-10');
            nextSlide.setAttribute('aria-hidden', 'false');

            const nextImg = nextSlide.querySelector('.hero-slide-img');
            if (nextImg) {
                nextImg.classList.remove('scale-105');
                nextImg.classList.add('scale-100');
            }

            const nextCaption = nextSlide.querySelector('.hero-slide-caption');
            if (nextCaption) {
                nextCaption.classList.remove('translate-y-2', 'opacity-0');
                nextCaption.classList.add('translate-y-0', 'opacity-100');
            }
        }

        // Activar nuevo punto
        const nextDot = dotElements[currentIndex];
        if (nextDot) {
            nextDot.className = 'w-7 h-2 rounded-full bg-brand-gold shadow-xs transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-brand-gold';
            nextDot.setAttribute('aria-selected', 'true');
        }

        resetProgressBar();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    /**
     * Gestión de Autoplay con soporte para 'prefers-reduced-motion'.
     */
    function userPrefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function startAutoplay() {
        if (userPrefersReducedMotion() || isPaused) return;

        stopAutoplay();
        startProgressBar();

        autoplayTimer = setInterval(() => {
            if (!isPaused) {
                nextSlide();
                startProgressBar();
            }
        }, AUTOPLAY_INTERVAL_MS);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
        stopProgressBar();
    }

    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    function pauseAutoplay() {
        isPaused = true;
        stopProgressBar();
    }

    function resumeAutoplay() {
        isPaused = false;
        startAutoplay();
    }

    /**
     * Barra de progreso discreta superior en el carrusel.
     */
    function startProgressBar() {
        if (!progressBar || userPrefersReducedMotion()) return;

        stopProgressBar();
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';

        // Forzar reflujo para reiniciar transición CSS suave
        void progressBar.offsetWidth;

        progressBar.style.transition = `width ${AUTOPLAY_INTERVAL_MS}ms linear`;
        progressBar.style.width = '100%';
    }

    function stopProgressBar() {
        if (!progressBar) return;
        const computedWidth = window.getComputedStyle(progressBar).width;
        progressBar.style.transition = 'none';
        progressBar.style.width = computedWidth;
    }

    function resetProgressBar() {
        if (!progressBar) return;
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        if (!isPaused && !userPrefersReducedMotion()) {
            startProgressBar();
        }
    }

    /**
     * Soporte de gestos táctiles (Swipe) en dispositivos móviles.
     */
    function setupTouchEvents() {
        if (!carouselContainer) return;

        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            pauseAutoplay();
        }, { passive: true });

        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchEndX - touchStartX;

            if (Math.abs(diff) >= SWIPE_THRESHOLD_PX) {
                if (diff < 0) {
                    nextSlide(); // Deslizamiento a la izquierda -> siguiente
                } else {
                    prevSlide(); // Deslizamiento a la derecha -> anterior
                }
            }

            resumeAutoplay();
        }, { passive: true });
    }

    /**
     * Enlaza eventos de ratón, foco y teclado para accesibilidad.
     */
    function setupEventListeners() {
        // Pausar en hover y reanudar al salir
        carouselContainer.addEventListener('mouseenter', pauseAutoplay);
        carouselContainer.addEventListener('mouseleave', resumeAutoplay);

        // Pausar cuando un elemento hijo recibe el foco del teclado (accesibilidad)
        carouselContainer.addEventListener('focusin', pauseAutoplay);
        carouselContainer.addEventListener('focusout', resumeAutoplay);

        // Flechas chevrons
        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                prevSlide();
                restartAutoplay();
            });
        }

        if (btnNext) {
            btnNext.addEventListener('click', () => {
                nextSlide();
                restartAutoplay();
            });
        }

        // Navegación por teclado (Flechas Izquierda / Derecha) al tener foco en el carrusel
        carouselContainer.setAttribute('tabindex', '0');
        carouselContainer.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
                restartAutoplay();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
                restartAutoplay();
            }
        });

        setupTouchEvents();
    }

    /**
     * Inicialización del carrusel una vez disponible el DOM.
     */
    function initHeroCarousel() {
        carouselContainer = document.getElementById('hero-carousel');
        if (!carouselContainer) return;

        slidesTrack = document.getElementById('hero-slides-track');
        btnPrev = document.getElementById('hero-carousel-prev');
        btnNext = document.getElementById('hero-carousel-next');
        dotsContainer = document.getElementById('hero-carousel-dots');
        progressBar = document.getElementById('hero-carousel-progress');

        renderSlides();
        renderDots();
        setupEventListeners();

        // Actualizar iconos Lucide si están presentes en chevrons
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }

        // Iniciar reproducción automática
        startAutoplay();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeroCarousel);
    } else {
        initHeroCarousel();
    }

})();
