/**
 * ============================================================================
 * LOYLIZ | Servicio de Catálogo Dinámico (Supabase REST API & Fallback)
 * ============================================================================
 * Arquitectura sin dependencias externas (Zero-Build Vanilla JS con native fetch).
 * Integra consumo de PostgreSQL + Supabase Storage vía PostgREST,
 * caché inteligente en sessionStorage (TTL de 5 minutos) y contingencia (fallback)
 * transparente en caso de falta de credenciales o errores de red.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.CatalogService = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    // Constantes de configuración de caché
    const CACHE_KEYS = {
        CATEGORIAS: 'loyliz_cache_categorias_v1',
        PRODUCTOS: 'loyliz_cache_productos_v1'
    };
    const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos de tiempo de vida (TTL)

    /**
     * Marcador de posición (Placeholder) elegante en SVG para prendas sin fotografía aún.
     * Diseñado estrictamente con el Brand Kit LOYLIZ:
     * - Fondo: Marfil Textil (#FAECDA)
     * - Trazo y Detalles: Midnight Navy (#152942) & Palo de Rosa (#D48C95)
     */
    const FALLBACK_PLACEHOLDER_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="#FAECDA"/>
    <defs>
        <radialGradient id="halo" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#FAECDA" stop-opacity="0"/>
        </radialGradient>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#152942" stroke-width="0.5" stroke-opacity="0.05"/>
        </pattern>
    </defs>
    <rect width="600" height="600" fill="url(#grid)"/>
    <circle cx="300" cy="260" r="130" fill="url(#halo)"/>
    
    <!-- Ícono estilizado de confección textil y percha de alta costura -->
    <g transform="translate(300, 240) scale(1.1)" text-anchor="middle">
        <path d="M -70 40 C -70 10, -20 -15, 0 -35 C 20 -15, 70 10, 70 40 Z" fill="none" stroke="#152942" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M 0 -35 C -5 -45, -15 -55, 0 -65 C 15 -75, 12 -45, 0 -35" fill="none" stroke="#D48C95" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="0" cy="20" r="5" fill="#D48C95"/>
        <line x1="-50" y1="40" x2="50" y2="40" stroke="#152942" stroke-width="3.5" stroke-linecap="round"/>
    </g>

    <!-- Tipografía de marca LOYLIZ -->
    <text x="300" y="380" font-family="'Montserrat', sans-serif" font-size="22" font-weight="800" fill="#152942" text-anchor="middle" letter-spacing="4">
        LOY<tspan fill="#D48C95">LIZ</tspan>
    </text>
    <text x="300" y="408" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600" fill="#152942" text-anchor="middle" letter-spacing="2" opacity="0.75">
        MUESTRARIO EN CONFECCIÓN
    </text>
    <text x="300" y="430" font-family="'Open Sans', sans-serif" font-size="10" font-weight="500" fill="#B36573" text-anchor="middle" letter-spacing="1">
        ✦ Fotografía disponible próximamente ✦
    </text>
