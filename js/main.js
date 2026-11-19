/**
 * ============================================================================
 * LOYLIZ | Lógica del Catálogo Dinámico & Micro-interacciones
 * ============================================================================
 * Conexión transparente con Supabase REST API vía CatalogService.
 * Filtros dinámicos de categorías, Skeleton Loading en Marfil Textil (#FAECDA),
 * Ficha Técnica en Modal Cinemático y Efecto 3D Tilt táctil preservado.
 */

// Estado global en memoria para el catálogo
let allProducts = [];
let allCategories = [];
let activeFilter = 'all';

// Elementos del DOM
const catalogGrid = document.getElementById('catalog-grid');
const filterContainer = document.getElementById('filter-container');
const productModal = document.getElementById('product-modal');
const modalContent = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

/**
 * Renderiza tarjetas de carga esqueleto (Skeleton Loading)
 * Diseñadas estrictamente con el color Marfil Textil (#FAECDA) del Brand Kit LOYLIZ
 */
function renderSkeletonLoading(count = 8) {
    if (!catalogGrid) return;
    catalogGrid.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const skeletonCard = document.createElement('div');
        skeletonCard.className = "catalog-card bg-white rounded-2xl overflow-hidden border border-[#FAECDA] shadow-sm flex flex-col justify-between animate-pulse";
        skeletonCard.style.animationDelay = `${(i % 4) * 0.1}s`;

        skeletonCard.innerHTML = `
            <div>
                <!-- Contenedor de Imagen Esqueleto en Marfil Textil (#FAECDA) -->
                <div class="h-64 bg-[#FAECDA]/80 relative flex items-center justify-center overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[silkSheen_2.5s_infinite]"></div>
                    <div class="w-14 h-14 rounded-2xl bg-[#FAECDA] border border-[#D48C95]/20 flex items-center justify-center shadow-inner opacity-80">
                        <svg class="w-7 h-7 text-[#D48C95]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <!-- Badge Esqueleto en Marfil Textil -->
                    <div class="absolute top-3 left-3 h-5 w-28 bg-[#FAECDA] rounded-md border border-[#D48C95]/20 shadow-sm"></div>
                </div>

                <!-- Bloque de Información Esqueleto -->
                <div class="p-5 space-y-3">
                    <div class="flex items-center justify-between">
                        <div class="h-3 w-20 bg-[#FAECDA] rounded"></div>
                        <div class="h-3 w-16 bg-[#FAECDA] rounded"></div>
                    </div>
                    <div class="h-5 w-5/6 bg-[#FAECDA] rounded mt-2"></div>
                    <div class="space-y-1.5 pt-1">
                        <div class="h-3 w-full bg-[#FAECDA]/85 rounded"></div>
                        <div class="h-3 w-3/4 bg-[#FAECDA]/85 rounded"></div>
                    </div>
                    <!-- Línea de Composición / Tela en Marfil Textil -->
                    <div class="pt-3 border-t border-gray-100 flex items-center gap-2">
                        <div class="w-3.5 h-3.5 rounded-full bg-[#FAECDA]"></div>
                        <div class="h-3 w-36 bg-[#FAECDA] rounded"></div>
                    </div>
                </div>
            </div>

            <!-- Botón Esqueleto en Marfil Textil -->
            <div class="p-5 pt-0">
                <div class="h-10 w-full bg-[#FAECDA] rounded-xl border border-[#D48C95]/20"></div>
            </div>
        `;
        catalogGrid.appendChild(skeletonCard);
    }
}

/**
 * Renderiza dinámicamente los botones de filtrado de categorías en el DOM
 */
