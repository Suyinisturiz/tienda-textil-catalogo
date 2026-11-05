// Catalog Data - LOYLIZ (Exhibición y Asesoría Textil Premium)
const catalogItems = [
    {
        id: 1,
        title: "Conjunto Médico Essential V-Neck",
        category: "sanitarios",
        rubroLabel: "Línea Sanitaria & Quirúrgica",
        code: "LLZ-MED-01",
        gender: "Unisex / Profesional de la Salud",
        desc: "Diseñado para profesionales que exigen libertad de movimiento y protección total sin sacrificar la elegancia en clínica.",
        fabric: "Microfibra Antifluido de 4 vías (95% Poliéster, 5% Spandex)",
        sizes: "XS - S - M - L - XL - XXL",
        colors: "Azul Quirúrgico, Verde Salvia, Negro Ónix, Rosa Palo, Blanco Puro",
        use: "Guardias hospitalarias, consultorios odontológicos, clínicas estéticas y veterinarias.",
        image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 2,
        title: "Jerseys Deportivos (LVBP Fan Edition)",
        category: "deportivos",
        rubroLabel: "Jerseys Deportivos (LVBP)",
        code: "LLZ-DEP-02",
        gender: "Unisex / Fanáticos & Ligas",
        desc: "Telas tipo mesh transpirables con diseños sublimes de alta resolución para alentar a tu equipo con clase.",
        fabric: "100% Poliéster Dry-Fit & Micro-Mesh de ventilación activa",
        sizes: "S - M - L - XL - XXL",
        colors: "Edición Magallanes, Caracas, La Guaira, Aragua, Zulia, Lara",
        use: "Juegos de béisbol, eventos deportivos corporativos y estilo casual urbano.",
        image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 3,
        title: "Hoodie Sweater Temático Peanuts x Snoopy Since 1950",
        category: "casual",
        rubroLabel: "Colecciones Temáticas & Casual",
        code: "LLZ-CAS-SNOOPY",
        gender: "Unisex / Dama & Caballero",
        desc: "Sweater tipo hoodie con capucha y cordón ajustable confeccionado en algodón perchado premium. Incluye parche bordado circular frontal de Snoopy en rosa pastel, bolsillo canguro, serigrafía de alta definición con personajes clásicos en manga derecha, tipografía 'Snoopy' con huellas en manga izquierda, y en la espalda la emblemática gráfica 'PEANUTS SINCE 1950' con viñetas multicolores. Acabados con costuras de doble pespunte y puños acanalados de alta durabilidad.",
        fabric: "80% Algodón Peinado Perchado, 20% Poliéster (320 gsm - Felpa Interior Térmica Suave)",
        sizes: "XS - S - M - L - XL (Corte Regular / Oversize Confort)",
        colors: "Blanco Hueso / Off-White (Edición Especial Peanuts), Gris Jaspe, Negro Antracita, Menta LOYLIZ",
        use: "Uso casual urbano, streetwear de autor, colecciones temáticas exclusivas y asesoría de estilo diario.",
        image: "img/productos/sweater-snoopy/snoopy-hoodie-front-model.jpg",
        images: [
            "img/productos/sweater-snoopy/snoopy-hoodie-front-model.jpg",
            "img/productos/sweater-snoopy/snoopy-hoodie-back-model.jpg",
            "img/productos/sweater-snoopy/snoopy-hoodie-front-flat.jpg",
            "img/productos/sweater-snoopy/snoopy-hoodie-back-flat.jpg"
        ]
    },
    {
        id: 4,
        title: "Franelas & Básicos Premium 24/1",
        category: "franelas",
        rubroLabel: "Franelas & Básicos Premium",
        code: "LLZ-BAS-04",
        gender: "Unisex / Fondo de Armario",
        desc: "Básicos atemporales confeccionados con algodón de máxima suavidad para tus looks más versátiles.",
        fabric: "100% Algodón Peinado Premium 24/1 (190 gsm) con doble pespunte",
        sizes: "XS - S - M - L - XL - XXL",
        colors: "Blanco Puro, Gris Antracita, Verde Menta Suave, Negro Profundo",
        use: "Prendas esenciales de uso diario, asesoría de fondo de armario y dotaciones.",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 5,
        title: "Uniformes Corporativos & Camisería",
        category: "corporativos",
        rubroLabel: "Uniformes Corporativos",
        code: "LLZ-CORP-05",
        gender: "Dama & Caballero",
        desc: "Proyecta la mejor imagen de tu marca con prendas duraderas, elegantes y personalizadas.",
        fabric: "Popelina Oxford Mercerizada 65/35 & Piqué Algodón Antipilling",
        sizes: "S - M - L - XL - XXL",
        colors: "Blanco Ejecutivo, Celeste Corporativo, Azul Marino, Gris Antracita",
        use: "Equipos de ventas, personal de oficina, recepciones y eventos institucionales.",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 6,
        title: "Conjunto Infantil & Juvenil Confort-Max",
        category: "infantil",
        rubroLabel: "Infantil & Juvenil",
        code: "LLZ-KID-06",
        gender: "Niños & Niñas (4 a 16)",
        desc: "Diseños resistentes y súper cómodos diseñados para el ritmo inagotable de los más pequeños.",
        fabric: "Algodón Fleece Hipoalergénico con costuras elásticas de doble pespunte",
        sizes: "Tallas 4, 6, 8, 10, 12, 14, 16",
        colors: "Verde Menta, Gris Jaspe, Azul Marino, Blanco",
        use: "Educación física, colegio, deportes y juego activo diario.",
        image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 7,
        title: "Scrub Quirúrgico Jogger Ergo-Flex",
        category: "sanitarios",
        rubroLabel: "Línea Sanitaria & Quirúrgica",
        code: "LLZ-MED-07",
        gender: "Mujer / Hombre",
        desc: "Uniformes antifluido ligeros que te brindan seguridad y estilo durante tus guardias más exigentes.",
        fabric: "Microfibra Antifluido de Grado Hospitalario con repelencia certificada",
        sizes: "XS - S - M - L - XL",
        colors: "Verde Menta LOYLIZ, Azul Quirúrgico, Negro Ónix, Gris Plomo",
        use: "Guardias clínicas, quirófano, anestesiología, enfermería y veterinaria.",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 8,
        title: "Chaqueta Bomber Deportiva Mesh Pro",
        category: "deportivos",
        rubroLabel: "Jerseys Deportivos (LVBP)",
        code: "LLZ-DEP-08",
        gender: "Unisex",
        desc: "Chaqueta liviana de corte ergonómico con forro interior en micro-mesh transpirable y rib elástico reforzado.",
        fabric: "100% Poliéster Ripstop & Rib elástico indeformable",
        sizes: "S - M - L - XL - XXL",
        colors: "Sublimación Total de Equipos LVBP / Diseños Personalizados",
        use: "Entrenamientos, salidas de viaje de delegaciones y fanaticada.",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80"
    }
];