</svg>
`)}`;

    /**
     * Categorías de muestra precargadas (Fallback oficial para contingencia)
     */
    const FALLBACK_CATEGORIAS = [
        { id: 1, slug: 'sanitarios', nombre: 'Sanitaria & Quirúrgica', subtitulo: 'Bioseguridad & Confort', orden: 1, activo: true },
        { id: 2, slug: 'deportivos', nombre: 'Jerseys Deportivos', subtitulo: 'Pasión en Movimiento', orden: 2, activo: true },
        { id: 3, slug: 'casual', nombre: 'Temáticas & Casual', subtitulo: 'Estilo Único', orden: 3, activo: true },
        { id: 4, slug: 'franelas', nombre: 'Básicos Premium', subtitulo: 'Esenciales del Día a Día', orden: 4, activo: true },
        { id: 5, slug: 'corporativos', nombre: 'Corporativos', subtitulo: 'Identidad Empresarial', orden: 5, activo: true },
        { id: 6, slug: 'infantil', nombre: 'Infantil & Juvenil', subtitulo: 'Comodidad para Crecer', orden: 6, activo: true }
    ];

    /**
     * Prendas y modelos de muestra precargados (Fallback oficial para contingencia)
     * Enriquecidos con fichas técnicas completas, especificaciones JSONB y tallas en array
     */
    const FALLBACK_PRODUCTOS = [
        {
            id: 1,
            nombre: "Conjunto Médico Essential V-Neck",
            title: "Conjunto Médico Essential V-Neck",
            category: "sanitarios",
            rubroLabel: "Línea Sanitaria & Quirúrgica",
            referencia: "LLZ-MED-01",
            code: "LLZ-MED-01",
            gender: "Unisex / Profesional de la Salud",
            genero: "Unisex / Profesional de la Salud",
            desc: "Diseñado para profesionales que exigen libertad de movimiento y protección total sin sacrificar la elegancia en clínica.",
            descripcion: "Diseñado para profesionales que exigen libertad de movimiento y protección total sin sacrificar la elegancia en clínica.",
            fabric: "Microfibra Antifluido de 4 vías (95% Poliéster, 5% Spandex)",
            tela: "Microfibra Antifluido de 4 vías (95% Poliéster, 5% Spandex)",
            sizes: "XS - S - M - L - XL - XXL",
            tallas: ["XS", "S", "M", "L", "XL", "XXL"],
            colors: "Azul Quirúrgico, Verde Salvia, Negro Ónix, Rosa Palo, Blanco Puro",
            colores: "Azul Quirúrgico, Verde Salvia, Negro Ónix, Rosa Palo, Blanco Puro",
            use: "Guardias hospitalarias, consultorios odontológicos, clínicas estéticas y veterinarias.",
            uso: "Guardias hospitalarias, consultorios odontológicos, clínicas estéticas y veterinarias.",
            especificaciones: {
                "Tecnología": "Repelencia certificada a fluidos hospitalarios (4 vías)",
                "Gramaje": "165 gsm (Ultra ligero y transpirable)",
                "Costura": "Doble pespunte reforzado en áreas de alta fricción",
                "Bolsillos": "2 bolsillos frontales profundos + 1 porta-lapicero",
                "Cuidado Textil": "Apto para lavado clínico y secado rápido"
            },
            hasRealImages: true,
            image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=700&q=80",
            images: [
                "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=700&q=80"
            ]
        },
        {
            id: 2,
            nombre: "Jerseys Deportivos (LVBP Fan Edition)",
            title: "Jerseys Deportivos (LVBP Fan Edition)",
            category: "deportivos",
            rubroLabel: "Jerseys Deportivos (LVBP)",
            referencia: "LLZ-DEP-02",
            code: "LLZ-DEP-02",
            gender: "Unisex / Fanáticos & Ligas",
            genero: "Unisex / Fanáticos & Ligas",
            desc: "Telas tipo mesh transpirables con diseños sublimes de alta resolución para alentar a tu equipo con clase.",
            descripcion: "Telas tipo mesh transpirables con diseños sublimes de alta resolución para alentar a tu equipo con clase.",
            fabric: "100% Poliéster Dry-Fit & Micro-Mesh de ventilación activa",
            tela: "100% Poliéster Dry-Fit & Micro-Mesh de ventilación activa",
            sizes: "S - M - L - XL - XXL",
            tallas: ["S", "M", "L", "XL", "XXL"],
            colors: "Edición Magallanes, Caracas, La Guaira, Aragua, Zulia, Lara",
            colores: "Edición Magallanes, Caracas, La Guaira, Aragua, Zulia, Lara",
            use: "Juegos de béisbol, eventos deportivos corporativos y estilo casual urbano.",
            uso: "Juegos de béisbol, eventos deportivos corporativos y estilo casual urbano.",
            especificaciones: {
                "Tecnología": "Dry-Fit de evaporación acelerada de sudor",
                "Gramaje": "175 gsm (Tejido transpirable de alta resistencia)",
                "Estampado": "Sublimación digital HD indeleble y de colores vivos",
                "Cuello": "Corte en V atlético reforzado indeformable",
                "Edición Especial": "Colección inspirada en la pelota profesional venezolana"
            },
            hasRealImages: true,
            image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=700&q=80",
            images: [
                "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=700&q=80"
            ]
        },
        {
            id: 3,
            nombre: "Hoodie Sweater Temático Peanuts x Snoopy Since 1950",
            title: "Hoodie Sweater Temático Peanuts x Snoopy Since 1950",
            category: "casual",
            rubroLabel: "Colecciones Temáticas & Casual",
            referencia: "LLZ-CAS-SNOOPY",
            code: "LLZ-CAS-SNOOPY",
            gender: "Unisex / Dama & Caballero",
            genero: "Unisex / Dama & Caballero",
            desc: "Sweater tipo hoodie con capucha y cordón ajustable confeccionado en algodón perchado premium. Incluye parche bordado circular frontal de Snoopy en rosa pastel, bolsillo canguro, serigrafía de alta definición con personajes clásicos en manga derecha, tipografía 'Snoopy' con huellas en manga izquierda, y en la espalda la emblemática gráfica 'PEANUTS SINCE 1950' con viñetas multicolores. Acabados con costuras de doble pespunte y puños acanalados de alta durabilidad.",
            descripcion: "Sweater tipo hoodie con capucha y cordón ajustable confeccionado en algodón perchado premium. Incluye parche bordado circular frontal de Snoopy en rosa pastel, bolsillo canguro, serigrafía de alta definición con personajes clásicos en manga derecha, tipografía 'Snoopy' con huellas en manga izquierda, y en la espalda la emblemática gráfica 'PEANUTS SINCE 1950' con viñetas multicolores. Acabados con costuras de doble pespunte y puños acanalados de alta durabilidad.",
            fabric: "80% Algodón Peinado Perchado, 20% Poliéster (320 gsm - Felpa Interior Térmica Suave)",
            tela: "80% Algodón Peinado Perchado, 20% Poliéster (320 gsm - Felpa Interior Térmica Suave)",
            sizes: "XS - S - M - L - XL",
            tallas: ["XS", "S", "M", "L", "XL"],
            colors: "Blanco Hueso / Off-White (Edición Especial Peanuts), Gris Jaspe, Negro Antracita, Menta LOYLIZ",
            colores: "Blanco Hueso / Off-White (Edición Especial Peanuts), Gris Jaspe, Negro Antracita, Menta LOYLIZ",
            use: "Uso casual urbano, streetwear de autor, colecciones temáticas exclusivas y asesoría de estilo diario.",
            uso: "Uso casual urbano, streetwear de autor, colecciones temáticas exclusivas y asesoría de estilo diario.",
            especificaciones: {
                "Gramaje": "320 gsm (Felpa interior térmica de máximo confort)",
                "Bordado Frontal": "Parche Snoopy circular en alta definición rosa pastel",
                "Serigrafía": "Tintas al agua ecológicas en mangas y dorso (Peanuts 1950)",
                "Capucha": "Doble capa anatómica con cordón ajustable y ojetes metálicos",
                "Corte": "Regular / Oversize Confort con puños rib acanalados"
            },
            hasRealImages: true,
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
            nombre: "Franelas & Básicos Premium 24/1",
            title: "Franelas & Básicos Premium 24/1",
            category: "franelas",
            rubroLabel: "Franelas & Básicos Premium",
            referencia: "LLZ-BAS-04",
            code: "LLZ-BAS-04",
            gender: "Unisex / Fondo de Armario",
            genero: "Unisex / Fondo de Armario",
            desc: "Básicos atemporales confeccionados con algodón de máxima suavidad para tus looks más versátiles.",
            descripcion: "Básicos atemporales confeccionados con algodón de máxima suavidad para tus looks más versátiles.",
            fabric: "100% Algodón Peinado Premium 24/1 (190 gsm) con doble pespunte",
            tela: "100% Algodón Peinado Premium 24/1 (190 gsm) con doble pespunte",
            sizes: "XS - S - M - L - XL - XXL",
            tallas: ["XS", "S", "M", "L", "XL", "XXL"],
            colors: "Blanco Puro, Gris Antracita, Verde Menta Suave, Negro Profundo",
            colores: "Blanco Puro, Gris Antracita, Verde Menta Suave, Negro Profundo",
            use: "Prendas esenciales de uso diario, asesoría de fondo de armario y dotaciones.",
            uso: "Prendas esenciales de uso diario, asesoría de fondo de armario y dotaciones.",
            especificaciones: {
                "Hilado": "100% Algodón peinado 24/1 fibra larga",
                "Gramaje": "190 gsm (Cuerpo y caída óptima sin transparencias)",
                "Cuello": "Ribete acanalado 1x1 con elastano indeformable",
                "Acabado": "Tratamiento antipilling y tapacostura interior en cuello",
                "Confección": "Doble pespunte en ruedo y bocamangas"
            },
            hasRealImages: true,
            image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80",
            images: [
                "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80"
            ]
        },
        {
            id: 5,
            nombre: "Uniformes Corporativos & Camisería",
            title: "Uniformes Corporativos & Camisería",
            category: "corporativos",
            rubroLabel: "Uniformes Corporativos",
            referencia: "LLZ-CORP-05",
            code: "LLZ-CORP-05",
            gender: "Dama & Caballero",
            genero: "Dama & Caballero",
            desc: "Proyecta la mejor imagen de tu marca con prendas duraderas, elegantes y personalizadas.",
            descripcion: "Proyecta la mejor imagen de tu marca con prendas duraderas, elegantes y personalizadas.",
            fabric: "Popelina Oxford Mercerizada 65/35 & Piqué Algodón Antipilling",
            tela: "Popelina Oxford Mercerizada 65/35 & Piqué Algodón Antipilling",
            sizes: "S - M - L - XL - XXL",
            tallas: ["S", "M", "L", "XL", "XXL"],
            colors: "Blanco Ejecutivo, Celeste Corporativo, Azul Marino, Gris Antracita",
            colores: "Blanco Ejecutivo, Celeste Corporativo, Azul Marino, Gris Antracita",
            use: "Equipos de ventas, personal de oficina, recepciones y eventos institucionales.",
            uso: "Equipos de ventas, personal de oficina, recepciones y eventos institucionales.",
            especificaciones: {
                "Hilatura": "Popelina Oxford 65% Poliéster, 35% Algodón mercerizado",
                "Gramaje": "155 gsm (Estructura ejecutiva y transpirabilidad)",
                "Tratamiento": "Easy Care antiarrugas para fácil planchado",
                "Botones": "Resina de alto impacto cosidos con nudo de seguridad",
                "Bordado": "Zona pectoral izquierda habilitada para bordado de marca"
            },
            hasRealImages: true,
            image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80",
            images: [
                "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80"
            ]
        },
        {
            id: 6,
            nombre: "Conjunto Infantil & Juvenil Confort-Max",
            title: "Conjunto Infantil & Juvenil Confort-Max",
            category: "infantil",
            rubroLabel: "Infantil & Juvenil",
            referencia: "LLZ-KID-06",
            code: "LLZ-KID-06",
            gender: "Niños & Niñas (4 a 16)",
            genero: "Niños & Niñas (4 a 16)",
            desc: "Diseños resistentes y súper cómodos diseñados para el ritmo inagotable de los más pequeños.",
            descripcion: "Diseños resistentes y súper cómodos diseñados para el ritmo inagotable de los más pequeños.",
            fabric: "Algodón Fleece Hipoalergénico con costuras elásticas de doble pespunte",
            tela: "Algodón Fleece Hipoalergénico con costuras elásticas de doble pespunte",
            sizes: "Tallas 4, 6, 8, 10, 12, 14, 16",
            tallas: ["4", "6", "8", "10", "12", "14", "16"],
            colors: "Verde Menta, Gris Jaspe, Azul Marino, Blanco",
            colores: "Verde Menta, Gris Jaspe, Azul Marino, Blanco",
            use: "Educación física, colegio, deportes y juego activo diario.",
            uso: "Educación física, colegio, deportes y juego activo diario.",
            especificaciones: {
                "Material": "Algodón Fleece suave antialérgico",
                "Gramaje": "270 gsm (Calidez y resistencia al roce)",
                "Cintura": "Banda elástica forrada que no deja marcas",
                "Costuras": "Costuras reforzadas elásticas de 4 hilos",
                "Seguridad": "Tintes ecológicos no tóxicos certificados"
            },
            hasRealImages: true,
            image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=700&q=80",
            images: [
                "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=700&q=80"
            ]
        },
        {
            id: 7,
            nombre: "Scrub Quirúrgico Jogger Ergo-Flex",
            title: "Scrub Quirúrgico Jogger Ergo-Flex",
            category: "sanitarios",
            rubroLabel: "Línea Sanitaria & Quirúrgica",
            referencia: "LLZ-MED-07",
            code: "LLZ-MED-07",
            gender: "Mujer / Hombre",
            genero: "Mujer / Hombre",
            desc: "Uniformes antifluido ligeros que te brindan seguridad y estilo durante tus guardias más exigentes.",
            descripcion: "Uniformes antifluido ligeros que te brindan seguridad y estilo durante tus guardias más exigentes.",
            fabric: "Microfibra Antifluido de Grado Hospitalario con repelencia certificada",
            tela: "Microfibra Antifluido de Grado Hospitalario con repelencia certificada",
            sizes: "XS - S - M - L - XL",
            tallas: ["XS", "S", "M", "L", "XL"],
            colors: "Verde Menta LOYLIZ, Azul Quirúrgico, Negro Ónix, Gris Plomo",
            colores: "Verde Menta LOYLIZ, Azul Quirúrgico, Negro Ónix, Gris Plomo",
            use: "Guardias clínicas, quirófano, anestesiología, enfermería y veterinaria.",
            uso: "Guardias clínicas, quirófano, anestesiología, enfermería y veterinaria.",
            especificaciones: {
                "Certificación": "Repelencia hospitalaria a salpicaduras y fluidos",
                "Gramaje": "170 gsm (Movilidad ergonómica total)",
                "Corte": "Jogger moderno con tobillera acanalada indeformable",
                "Bolsillos": "5 bolsillos tácticos (2 laterales, 2 cargo, 1 posterior)",
                "Elasticidad": "Spandex bidireccional de alto rendimiento"
            },
            hasRealImages: true,
            image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=700&q=80",
            images: [
                "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=700&q=80"
            ]
        },
        {
            id: 8,
            nombre: "Chaqueta Bomber Deportiva Mesh Pro",
            title: "Chaqueta Bomber Deportiva Mesh Pro",
            category: "deportivos",
            rubroLabel: "Jerseys Deportivos (LVBP)",
            referencia: "LLZ-DEP-08",
            code: "LLZ-DEP-08",
            gender: "Unisex",
            genero: "Unisex",
            desc: "Chaqueta liviana de corte ergonómico con forro interior en micro-mesh transpirable y rib elástico reforzado.",
            descripcion: "Chaqueta liviana de corte ergonómico con forro interior en micro-mesh transpirable y rib elástico reforzado.",
            fabric: "100% Poliéster Ripstop & Rib elástico indeformable",
            tela: "100% Poliéster Ripstop & Rib elástico indeformable",
            sizes: "S - M - L - XL - XXL",
            tallas: ["S", "M", "L", "XL", "XXL"],
            colors: "Sublimación Total de Equipos LVBP / Diseños Personalizados",
            colores: "Sublimación Total de Equipos LVBP / Diseños Personalizados",
            use: "Entrenamientos, salidas de viaje de delegaciones y fanaticada.",
            uso: "Entrenamientos, salidas de viaje de delegaciones y fanaticada.",
            especificaciones: {
                "Tejido Exterior": "Ripstop 100% poliéster cortaviento antidesgarro",
                "Forro Interior": "Micro-Mesh respirable de ventilación activa",
                "Cierre": "Cremallera frontal reforzada con tirador metálico",
                "Rib": "Cuello y puños acanalados elásticos indeformables",
                "Sublimación": "Full print HD con diseños personalizados o por lote"
            },
            hasRealImages: true,
            image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80",
            images: [
                "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80"
            ]
        }
    ];

    /**
     * Resuelve credenciales actuales de Supabase desde el entorno global o navegador
     */
    function getCredentials() {
        let url = '';
        let key = '';

        if (typeof window !== 'undefined') {
            url = window.SUPABASE_URL || (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) || '';
            key = window.SUPABASE_ANON_KEY || (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.anonKey) || '';
        } else if (typeof global !== 'undefined') {
            url = (global.SUPABASE_CONFIG && global.SUPABASE_CONFIG.url) || global.SUPABASE_URL || '';
            key = (global.SUPABASE_CONFIG && global.SUPABASE_CONFIG.anonKey) || global.SUPABASE_ANON_KEY || '';
        }

        if (!url && typeof SUPABASE_URL !== 'undefined') url = SUPABASE_URL;
        if (!key && typeof SUPABASE_ANON_KEY !== 'undefined') key = SUPABASE_ANON_KEY;

        return {
            url: (url || '').trim().replace(/\/+$/, ''),
            key: (key || '').trim()
        };
    }

    /**
     * Valida si las credenciales son reales y no son marcadores de posición (placeholders)
     */
    function isConfigured() {
        const creds = getCredentials();
        if (!creds.url || !creds.key) return false;
        if (creds.url.includes('tu-proyecto') || creds.key.includes('TU_SUPABASE')) return false;
        if (!creds.url.startsWith('https://') && !creds.url.startsWith('http://')) return false;
        return true;
    }

    /**
     * Gestión de Caché con sessionStorage y expiración por tiempo (TTL)
     */
    function readCache(key) {
        if (typeof sessionStorage === 'undefined') return null;
        try {
            const raw = sessionStorage.getItem(key);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            const age = Date.now() - (parsed.timestamp || 0);
            if (age > CACHE_TTL_MS) {
                sessionStorage.removeItem(key);
                return null;
            }
            return parsed.data;
        } catch (e) {
            return null;
        }
    }

    function writeCache(key, data) {
        if (typeof sessionStorage === 'undefined') return;
        try {
            sessionStorage.setItem(key, JSON.stringify({
                data: data,
                timestamp: Date.now()
            }));
        } catch (e) {
            // Manejo silencioso en caso de almacenamiento lleno o deshabilitado
        }
    }

    function clearAllCache() {
        if (typeof sessionStorage === 'undefined') return;
        try {
            sessionStorage.removeItem(CACHE_KEYS.CATEGORIAS);
            sessionStorage.removeItem(CACHE_KEYS.PRODUCTOS);
        } catch (e) {}
    }

    /**
     * Resuelve URLs de imágenes (soporta Supabase Storage, CDN y fallback local)
     */
    function resolveImageUrl(rawUrl, supabaseUrl) {
        if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim() === '') {
            return FALLBACK_PLACEHOLDER_IMAGE;
        }

        const trimmed = rawUrl.trim();

        // Si ya es una URL completa o SVG data URI o ruta local existente
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:') || trimmed.startsWith('img/')) {
            return trimmed;
        }

        // Si es una ruta relativa a un bucket de Supabase Storage
        if (supabaseUrl) {
            if (trimmed.startsWith('/storage/v1/object/public/')) {
                return `${supabaseUrl}${trimmed}`;
            }
            if (trimmed.startsWith('storage/v1/object/public/')) {
                return `${supabaseUrl}/${trimmed}`;
            }
            const cleanPath = trimmed.replace(/^\/+/, '');
            // Si la ruta ya especifica el bucket oficial 'catalogo-loyliz' u otro bucket
            if (cleanPath.startsWith('catalogo-loyliz/')) {
                return `${supabaseUrl}/storage/v1/object/public/${cleanPath}`;
            }
            // Por defecto, vincular al bucket oficial de LOYLIZ: 'catalogo-loyliz'
            return `${supabaseUrl}/storage/v1/object/public/catalogo-loyliz/${cleanPath}`;
        }

        return trimmed;
    }

    /**
     * Normalizador de Categorías desde Supabase hacia el modelo del Catálogo LOYLIZ
     */
    function normalizeCategory(raw, index) {
        return {
            id: raw.id ?? (index + 1),
            slug: raw.slug ? String(raw.slug).toLowerCase().trim() : `categoria-${index + 1}`,
            nombre: raw.nombre || raw.name || raw.titulo || 'Línea de Producción',
            subtitulo: raw.subtitulo || raw.subtitle || 'Confección Nacional Premium',
            orden: typeof raw.orden === 'number' ? raw.orden : (index + 1),
            activo: raw.activo !== false
        };
    }

    /**
     * Normalizador de Productos desde Supabase hacia el modelo del Catálogo LOYLIZ
     */
    function normalizeProduct(raw, index, supabaseUrl) {
        // Normalizar categoría asociada desde el join PostgREST: categorias(slug, nombre, subtitulo)
        let catObj = null;
        if (raw.categorias) {
            catObj = Array.isArray(raw.categorias) ? raw.categorias[0] : raw.categorias;
        }

        const categorySlug = catObj?.slug || raw.categoria_slug || raw.category || 'general';
        const rubroLabel = catObj?.nombre || raw.rubroLabel || raw.categoria_nombre || 'Línea de Confección';

        // Normalizar imágenes asociadas desde el join PostgREST: producto_imagenes(...)
        // Tarea 2: Ordenar producto_imagenes estrictamente por es_principal DESC, orden ASC
        let imageList = [];
        let hasRealImages = false;

        if (Array.isArray(raw.producto_imagenes) && raw.producto_imagenes.length > 0) {
            const sorted = [...raw.producto_imagenes].sort((a, b) => {
                const aPrinc = (a.es_principal === true || a.es_principal === 'true' || a.es_principal === 1) ? 1 : 0;
                const bPrinc = (b.es_principal === true || b.es_principal === 'true' || b.es_principal === 1) ? 1 : 0;
                if (bPrinc !== aPrinc) {
                    return bPrinc - aPrinc; // es_principal DESC
                }
                const aOrden = typeof a.orden === 'number' ? a.orden : 999;
                const bOrden = typeof b.orden === 'number' ? b.orden : 999;
                return aOrden - bOrden; // orden ASC
            });

            imageList = sorted
                .map(img => resolveImageUrl(img.url_imagen || img.url || img.imagen_url, supabaseUrl))
                .filter(Boolean);

            if (imageList.length > 0) {
                hasRealImages = true;
            }
        }

        // Si no vinieron imágenes en la relación, revisar campos directos del producto
        if (imageList.length === 0) {
            if (Array.isArray(raw.images) && raw.images.length > 0) {
                imageList = raw.images.map(img => resolveImageUrl(img, supabaseUrl));
                hasRealImages = true;
            } else if (raw.image || raw.imagen_url || raw.imagen || raw.url_imagen) {
                imageList = [resolveImageUrl(raw.image || raw.imagen_url || raw.imagen || raw.url_imagen, supabaseUrl)];
                hasRealImages = true;
            } else {
                imageList = [FALLBACK_PLACEHOLDER_IMAGE];
                hasRealImages = false;
            }
        }

        const mainImage = imageList[0] || FALLBACK_PLACEHOLDER_IMAGE;

        // Normalizar tallas como array para renderizado de píldoras limpias
        let tallasArray = [];
        if (Array.isArray(raw.tallas)) {
            tallasArray = raw.tallas.map(t => String(t).trim()).filter(Boolean);
        } else if (typeof raw.tallas === 'string') {
            tallasArray = raw.tallas
                .replace(/^Tallas\s*:?\s*/i, '')
                .split(/[-–—,;/]+/)
                .map(t => t.trim())
                .filter(Boolean);
        } else if (raw.sizes) {
            if (Array.isArray(raw.sizes)) {
                tallasArray = raw.sizes.map(t => String(t).trim()).filter(Boolean);
            } else if (typeof raw.sizes === 'string') {
                tallasArray = raw.sizes
                    .replace(/^Tallas\s*:?\s*/i, '')
                    .split(/[-–—,;/]+/)
                    .map(t => t.trim())
                    .filter(Boolean);
            }
        }
        if (tallasArray.length === 0) {
            tallasArray = ['S', 'M', 'L', 'XL'];
        }

        // Normalizar especificaciones técnicas JSONB
        let especificacionesObj = {};
        if (raw.especificaciones && typeof raw.especificaciones === 'object') {
            especificacionesObj = raw.especificaciones;
        } else if (typeof raw.especificaciones === 'string') {
            try {
                especificacionesObj = JSON.parse(raw.especificaciones);
            } catch (e) {
                especificacionesObj = {};
            }
        }

        // Generar código de referencia con formato oficial LOYLIZ (ej: LLZ-MED-01)
        const codeFallback = `LLZ-${String(raw.id || (index + 1)).padStart(2, '0').toUpperCase()}`;
        const refCode = raw.referencia || raw.codigo || raw.code || raw.ref || codeFallback;
        const nombrePrenda = raw.nombre || raw.title || raw.titulo || 'Prenda LOYLIZ Confección Premium';
        const descPrenda = raw.descripcion || raw.desc || raw.detalles || 'Diseño de alta costura con acabados duraderos y materiales nacionales de primera categoría.';
        const telaPrenda = raw.tela || raw.fabric || raw.composicion || 'Confección Nacional Premium con Doble Pespunte';

        return {
            id: raw.id ?? (index + 1),
            nombre: nombrePrenda,
            title: nombrePrenda,
            referencia: refCode,
            code: refCode,
            category: categorySlug,
            rubroLabel: rubroLabel,
            gender: raw.genero || raw.gender || 'Unisex / Confección Premium',
            genero: raw.genero || raw.gender || 'Unisex / Confección Premium',
            desc: descPrenda,
            descripcion: descPrenda,
            fabric: telaPrenda,
            tela: telaPrenda,
            sizes: raw.sizes || raw.tallas || tallasArray.join(' - '),
            tallas: tallasArray,
            colors: raw.colores || raw.colors || 'Variedad de tonos y combinaciones a elegir',
            colores: raw.colores || raw.colors || 'Variedad de tonos y combinaciones a elegir',
            use: raw.uso || raw.use || raw.uso_recomendado || 'Uso profesional, dotaciones corporativas y estilo casual diario.',
            uso: raw.uso || raw.use || raw.uso_recomendado || 'Uso profesional, dotaciones corporativas y estilo casual diario.',
            especificaciones: especificacionesObj,
            hasRealImages: hasRealImages,
            image: mainImage,
            images: imageList,
            createdAt: raw.created_at || null
        };
    }

    /**
     * Ejecuta una petición HTTP nativa segura hacia Supabase REST API
     */
    async function fetchSupabase(endpoint, creds) {
        const url = `${creds.url}/rest/v1/${endpoint}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'apikey': creds.key,
                'Authorization': `Bearer ${creds.key}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => '');
            const error = new Error(`Error HTTP ${response.status}: ${response.statusText}`);
            error.status = response.status;
            error.body = errorText;
            throw error;
        }

        return await response.json();
    }

    /**
     * Muestra diagnóstico amigable en consola para orientar al desarrollador en español
     */
    function logSpanishDiagnostic(err, resourceName) {
        if (err.status === 401 || err.status === 403) {
            console.warn(
                `%c[LOYLIZ Catálogo] Permiso denegado en Supabase al consultar '${resourceName}' (HTTP ${err.status}).%c\n` +
                `Para habilitar la lectura pública en PostgreSQL para el rol 'anon', ejecuta en el SQL Editor de Supabase:\n\n` +
                `GRANT USAGE ON SCHEMA public TO anon;\n` +
                `GRANT SELECT ON public.${resourceName} TO anon;\n` +
                `-- O habilita RLS con política de lectura:\n` +
                `ALTER TABLE public.${resourceName} ENABLE ROW LEVEL SECURITY;\n` +
                `CREATE POLICY "Lectura publica ${resourceName}" ON public.${resourceName} FOR SELECT USING (true);\n\n` +
                `Activando catálogo de contingencia con prendas de muestra...`,
                'color: #D48C95; font-weight: bold; font-size: 12px;',
                'color: #6B7280; font-family: monospace; font-size: 11px;'
            );
        } else {
            console.warn(`[LOYLIZ Catálogo] No fue posible cargar '${resourceName}' desde Supabase. Activando contingencia local:`, err.message || err);
        }
    }

    // ========================================================================
    // MÉTODOS PÚBLICOS DEL SERVICIO
    // ========================================================================

    /**
     * Obtiene las categorías activas ordenadas por `orden ASC`.
     * Utiliza caché en sessionStorage (5 minutos) y fallback ante errores.
     */
    async function getCategories() {
        // 1. Verificar si las credenciales están configuradas
        if (!isConfigured()) {
            console.info('[LOYLIZ Catálogo] Credenciales de Supabase en modo placeholder. Utilizando categorías precargadas de contingencia.');
            return FALLBACK_CATEGORIAS;
        }

        // 2. Comprobar caché local de sesión
        const cached = readCache(CACHE_KEYS.CATEGORIAS);
        if (cached && Array.isArray(cached) && cached.length > 0) {
            return cached;
        }

        // 3. Consultar Supabase REST API
        const creds = getCredentials();
        try {
            let data = null;
            try {
                // Intento estándar con filtro de activos
                data = await fetchSupabase('categorias?select=*&activo=eq.true&order=orden.asc', creds);
            } catch (queryErr) {
                // Si la columna 'activo' no existe en la tabla, reintentar ordenando por orden
                data = await fetchSupabase('categorias?select=*&order=orden.asc', creds);
            }

            if (!Array.isArray(data) || data.length === 0) {
                console.info('[LOYLIZ Catálogo] La tabla categorias está vacía en Supabase. Utilizando categorías de contingencia.');
                return FALLBACK_CATEGORIAS;
            }

            const normalized = data.map((item, idx) => normalizeCategory(item, idx));
            writeCache(CACHE_KEYS.CATEGORIAS, normalized);
            return normalized;
        } catch (err) {
            logSpanishDiagnostic(err, 'categorias');
            return FALLBACK_CATEGORIAS;
        }
    }

    /**
     * Obtiene los productos activos unidos con `categorias` y `producto_imagenes`
     * ordenados por `created_at DESC`.
     * Utiliza caché en sessionStorage (5 minutos) y fallback ante errores.
     */
    async function getProducts() {
        // 1. Verificar si las credenciales están configuradas
        if (!isConfigured()) {
            console.info('[LOYLIZ Catálogo] Credenciales de Supabase en modo placeholder. Utilizando prendas precargadas de contingencia.');
            return FALLBACK_PRODUCTOS;
        }

        // 2. Comprobar caché local de sesión
        const cached = readCache(CACHE_KEYS.PRODUCTOS);
        if (cached && Array.isArray(cached) && cached.length > 0) {
            return cached;
        }

        // 3. Consultar Supabase REST API con JOIN relacional
        const creds = getCredentials();
        const selectQuery = 'select=*,categorias(slug,nombre,subtitulo),producto_imagenes(url_imagen,alt_text,es_principal,orden)';

        try {
            let data = null;
            try {
                // Consulta con filtro activo=eq.true y orden created_at DESC
                data = await fetchSupabase(`productos?${selectQuery}&activo=eq.true&order=created_at.desc`, creds);
            } catch (queryErr) {
                try {
                    // Reintento sin filtro de activo si no existe esa columna
                    data = await fetchSupabase(`productos?${selectQuery}&order=created_at.desc`, creds);
                } catch (fallbackQueryErr) {
                    // Consulta simple directa a productos si la relación difiere
                    data = await fetchSupabase('productos?select=*&order=created_at.desc', creds);
                }
            }

            if (!Array.isArray(data) || data.length === 0) {
                console.info('[LOYLIZ Catálogo] La tabla productos está vacía en Supabase. Utilizando prendas de contingencia.');
                return FALLBACK_PRODUCTOS;
            }

            const normalized = data.map((item, idx) => normalizeProduct(item, idx, creds.url));
            writeCache(CACHE_KEYS.PRODUCTOS, normalized);
            return normalized;
        } catch (err) {
            logSpanishDiagnostic(err, 'productos');
            return FALLBACK_PRODUCTOS;
        }
    }

    /**
     * Busca un producto por ID dentro de la lista actual
     */
    async function getProductById(id) {
        const all = await getProducts();
        return all.find(p => String(p.id) === String(id)) || null;
    }

    return {
        getCategories,
        getProducts,
        getProductById,
        clearCache: clearAllCache,
        isConfigured,
        FALLBACK_PLACEHOLDER_IMAGE,
        FALLBACK_CATEGORIAS,
        FALLBACK_PRODUCTOS
    };
}));