function renderCategoryFilters(categories) {
    if (!filterContainer) return;

    filterContainer.innerHTML = '';

    // 1. Botón "Todos" siempre al inicio
    const allBtn = document.createElement('button');
    allBtn.className = `filter-btn ${activeFilter === 'all' ? 'active' : ''} px-4 py-2 rounded-full text-xs font-bold transition-all`;
    allBtn.setAttribute('data-filter', 'all');
    allBtn.textContent = 'Todos';
    allBtn.addEventListener('click', () => filterCatalog('all'));
    filterContainer.appendChild(allBtn);

    // 2. Botones dinámicos por cada categoría obtenida de la base de datos
    categories.forEach(cat => {
        if (cat.activo === false) return; // Respetar categorías inactivas
        const btn = document.createElement('button');
        btn.className = `filter-btn ${activeFilter === cat.slug ? 'active' : ''} px-4 py-2 rounded-full text-xs font-bold transition-all`;
        btn.setAttribute('data-filter', cat.slug);
        btn.textContent = cat.nombre;
        btn.addEventListener('click', () => filterCatalog(cat.slug));
        filterContainer.appendChild(btn);
    });
}

/**
 * Renderiza las tarjetas de productos en la cuadrícula del catálogo
 */
function renderCatalog(items) {
    if (!catalogGrid) return;
    catalogGrid.innerHTML = '';

    if (!items || items.length === 0) {
        catalogGrid.innerHTML = `
            <div class="col-span-full py-16 text-center text-gray-500 bg-white rounded-3xl border border-dashed border-[#FAECDA] p-8 shadow-sm">
                <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-brand-cream/80 flex items-center justify-center text-brand-gold">
                    <i data-lucide="package-search" class="w-7 h-7"></i>
                </div>
                <h4 class="font-display font-bold text-lg text-brand-navy">No se encontraron modelos en este rubro por el momento.</h4>
                <p class="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                    Prueba seleccionando otra línea de producción o contáctanos por WhatsApp para diseñar y confeccionar prendas a la medida de tu equipo.
                </p>
                <div class="mt-5">
                    <button onclick="filterCatalog('all')" class="px-5 py-2.5 bg-brand-navy text-brand-gold text-xs font-bold uppercase tracking-wider rounded-full hover:bg-brand-navyDark transition shadow-sm">
                        Ver Todo el Catálogo
                    </button>
                </div>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
        return;
    }

    const fallbackPlaceholder = window.CatalogService ? window.CatalogService.FALLBACK_PLACEHOLDER_IMAGE : '';

    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = "catalog-card tilt-card animate-card-enter bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm flex flex-col justify-between group";
        card.style.animationDelay = `${(index % 8) * 0.05}s`;

        const hasGallery = Array.isArray(item.images) && item.images.length > 1;
        const mainImg = item.image || fallbackPlaceholder;
        const secondImg = hasGallery ? item.images[1] : mainImg;

        // Escape seguro para ID en atributos y llamadas de función
        const safeId = String(item.id).replace(/'/g, "\\'");

        card.innerHTML = `
            <div>
                <!-- Contenedor de Imagen con Efecto Zoom & Previsualización Multi-vista -->
                <div class="img-zoom-container relative h-64 overflow-hidden bg-gray-100 cursor-pointer" onclick="openProductModal('${safeId}')">
                    <img src="${mainImg}" alt="${item.title}" 
                         onerror="this.onerror=null; this.src='${fallbackPlaceholder}';" 
                         class="w-full h-full object-cover transition-opacity duration-500 ${hasGallery ? 'group-hover:opacity-0' : ''}">
                    
                    ${hasGallery ? `
                        <img src="${secondImg}" alt="${item.title} vista alternativa" 
                             onerror="this.onerror=null; this.src='${fallbackPlaceholder}';" 
                             class="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span class="absolute top-3 right-3 bg-brand-navy/85 backdrop-blur-sm text-brand-gold text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 z-10 shadow-sm border border-brand-gold/30">
                            <i data-lucide="camera" class="w-3 h-3 text-brand-gold"></i> ${item.images.length} vistas
                        </span>
                    ` : ''}

                    <div class="absolute inset-0 bg-brand-navy/10 group-hover:bg-brand-navy/0 transition-colors pointer-events-none"></div>

                    <!-- Badge de Categoría / Rubro Oficial -->
                    <span class="absolute top-3 left-3 bg-brand-navy/90 backdrop-blur-sm text-brand-gold text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md z-10 shadow-sm">
                        ${item.rubroLabel}
                    </span>

                    <!-- Acción Rápida en Hover -->
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-brand-navy/30 z-10">
                        <span class="px-4 py-2 bg-white text-brand-navy rounded-full text-xs font-bold tracking-wide shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            <i data-lucide="eye" class="w-3.5 h-3.5 text-brand-navy"></i>
                            Ver Ficha & Galería
                        </span>
                    </div>
                </div>

                <!-- Bloque Informativo -->
                <div class="p-5">
                    <div class="flex items-center justify-between text-xs text-gray-400 font-mono mb-1">
                        <span>REF: ${item.code}</span>
                        <span class="text-gray-500 font-sans font-medium text-[11px]">${item.gender}</span>
                    </div>

                    <h3 class="font-display font-bold text-base text-brand-navy group-hover:text-brand-navyDark transition-colors line-clamp-1 cursor-pointer" onclick="openProductModal('${safeId}')">
                        ${item.title}
                    </h3>

                    <p class="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                        ${item.desc}
                    </p>

                    <!-- Etiqueta de Tipo de Tela / Composición -->
                    <div class="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-600">
                        <i data-lucide="check-circle" class="w-3.5 h-3.5 text-brand-gold shrink-0"></i>
                        <span class="truncate">${item.fabric}</span>
                    </div>
                </div>
            </div>

            <!-- Botón de Acción Inferior: Ver Ficha Técnica -->
            <div class="p-5 pt-0">
                <button onclick="openProductModal('${safeId}')" class="w-full py-2.5 rounded-xl border border-brand-navy/20 text-brand-navy hover:bg-brand-navy hover:text-brand-gold text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2">
                    <span>Ver Ficha Técnica</span>
                    <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
                </button>
            </div>
        `;
        catalogGrid.appendChild(card);
    });

    // Re-inicializar iconos de Lucide en el HTML inyectado
    if (window.lucide) {
        lucide.createIcons();
    }

    // Inicializar o reconectar efecto 3D tilt en las tarjetas
    initCardTilt();
}

/**
 * Función de filtrado por categoría
 */
function filterCatalog(category) {
    activeFilter = category;

    // Actualizar estado activo en todos los botones de filtro del DOM
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Filtrar prendas en memoria
    if (category === 'all') {
        renderCatalog(allProducts);
    } else {
        const filtered = allProducts.filter(item => item.category === category);
        renderCatalog(filtered);
    }

    // Desplazamiento suave al catálogo si se ejecutó desde la sección de líneas de producción
    const catalogSection = document.getElementById('catalogo');
    if (catalogSection && window.scrollY < catalogSection.offsetTop - 300) {
        catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Lógica del Modal Cinemático de Inspección Técnica
 * Poblado dinámico con campos live de Supabase (referencia, nombre, descripción,
 * tela, tallas como píldoras, especificaciones JSONB, galería multi-imagen y deep-link WhatsApp)
 */
function openProductModal(id) {
    const item = allProducts.find(p => String(p.id) === String(id));
    if (!item) return;

    // Tarea 4: Reinicio de posición de scroll al abrir
    if (modalContent) modalContent.scrollTop = 0;
    const modalBodyScroll = document.getElementById('modal-body-scroll');
    if (modalBodyScroll) modalBodyScroll.scrollTop = 0;

    const fallbackPlaceholder = window.CatalogService ? window.CatalogService.FALLBACK_PLACEHOLDER_IMAGE : '';
    const modalImage = document.getElementById('modal-image');

    // Poblado de datos principales
    const nombre = item.nombre || item.title || 'Prenda LOYLIZ Confección Premium';
    const referencia = item.referencia || item.code || `LLZ-${item.id}`;
    const rubro = item.rubroLabel || (item.categorias && item.categorias.nombre) || 'Línea de Confección';
    const descripcion = item.descripcion || item.desc || 'Confección nacional de alta costura con acabados de primera calidad.';
    const tela = item.tela || item.fabric || 'Confección Nacional Premium con Doble Pespunte';
    const colores = item.colores || item.colors || 'Variedad de tonos y combinaciones a elegir';
    const uso = item.uso || item.use || 'Uso profesional, dotaciones y estilo casual diario.';

    document.getElementById('modal-rubro').innerText = rubro;
    document.getElementById('modal-code').innerText = `CÓDIGO DE REFERENCIA: ${referencia}`;
    document.getElementById('modal-title').innerText = nombre;
    document.getElementById('modal-desc').innerText = descripcion;
    document.getElementById('modal-fabric').innerText = tela;

    const colorsEl = document.getElementById('modal-colors');
    if (colorsEl) colorsEl.innerText = colores;

    const useEl = document.getElementById('modal-use');
    if (useEl) useEl.innerText = uso;

    // Tarea 1: Renderizado dinámico de Tallas como Píldoras Limpias
    const sizesContainer = document.getElementById('modal-sizes-pills');
    if (sizesContainer) {
        sizesContainer.innerHTML = '';
        let sizesList = [];
        if (Array.isArray(item.tallas) && item.tallas.length > 0) {
            sizesList = item.tallas;
        } else if (typeof item.sizes === 'string') {
            sizesList = item.sizes
                .replace(/^Tallas\s*:?\s*/i, '')
                .split(/[-–—,;/]+/)
                .map(s => s.trim())
                .filter(Boolean);
        }
        if (sizesList.length === 0) sizesList = ['A convenir'];

        sizesList.forEach(size => {
            const pill = document.createElement('span');
            pill.className = 'px-3 py-1 rounded-lg text-xs font-bold bg-[#FAECDA]/90 text-brand-navy border border-[#D48C95]/40 shadow-xs hover:border-[#D48C95] transition select-none tracking-wide';
            pill.textContent = size;
            sizesContainer.appendChild(pill);
        });
    }

    // Tarea 1: Renderizado dinámico de pares clave-valor de especificaciones (JSONB de Supabase)
    const specsContainer = document.getElementById('modal-specs-container');
    if (specsContainer) {
        specsContainer.innerHTML = '';
        const specs = item.especificaciones;
        if (specs && typeof specs === 'object' && Object.keys(specs).length > 0) {
            specsContainer.classList.remove('hidden');
            Object.entries(specs).forEach(([k, v]) => {
                if (v === null || v === undefined || v === '') return;
                const row = document.createElement('div');
                row.className = 'flex justify-between items-start gap-4 py-1.5 border-b border-gray-100/70 last:border-b-0 text-xs';
                row.innerHTML = `
                    <span class="text-gray-400 font-medium shrink-0">${k}:</span>
                    <span class="font-semibold text-brand-navy text-right max-w-[65%]">${v}</span>
                `;
                specsContainer.appendChild(row);
            });
        } else {
            specsContainer.classList.add('hidden');
        }
    }

    // Tarea 2: Switcher de Galería Multi-imagen & Estado Placeholder si no hay fotos
    const allImgs = (Array.isArray(item.images) && item.images.length > 0) ? item.images : [item.image || fallbackPlaceholder];
    const hasRealPhotos = Boolean(item.hasRealImages && allImgs.length > 0 && !allImgs[0].startsWith('data:image/svg'));

    const emptyBadge = document.getElementById('modal-empty-photos-badge');
    if (emptyBadge) {
        emptyBadge.classList.toggle('hidden', hasRealPhotos);
    }

    modalImage.onerror = function () {
        this.onerror = null;
        this.src = fallbackPlaceholder;
        if (emptyBadge) emptyBadge.classList.remove('hidden');
    };
    modalImage.src = allImgs[0] || fallbackPlaceholder;
    modalImage.alt = nombre;
    modalImage.style.opacity = '1';

    const galleryContainer = document.getElementById('modal-gallery-container');
    if (galleryContainer) {
        galleryContainer.innerHTML = '';

        if (hasRealPhotos && allImgs.length > 1) {
            galleryContainer.classList.remove('hidden');
            allImgs.forEach((imgSrc, idx) => {
                const thumb = document.createElement('button');
                thumb.type = 'button';
                thumb.setAttribute('role', 'tab');
                thumb.setAttribute('aria-label', `Ver vista ${idx + 1} de ${nombre}`);
                thumb.className = `w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${idx === 0 ? 'border-[#D48C95] ring-2 ring-[#D48C95]/40 shadow-sm opacity-100' : 'border-gray-200 hover:border-brand-navy opacity-70 hover:opacity-100'}`;
                thumb.innerHTML = `<img src="${imgSrc}" alt="${nombre} vista ${idx + 1}" onerror="this.onerror=null; this.src='${fallbackPlaceholder}';" class="w-full h-full object-cover">`;

                thumb.addEventListener('click', () => {
                    modalImage.style.opacity = '0.2';
                    setTimeout(() => {
                        modalImage.src = imgSrc;
                        modalImage.style.opacity = '1';
                    }, 140);

                    galleryContainer.querySelectorAll('button').forEach(btn => {
                        btn.className = 'w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-brand-navy opacity-70 hover:opacity-100 transition-all shrink-0 cursor-pointer';
                    });
                    thumb.className = 'w-14 h-14 rounded-xl overflow-hidden border-2 border-[#D48C95] ring-2 ring-[#D48C95]/40 shadow-sm opacity-100 transition-all shrink-0 cursor-pointer';
                });

                galleryContainer.appendChild(thumb);
            });
        } else {
            galleryContainer.classList.add('hidden');
        }
    }

    // Tarea 3: Deep-Link Dinámico de Cotización hacia WhatsApp oficial
    // Formato exacto requerido: "¡Hola LOYLIZ! Me interesa recibir asesoría y cotización sobre el modelo *[nombre]* (REF: *[referencia]*)."
    const msg = encodeURIComponent(`¡Hola LOYLIZ! Me interesa recibir asesoría y cotización sobre el modelo *${nombre}* (REF: *${referencia}*).`);
    const whatsappLink = document.getElementById('modal-whatsapp-link');
    if (whatsappLink) {
        whatsappLink.href = `https://wa.me/584163329389?text=${msg}`;
    }

    // Tarea 4: Apertura y accesibilidad del Modal
    if (productModal && modalContent) {
        productModal.classList.remove('opacity-0', 'pointer-events-none');
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
        document.body.style.overflow = 'hidden';

        if (closeModalBtn) {
            closeModalBtn.focus();
        }
    }

    if (window.lucide) lucide.createIcons();
}