// DOM Elements
const catalogGrid = document.getElementById('catalog-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const productModal = document.getElementById('product-modal');
const modalContent = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

// Render Catalog Cards
function renderCatalog(items) {
    catalogGrid.innerHTML = '';
    
    if (items.length === 0) {
        catalogGrid.innerHTML = `
            <div class="col-span-full py-12 text-center text-gray-400">
                <p class="text-sm">No se encontraron modelos en este rubro por el momento.</p>
            </div>
        `;
        return;
    }

    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = "catalog-card tilt-card animate-card-enter bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm flex flex-col justify-between group";
        card.style.animationDelay = `${(index % 8) * 0.05}s`;
        
        const hasGallery = item.images && item.images.length > 1;
        const secondImg = hasGallery ? item.images[1] : item.image;

        card.innerHTML = `
            <div>
                <!-- Image Container with Zoom effect & Multi-view Hover -->
                <div class="img-zoom-container relative h-64 overflow-hidden bg-gray-100 cursor-pointer" onclick="openProductModal(${item.id})">
                    <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover transition-opacity duration-500 ${hasGallery ? 'group-hover:opacity-0' : ''}">
                    ${hasGallery ? `
                        <img src="${secondImg}" alt="${item.title} vista alternativa" class="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span class="absolute top-3 right-3 bg-brand-navy/85 backdrop-blur-sm text-brand-gold text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 z-10 shadow-sm border border-brand-gold/30">
                            <i data-lucide="camera" class="w-3 h-3 text-brand-gold"></i> ${item.images.length} vistas
                        </span>
                    ` : ''}
                    <div class="absolute inset-0 bg-brand-navy/10 group-hover:bg-brand-navy/0 transition-colors pointer-events-none"></div>
                    
                    <!-- Rubro Tag -->
                    <span class="absolute top-3 left-3 bg-brand-navy/90 backdrop-blur-sm text-brand-gold text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md z-10 shadow-sm">
                        ${item.rubroLabel}
                    </span>

                    <!-- Quick View Overlay Action -->
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-brand-navy/30 z-10">
                        <span class="px-4 py-2 bg-white text-brand-navy rounded-full text-xs font-bold tracking-wide shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            <i data-lucide="eye" class="w-3.5 h-3.5 text-brand-navy"></i>
                            Ver Ficha & Galería
                        </span>
                    </div>
                </div>

                <!-- Info Block -->
                <div class="p-5">
                    <div class="flex items-center justify-between text-xs text-gray-400 font-mono mb-1">
                        <span>REF: ${item.code}</span>
                        <span class="text-gray-500 font-sans font-medium text-[11px]">${item.gender}</span>
                    </div>

                    <h3 class="font-display font-bold text-base text-brand-navy group-hover:text-emerald-900 transition-colors line-clamp-1 cursor-pointer" onclick="openProductModal(${item.id})">
                        ${item.title}
                    </h3>

                    <p class="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                        ${item.desc}
                    </p>

                    <!-- Spec tags -->
                    <div class="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-600">
                        <i data-lucide="check-circle" class="w-3.5 h-3.5 text-brand-gold shrink-0"></i>
                        <span class="truncate">${item.fabric}</span>
                    </div>
                </div>
            </div>

            <!-- Footer Action inside Card -->
            <div class="p-5 pt-0">
                <button onclick="openProductModal(${item.id})" class="w-full py-2.5 rounded-xl border border-brand-navy/20 text-brand-navy hover:bg-brand-navy hover:text-brand-gold text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2">
                    <span>Ver Ficha Técnica</span>
                    <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
                </button>
            </div>
        `;
        catalogGrid.appendChild(card);
    });

    // Re-initialize Lucide icons for the dynamically injected HTML
    if (window.lucide) {
        lucide.createIcons();
    }

    // Inicializar efecto 3D tilt en las tarjetas
    initCardTilt();
}

