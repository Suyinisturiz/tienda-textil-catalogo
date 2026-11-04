// Catalog Data (Without prices - Purely for showroom/exhibition)
const catalogItems = [
    {
        id: 1,
        title: "Chaqueta Bomber Streetwear",
        category: "urbana",
        rubroLabel: "Moda Urbana",
        code: "URB-082",
        gender: "Hombre / Unisex",
        desc: "Chaqueta liviana de corte oversize confeccionada con forro microfibra respirable, puños y cuello elásticos con tejido acanalado de alta durabilidad.",
        fabric: "100% Poliéster Ripstop & Rib elástico",
        sizes: "S, M, L, XL, XXL",
        colors: "Negro Ónix, Azul Marino, Verde Militar",
        use: "Uso casual, marca propia y colecciones urbanas",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 2,
        title: "Filipina Sanitaria Ergonomic Stretch",
        category: "sanitarios",
        rubroLabel: "Línea Sanitaria",
        code: "SAN-104",
        gender: "Mujer / Hombre",
        desc: "Filipina médica con cuello en V reforzado, doble bolsillo frontal ergonómico y tratamiento hidrofóbico antifluido de grado clínico.",
        fabric: "72% Poliéster, 24% Rayón, 4% Spandex Antifluido",
        sizes: "XS, S, M, L, XL",
        colors: "Azul Marino (#000080), Celeste Quirúrgico, Verde Clínico, Blanco",
        use: "Clínicas, hospitales, odontología y laboratorios",
        image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 3,
        title: "Franela Clásica Cuello Redondo 24/1",
        category: "franelas",
        rubroLabel: "Franelas & Básicos",
        code: "BAS-015",
        gender: "Unisex",
        desc: "Franela de corte regular fit en algodón peinado premium. Acabado suave al tacto con costura en hombros reforzada y cuello indeformable.",
        fabric: "100% Algodón Peinado 24/1 (180 gsm)",
        sizes: "S, M, L, XL, XXL",
        colors: "Blanco, Azul Marino, Negro, Mostaza (#e9dc83), Gris Jaspe",
        use: "Merchandising, dotación de empresas y ropa cotidiana",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 4,
        title: "Polera Escolar Piqué Reforzada",
        category: "escolares",
        rubroLabel: "Uniformes Escolares",
        code: "ESC-201",
        gender: "Niños & Juvenil",
        desc: "Polera tipo polo en tejido piqué de alta resistencia al pilling. Cuello y puños tejidos con hilatura reforzada para soportar lavados frecuentes.",
        fabric: "65% Poliéster, 35% Algodón Piqué (220 gsm)",
        sizes: "Tallas 4 a 16 (Infantil) & S a L (Juvenil)",
        colors: "Blanco Institucional, Azul Marino, Rojo Borgoña, Verde Botella",
        use: "Colegios, liceos e instituciones educativas",
        image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 5,
        title: "Vestido Camisero Lino Fresh",
        category: "cotidiana",
        rubroLabel: "Ropa Cotidiana",
        code: "COT-310",
        gender: "Mujer",
        desc: "Vestido versátil de corte midi con botones de madera ecológicos, cinturón ajustable y textura fresca pensada para clima cálido y templado.",
        fabric: "70% Lino Natural, 30% Algodón Suave",
        sizes: "XS, S, M, L",
        colors: "Beige Lino, Azul Profundo, Terracota, Blanco",
        use: "Moda casual de día, boutique y uso cotidiano",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 6,
        title: "Pantalón Escolar Gabardina Antiarrugas",
        category: "escolares",
        rubroLabel: "Uniformes Escolares",
        code: "ESC-205",
        gender: "Niño / Hombre",
        desc: "Pantalón de corte recto clásico con pretina reforzada y costuras dobles en tiro. Tejido tratado para fácil planchado y máxima duración.",
        fabric: "65% Poliéster, 35% Algodón Gabardina Pesada",
        sizes: "Tallas 6 a 16 & Tallas 28 a 38",
        colors: "Azul Marino (#000080), Gris Oxford, Caqui",
        use: "Uniformes de colegio, secundarias e institutos",
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 7,
        title: "Pantalón Jogger Scrub Antifluido",
        category: "sanitarios",
        rubroLabel: "Línea Sanitaria",
        code: "SAN-108",
        gender: "Unisex",
        desc: "Pantalón médico estilo jogger con cintura elástica con cordón de ajuste, 6 bolsillos funcionales para instrumental y puños tobilleros flexibles.",
        fabric: "Microfibra elástica antifluido con repelencia de líquidos",
        sizes: "XS, S, M, L, XL, XXL",
        colors: "Azul Marino, Negro, Verde Quirófano, Gris Plomo",
        use: "Personal de salud, enfermería, veterinarias y spas",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 8,
        title: "Conjunto Deportivo Infantil Algodón",
        category: "ninos",
        rubroLabel: "Infantil & Juvenil",
        code: "NIN-401",
        gender: "Niños & Niñas",
        desc: "Dúo de polerón con capucha y pantalón jogger en felpa de algodón afelpado interior. Hipoalergénico y suave para pieles sensibles.",
        fabric: "80% Algodón Fleece, 20% Poliéster",
        sizes: "Tallas 4, 6, 8, 10, 12, 14",
        colors: "Azul Marino con detalles Amarillo Claro (#e9dc83), Gris Jaspe, Rosa",
        use: "Colegios (educación física), deportes y tiempo libre",
        image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 9,
        title: "Camisa Casual Manga Larga Slim Fit",
        category: "cotidiana",
        rubroLabel: "Ropa Cotidiana",
        code: "COT-315",
        gender: "Hombre",
        desc: "Camisa en popelina de algodón peinado con cuello inglés estructurado. Corte ergonómico que permite libertad de movimiento sin perder porte elegante.",
        fabric: "100% Algodón Popelina Mercerizada",
        sizes: "S, M, L, XL",
        colors: "Blanco, Celeste Claro, Azul Marino, Rayas Finas",
        use: "Oficina, eventos casuales y ropa de diario",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 10,
        title: "Bata Médica de Laboratorio / Clínica",
        category: "sanitarios",
        rubroLabel: "Línea Sanitaria",
        code: "SAN-112",
        gender: "Unisex",
        desc: "Bata blanca manga larga con botones ocultos, cuello solapa y aberturas laterales para acceso rápido a bolsillos de pantalón interior.",
        fabric: "Gabardina liviana médica con teflón antifluido",
        sizes: "S, M, L, XL",
        colors: "Blanco Óptico Puro",
        use: "Médicos, farmacias, laboratorios y universidades",
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 11,
        title: "Hoodie Utilitario Oversize con Canguro",
        category: "urbana",
        rubroLabel: "Moda Urbana",
        code: "URB-094",
        gender: "Unisex",
        desc: "Sudadera de alto gramaje con bolsillo tipo canguro y cordones gruesos con herretes metálicos dorados. Estilo contemporáneo y abrigador.",
        fabric: "Algodón perchado pesado (320 gsm)",
        sizes: "M, L, XL, XXL",
        colors: "Negro, Azul Marino, Crema / Arena (#fbfaf5)",
        use: "Líneas de moda joven y streetwear",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 12,
        title: "Franela Manga Larga Raglán Bicolor",
        category: "franelas",
        rubroLabel: "Franelas & Básicos",
        code: "BAS-022",
        gender: "Hombre / Mujer",
        desc: "Camiseta de mangas estilo raglán combinadas en contraste azul marino (#000080) con cuerpo en tono claro. Confección liviana y transpirable.",
        fabric: "Jersey 100% Algodón Peinado 30/1",
        sizes: "S, M, L, XL",
        colors: "Cuerpo Crema con mangas Navy, Blanco con mangas Negras",
        use: "Equipos deportivos, uniformes informales y catálogo juvenil",
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=700&q=80"
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

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = "catalog-card bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm flex flex-col justify-between group";
        
        card.innerHTML = `
            <div>
                <!-- Image Container with Zoom effect -->
                <div class="img-zoom-container relative h-64 overflow-hidden bg-gray-100 cursor-pointer" onclick="openProductModal(${item.id})">
                    <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-brand-navy/10 group-hover:bg-brand-navy/0 transition-colors"></div>
                    
                    <!-- Rubro Tag -->
                    <span class="absolute top-3 left-3 bg-brand-navy/90 backdrop-blur-sm text-brand-gold text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md">
                        ${item.rubroLabel}
                    </span>

                    <!-- Quick View Overlay Action -->
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-brand-navy/30">
                        <span class="px-4 py-2 bg-white text-brand-navy rounded-full text-xs font-bold tracking-wide shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                            Ficha de Exhibición
                        </span>
                    </div>
                </div>

                <!-- Info Block -->
                <div class="p-5">
                    <div class="flex items-center justify-between text-xs text-gray-400 font-mono mb-1">
                        <span>REF: ${item.code}</span>
                        <span class="text-gray-500 font-sans font-medium text-[11px]">${item.gender}</span>
                    </div>

                    <h3 class="font-display font-bold text-base text-brand-navy group-hover:text-blue-900 transition-colors line-clamp-1 cursor-pointer" onclick="openProductModal(${item.id})">
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

    document.getElementById('modal-image').src = item.image;
    document.getElementById('modal-image').alt = item.title;
    document.getElementById('modal-rubro').innerText = item.rubroLabel;
    document.getElementById('modal-code').innerText = `CÓDIGO DE REFERENCIA: ${item.code}`;
    document.getElementById('modal-title').innerText = item.title;
    document.getElementById('modal-desc').innerText = item.desc;
    document.getElementById('modal-fabric').innerText = item.fabric;
    document.getElementById('modal-sizes').innerText = item.sizes;
    document.getElementById('modal-colors').innerText = item.colors;
    document.getElementById('modal-use').innerText = item.use;

    // Direct WhatsApp message with pre-filled item name
    const msg = encodeURIComponent(`Hola, me interesa solicitar muestras e información sobre el modelo: ${item.title} (Ref: ${item.code}) del rubro ${item.rubroLabel}.`);
    document.getElementById('modal-whatsapp-link').href = `https://wa.me/?text=${msg}`;

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

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderCatalog(catalogItems);
});