function closeModal() {
    if (!productModal || !modalContent) return;
    productModal.classList.add('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    document.body.style.overflow = '';
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

if (productModal) {
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeModal();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Menú móvil
if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}

// Manejador del Formulario de Contacto & Cotización
function handleFormSubmit(e) {
    e.preventDefault();
    const feedback = document.getElementById('form-feedback');
    if (feedback) {
        feedback.classList.remove('hidden');
        e.target.reset();
        setTimeout(() => {
            feedback.classList.add('hidden');
        }, 5000);
    }
}

// ============================================================================
// ANIMACIONES DINÁMICAS & MICRO-INTERACCIONES
// ============================================================================

/**
 * 1. Efecto 3D Tilt táctil para tarjetas del catálogo
 * Optimizado para tarjetas inyectadas dinámicamente sin duplicar escuchadores
 */
function initCardTilt() {
    // Solo aplicar en dispositivos con puntero fino (mouse) para evitar lag en pantallas táctiles
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.tilt-card:not([data-tilt-ready="true"])');
    cards.forEach(card => {
        card.setAttribute('data-tilt-ready', 'true');
        let bounds = null;

        function handleMouseMove(e) {
            if (!bounds) bounds = card.getBoundingClientRect();
            const mouseX = e.clientX - bounds.left;
            const mouseY = e.clientY - bounds.top;
            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;

            // Inclinación máxima de 5 grados para elegancia sutil
            const maxTilt = 5;
            const tiltX = ((mouseY - centerY) / centerY) * -maxTilt;
            const tiltY = ((mouseX - centerX) / centerX) * maxTilt;

            card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-6px) scale3d(1.015, 1.015, 1.015)`;
        }

        card.addEventListener('mouseenter', () => {
            bounds = card.getBoundingClientRect();
            card.style.transition = 'transform 0.15s ease-out, box-shadow 0.25s ease';
        });

        card.addEventListener('mousemove', handleMouseMove);

        card.addEventListener('mouseleave', () => {
            bounds = null;
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
        });
    });
}

/**
 * 2. Entradas Escalonadas al Scroll (Scroll Reveal Observer)
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('is-revealed'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

/**
 * 3. Contadores Numéricos Animados (Animated Count-Up)
 */
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.counter-number');
    if (!counters.length) return;

    let hasRun = false;

    function runCounters() {
        if (hasRun) return;
        hasRun = true;

        counters.forEach(counter => {
            const symbol = counter.getAttribute('data-symbol');
            if (symbol) {
                counter.textContent = symbol;
                return;
            }

            const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
            const duration = 2000;
            const startTime = performance.now();

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const current = Math.floor(easeOut * target);

                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(update);
        });
    }

    if ('IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runCounters();
                    obs.disconnect();
                }
            });
        }, { threshold: 0.25 });

        const firstCounter = counters[0];
        const container = firstCounter ? firstCounter.closest('section') : null;
        if (container) {
            statsObserver.observe(container);
        } else {
            runCounters();
        }
    } else {
        runCounters();
    }
}

/**
 * ============================================================================
 * INICIALIZACIÓN DINÁMICA DEL CATÁLOGO
 * ============================================================================
 */
async function initDynamicCatalog() {
    // 1. Mostrar skeleton loading inmediato en Marfil Textil (#FAECDA)
    renderSkeletonLoading(8);

    try {
        if (window.CatalogService) {
            // 2. Consultar categorías y productos de forma concurrente
            const [categories, products] = await Promise.all([
                CatalogService.getCategories(),
                CatalogService.getProducts()
            ]);

            allCategories = categories || [];
            allProducts = products || [];

            // Exponer en window para retrocompatibilidad total
            window.catalogItems = allProducts;

            // 3. Renderizar filtros dinámicos y cuadrícula de prendas
            renderCategoryFilters(allCategories);
            renderCatalog(allProducts);
        } else {
            console.warn('[LOYLIZ Catálogo] CatalogService no detectado. Cargando contingencia...');
            renderCatalog([]);
        }
    } catch (err) {
        console.error('[LOYLIZ Catálogo] Error durante la carga dinámica:', err);
        if (window.CatalogService && CatalogService.FALLBACK_PRODUCTOS) {
            allProducts = CatalogService.FALLBACK_PRODUCTOS;
            allCategories = CatalogService.FALLBACK_CATEGORIAS;
            window.catalogItems = allProducts;
            renderCategoryFilters(allCategories);
            renderCatalog(allProducts);
        }
    }
}

// Exposición de funciones en window para que los botones con onclick inline funcionen siempre
window.filterCatalog = filterCatalog;
window.openProductModal = openProductModal;
window.closeModal = closeModal;
window.handleFormSubmit = handleFormSubmit;
window.renderCatalog = renderCatalog;
window.renderSkeletonLoading = renderSkeletonLoading;

// Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    initDynamicCatalog();
    initScrollReveal();
    initAnimatedCounters();
});