// Filter function
function filterCatalog(category) {
    // Update active button state
    filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Filter items
    if (category === 'all') {
        renderCatalog(catalogItems);
    } else {
        const filtered = catalogItems.filter(item => item.category === category);
        renderCatalog(filtered);
    }

    // Smooth scroll down to catalog if initiated from categories section
    const catalogSection = document.getElementById('catalogo');
    if (window.scrollY < catalogSection.offsetTop - 300) {
        catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Event Listeners for Filters
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-filter');
        filterCatalog(category);
    });
});

// Modal Logic
function openProductModal(id) {
    const item = catalogItems.find(p => p.id === id);
    if (!item) return;

    const modalImage = document.getElementById('modal-image');
    modalImage.src = item.image;
    modalImage.alt = item.title;
    document.getElementById('modal-rubro').innerText = item.rubroLabel;
    document.getElementById('modal-code').innerText = `CÓDIGO DE REFERENCIA: ${item.code}`;
    document.getElementById('modal-title').innerText = item.title;
    document.getElementById('modal-desc').innerText = item.desc;
    document.getElementById('modal-fabric').innerText = item.fabric;
    document.getElementById('modal-sizes').innerText = item.sizes;
    document.getElementById('modal-colors').innerText = item.colors;
    document.getElementById('modal-use').innerText = item.use;

    // Configuración interactiva de la Galería de Miniaturas (Thumbnails)
    const galleryContainer = document.getElementById('modal-gallery-container');
    if (galleryContainer) {
        galleryContainer.innerHTML = '';
        const allImages = (item.images && item.images.length > 0) ? item.images : [item.image];

        if (allImages.length > 1) {
            galleryContainer.classList.remove('hidden');
            allImages.forEach((imgSrc, idx) => {
                const thumb = document.createElement('button');
                thumb.type = 'button';
                thumb.className = `w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${idx === 0 ? 'border-brand-gold ring-2 ring-brand-gold/40 shadow-sm' : 'border-gray-200 hover:border-brand-navy opacity-70 hover:opacity-100'}`;
                thumb.innerHTML = `<img src="${imgSrc}" alt="${item.title} vista ${idx + 1}" class="w-full h-full object-cover">`;
                
                thumb.addEventListener('click', () => {
                    modalImage.style.opacity = '0.3';
                    setTimeout(() => {
                        modalImage.src = imgSrc;
                        modalImage.style.opacity = '1';
                    }, 140);

                    galleryContainer.querySelectorAll('button').forEach(btn => {
                        btn.className = 'w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-brand-navy opacity-70 hover:opacity-100 transition-all shrink-0 cursor-pointer';
                    });
                    thumb.className = 'w-14 h-14 rounded-xl overflow-hidden border-2 border-brand-gold ring-2 ring-brand-gold/40 shadow-sm transition-all shrink-0 cursor-pointer';
                });

                galleryContainer.appendChild(thumb);
            });
        } else {
            galleryContainer.classList.add('hidden');
        }
    }

    // Direct WhatsApp message to LOYLIZ with pre-filled item name
    const msg = encodeURIComponent(`¡Hola LOYLIZ! Quiero recibir asesoría para renovar mis prendas/uniformes. Me interesa el modelo: ${item.title} (REF: ${item.code}) de la ${item.rubroLabel}.`);
    document.getElementById('modal-whatsapp-link').href = `https://api.whatsapp.com/send?phone=584163329389&text=${msg}`;

    // Open Modal
    productModal.classList.remove('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('scale-95');
    modalContent.classList.add('scale-100');
    document.body.style.overflow = 'hidden';

    if (window.lucide) lucide.createIcons();
}

function closeModal() {
    productModal.classList.add('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    document.body.style.overflow = '';
}

closeModalBtn.addEventListener('click', closeModal);

productModal.addEventListener('click', (e) => {
    if (e.target === productModal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu on clicking links
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Form Mock Handler
function handleFormSubmit(e) {
    e.preventDefault();
    const feedback = document.getElementById('form-feedback');
    feedback.classList.remove('hidden');
    e.target.reset();
    setTimeout(() => {
        feedback.classList.add('hidden');
    }, 5000);
}

// ========================================================
// ANIMACIONES DINÁMICAS & MICRO-INTERACCIONES
// ========================================================

// 1. Efecto 3D Tilt táctil para tarjetas del catálogo
function initCardTilt() {
    // Solo aplicar en dispositivos con puntero fino (mouse) para evitar lag en táctil
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
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

// 2. Entradas Escalonadas al Scroll (Scroll Reveal Observer)
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

// 3. Contadores Numéricos Animados (Animated Count-Up)
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
            const duration = 2000; // 2 segundos de animación fluida
            const startTime = performance.now();

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Función de aceleración suave (easeOutExpo)
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
        const container = firstCounter.closest('section');
        if (container) {
            statsObserver.observe(container);
        } else {
            runCounters();
        }
    } else {
        runCounters();
    }
}

// Initial render & animaciones
document.addEventListener('DOMContentLoaded', () => {
    renderCatalog(catalogItems);
    initScrollReveal();
    initAnimatedCounters();
    initCardTilt();
});

