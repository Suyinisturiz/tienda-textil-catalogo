/**
 * Textile Catalog Theme & Palette Switcher
 * Permite cambiar combinaciones de color en tiempo real sin perder la original guardada en Git.
 */

(function () {
    // Definición de paleta oficial para exhibición textil y confección
    const PALETTES = [
        {
            id: 'client-navy-dusty-rose',
            name: 'Midnight Navy & Palo de Rosa',
            badge: 'Brand Kit Oficial 🌸',
            badgeClass: 'bg-rose-100 text-rose-900 border-rose-300 font-bold',
            primaryHex: '#152942',
            accentHex: '#D48C95',
            primaryRgb: '21 41 66',
            primaryDarkRgb: '6 14 17',
            primaryLightRgb: '36 62 96',
            accentRgb: '212 140 149',
            accentHoverRgb: '179 101 115',
            creamRgb: '250 236 218',
            swatches: ['#060E11', '#152942', '#B36573', '#D48C95', '#FAECDA'],
            tagline: 'Paleta oficial LOYLIZ: Azul Medianoche (#060E11), Azul Marino Profundo (#152942), Palo de Rosa (#D48C95) y Crema Marfil (#FAECDA).'
        }
    ];

    const STORAGE_KEY = 'loyliz_selected_palette_v2';
    let currentPalette = null;

    // Utilidades de color
    function hexToRgb(hex) {
        let c = hex.replace('#', '');
        if (c.length === 3) c = c.split('').map(x => x + x).join('');
        const num = parseInt(c, 16);
        return {
            r: (num >> 16) & 255,
            g: (num >> 8) & 255,
            b: num & 255
        };
    }

    function rgbToString(rgb) {
        return `${Math.round(rgb.r)} ${Math.round(rgb.g)} ${Math.round(rgb.b)}`;
    }

    function clamp(val, min = 0, max = 255) {
        return Math.min(max, Math.max(min, val));
    }

    function shadeRgb(rgb, factor) {
        return {
            r: clamp(rgb.r * factor),
            g: clamp(rgb.g * factor),
            b: clamp(rgb.b * factor)
        };
    }

    // Aplicar paleta en las variables CSS
    function applyPaletteConfig(config, persist = true) {
        const root = document.documentElement;
        root.style.setProperty('--color-navy', config.primaryRgb);
        root.style.setProperty('--color-navy-dark', config.primaryDarkRgb);
        root.style.setProperty('--color-navy-light', config.primaryLightRgb);
        root.style.setProperty('--color-gold', config.accentRgb);
        root.style.setProperty('--color-gold-hover', config.accentHoverRgb);
        root.style.setProperty('--color-cream', config.creamRgb);

        currentPalette = config;

        if (persist) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        }

        // Actualizar visualización en botón flotante y footer
        updateFloatingButtonBadge(config);
        updateFooterLabel(config);
        markActivePaletteCard(config.id);
    }

    function applyById(paletteId) {
        const p = PALETTES.find(item => item.id === paletteId);
        if (p) {
            applyPaletteConfig(p, true);
        }
    }

    function applyCustom(primaryHex, accentHex) {
        const pRgb = hexToRgb(primaryHex);
        const aRgb = hexToRgb(accentHex);

        const customConfig = {
            id: 'custom',
            name: `Personalizada (${primaryHex} / ${accentHex})`,
            badge: 'Personalizado',
            badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            primaryHex: primaryHex,
            accentHex: accentHex,
            primaryRgb: rgbToString(pRgb),
            primaryDarkRgb: rgbToString(shadeRgb(pRgb, 0.7)),
            primaryLightRgb: rgbToString(shadeRgb(pRgb, 1.35)),
            accentRgb: rgbToString(aRgb),
            accentHoverRgb: rgbToString(shadeRgb(aRgb, 0.9)),
            creamRgb: '251 250 248',
            tagline: 'Tu propia combinación de colores personalizada.'
        };

        applyPaletteConfig(customConfig, true);
    }

    function resetToOriginal() {
        applyById('client-navy-dusty-rose');
    }

    function updateFloatingButtonBadge(config) {
        const dotPrimary = document.getElementById('palette-btn-dot-primary');
        const dotAccent = document.getElementById('palette-btn-dot-accent');
        const label = document.getElementById('palette-btn-current-name');
        if (dotPrimary) dotPrimary.style.backgroundColor = config.primaryHex;
        if (dotAccent) dotAccent.style.backgroundColor = config.accentHex;
        if (label) label.textContent = config.name.split('&')[0].trim();
    }

    function updateFooterLabel(config) {
        const footerLabel = document.getElementById('palette-footer-label');
        if (footerLabel) {
            footerLabel.textContent = `${config.name} (${config.primaryHex} & ${config.accentHex})`;
        }
    }

    function markActivePaletteCard(activeId) {
        document.querySelectorAll('.palette-card-option').forEach(card => {
            const id = card.getAttribute('data-palette-id');
            const check = card.querySelector('.palette-check');
            if (id === activeId) {
                card.classList.add('ring-2', 'ring-brand-gold', 'bg-brand-navy/5');
                if (check) check.classList.remove('hidden');
            } else {
                card.classList.remove('ring-2', 'ring-brand-gold', 'bg-brand-navy/5');
                if (check) check.classList.add('hidden');
            }
        });
    }

    // Copiar código de colores
    function copyCurrentPaletteCodes() {
        if (!currentPalette) return;
        const textToCopy = `/* Paleta: ${currentPalette.name} */\n` +
            `Color Principal: ${currentPalette.primaryHex}\n` +
            `Color Acento: ${currentPalette.accentHex}\n\n` +
            `/* Variables CSS */\n` +
            `--color-primary: ${currentPalette.primaryHex}; /* RGB: ${currentPalette.primaryRgb} */\n` +
            `--color-accent: ${currentPalette.accentHex};   /* RGB: ${currentPalette.accentRgb} */`;

        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('¡Códigos de color copiados al portapapeles!');
        }).catch(() => {
            showToast(`Copiado: ${currentPalette.primaryHex} / ${currentPalette.accentHex}`);
        });
    }

    function showToast(msg) {
        let toast = document.getElementById('palette-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'palette-toast';
            toast.className = 'fixed bottom-24 left-6 z-[60] bg-gray-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl transition-all duration-300 opacity-0 transform translate-y-2 pointer-events-none flex items-center gap-2';
            document.body.appendChild(toast);
        }
        toast.innerHTML = `<span class="w-2 h-2 rounded-full bg-rose-400"></span> ${msg}`;
        toast.classList.remove('opacity-0', 'translate-y-2', 'pointer-events-none');
        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-2', 'pointer-events-none');
        }, 3000);
    }

    // Construir e inyectar el Modal y Botón Flotante
    function renderPaletteUI() {
        // 1. Botón Flotante en la esquina inferior izquierda
        const floatingBtn = document.createElement('div');
        floatingBtn.id = 'palette-switcher-trigger';
        floatingBtn.className = 'fixed bottom-6 left-6 z-40';
        floatingBtn.innerHTML = `
            <button id="palette-open-btn" class="pulse-glow flex items-center gap-2.5 bg-white/95 backdrop-blur-md text-gray-800 hover:text-brand-navy px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-xl border border-gray-200/80 hover:border-brand-gold/60 hover:shadow-2xl transition-all duration-300 group cursor-pointer" title="Explorar combinación oficial">
                <div class="relative flex items-center justify-center w-7 h-7 rounded-full bg-brand-navy text-brand-gold shadow-sm group-hover:scale-105 transition-transform">
                    <i data-lucide="palette" class="w-4 h-4"></i>
                </div>
                <div class="text-left hidden sm:block">
                    <div class="flex items-center gap-1.5">
                        <span class="text-xs font-bold leading-tight">Paleta Oficial</span>
                        <span class="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">Activa</span>
                    </div>
                    <div class="flex items-center gap-1 text-[10px] text-gray-500">
                        <span id="palette-btn-dot-primary" class="inline-block w-2 h-2 rounded-full border border-gray-300"></span>
                        <span id="palette-btn-dot-accent" class="inline-block w-2 h-2 rounded-full border border-gray-300"></span>
                        <span id="palette-btn-current-name" class="font-medium truncate max-w-[110px]">Midnight Navy</span>
                    </div>
                </div>
            </button>
        `;
        document.body.appendChild(floatingBtn);

        // 2. Panel Modal / Drawer
        const modal = document.createElement('div');
        modal.id = 'palette-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center sm:justify-start sm:p-6 p-3 bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none transition-all duration-300';
        modal.innerHTML = `
            <div id="palette-modal-card" class="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden transform scale-95 transition-transform duration-300">
                <!-- Header -->
                <div class="px-5 py-4 bg-gradient-to-r from-gray-900 to-brand-navy text-white flex justify-between items-center border-b border-gray-800">
                    <div class="flex items-center gap-3">
                        <div class="p-2 rounded-xl bg-white/10 text-brand-gold">
                            <i data-lucide="palette" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 class="font-display font-bold text-sm sm:text-base text-white">Identidad de Marca & Paleta Oficial</h3>
                            <p class="text-[11px] text-gray-300">Midnight Navy (#152942) & Palo de Rosa (#D48C95)</p>
                        </div>
                    </div>
                    <button id="palette-close-btn" class="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>

                <!-- Info Alert: Brand Kit LOYLIZ -->
                <div class="px-5 py-2.5 bg-rose-50 border-b border-rose-100 flex items-center justify-between text-xs text-rose-900">
                    <div class="flex items-center gap-2">
                        <i data-lucide="shield-check" class="w-4 h-4 text-rose-600 shrink-0"></i>
                        <span>Paleta oficial <strong>LOYLIZ</strong> (Midnight Navy & Palo de Rosa).</span>
                    </div>
                    <button id="palette-reset-btn" class="text-[11px] font-bold text-rose-700 hover:text-rose-900 underline ml-2 whitespace-nowrap">
                        Restablecer Paleta
                    </button>
                </div>

                <!-- Tabs -->
                <div class="flex border-b border-gray-200 bg-gray-50/70 px-5 pt-3 gap-4">
                    <button id="tab-curated-btn" class="pb-2.5 text-xs font-bold border-b-2 border-brand-navy text-brand-navy transition flex items-center gap-1.5">
                        <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> Paleta Oficial (${PALETTES.length})
                    </button>
                    <button id="tab-custom-btn" class="pb-2.5 text-xs font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition flex items-center gap-1.5">
                        <i data-lucide="sliders" class="w-3.5 h-3.5"></i> Personalizador Libre
                    </button>
                </div>

                <!-- Body (Scrollable) -->
                <div class="p-5 overflow-y-auto flex-1 space-y-4">
                    <!-- Tab 1: Curated Palettes -->
                    <div id="tab-curated-content" class="space-y-3">
                        <p class="text-[11px] text-gray-500">Selecciona una paleta para vestir toda la tienda al instante:</p>
                        <div class="space-y-2.5">
                            ${PALETTES.map(p => `
                                <div class="palette-card-option p-3 rounded-xl border border-gray-200 hover:border-gray-400 bg-white hover:bg-gray-50/50 transition cursor-pointer flex items-center justify-between group" data-palette-id="${p.id}">
                                    <div class="flex items-center gap-3">
                                        <!-- Color Swatches -->
                                        <div class="flex items-center -space-x-1.5 shrink-0">
                                            ${p.swatches ? p.swatches.map(c => `
                                                <span class="w-5 h-5 rounded-full border-2 border-white shadow-sm inline-block" style="background-color: ${c};" title="${c}"></span>
                                            `).join('') : `
                                                <span class="w-6 h-6 rounded-full border-2 border-white shadow-md inline-block" style="background-color: ${p.primaryHex};" title="Primario: ${p.primaryHex}"></span>
                                                <span class="w-6 h-6 rounded-full border-2 border-white shadow-md inline-block" style="background-color: ${p.accentHex};" title="Acento: ${p.accentHex}"></span>
                                            `}
                                        </div>
                                        <div>
                                            <div class="flex items-center gap-2">
                                                <h4 class="font-bold text-xs text-gray-900 group-hover:text-brand-navy">${p.name}</h4>
                                                <span class="text-[9px] font-bold px-1.5 py-0.5 rounded border ${p.badgeClass}">${p.badge}</span>
                                            </div>
                                            <p class="text-[10px] text-gray-500 line-clamp-1 mt-0.5">${p.tagline}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2 pl-2">
                                        <span class="palette-check hidden w-5 h-5 rounded-full bg-brand-navy text-brand-gold flex items-center justify-center text-[10px] shadow-sm">
                                            <i data-lucide="check" class="w-3 h-3"></i>
                                        </span>
                                        <button class="text-[11px] font-bold text-gray-600 group-hover:text-brand-navy group-hover:underline">Aplicar</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Tab 2: Custom Color Generator -->
                    <div id="tab-custom-content" class="hidden space-y-4">
                        <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-600">
                            <p class="font-bold text-gray-900 mb-1">Crea tu propia combinación exacta:</p>
                            <p class="text-[11px] text-gray-500">Selecciona cualquier color primario y secundario. El sistema generará automáticamente los contrastes, hover y sombras correspondientes.</p>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="p-3 bg-white rounded-xl border border-gray-200">
                                <label class="block text-xs font-bold text-gray-800 mb-1">Color Principal (Fondo & Textos)</label>
                                <div class="flex items-center gap-3">
                                    <input type="color" id="custom-primary-picker" value="${currentPalette ? currentPalette.primaryHex : '#152942'}" class="w-10 h-10 rounded-lg cursor-pointer border border-gray-300">
                                    <input type="text" id="custom-primary-input" value="${currentPalette ? currentPalette.primaryHex : '#152942'}" class="flex-1 uppercase font-mono text-xs px-2.5 py-1.5 border border-gray-300 rounded-lg">
                                </div>
                                <span class="text-[10px] text-gray-400 mt-1 block">Afecta barras, cabeceras y botones</span>
                            </div>

                            <div class="p-3 bg-white rounded-xl border border-gray-200">
                                <label class="block text-xs font-bold text-gray-800 mb-1">Color de Acento (Detalles & Palo de Rosa)</label>
                                <div class="flex items-center gap-3">
                                    <input type="color" id="custom-accent-picker" value="${currentPalette ? currentPalette.accentHex : '#D48C95'}" class="w-10 h-10 rounded-lg cursor-pointer border border-gray-300">
                                    <input type="text" id="custom-accent-input" value="${currentPalette ? currentPalette.accentHex : '#D48C95'}" class="flex-1 uppercase font-mono text-xs px-2.5 py-1.5 border border-gray-300 rounded-lg">
                                </div>
                                <span class="text-[10px] text-gray-400 mt-1 block">Afecta badges, iconos y resaltados</span>
                            </div>
                        </div>

                        <div class="pt-2">
                            <button id="apply-custom-btn" class="w-full py-2.5 bg-brand-navy text-brand-gold rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:bg-brand-navyDark transition flex items-center justify-center gap-2">
                                <i data-lucide="check" class="w-4 h-4"></i> Aplicar Esta Combinación
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Footer Actions -->
                <div class="px-5 py-3 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
                    <button id="palette-copy-btn" class="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1.5 py-1 px-2.5 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-gray-100 transition">
                        <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copiar Códigos CSS / HEX
                    </button>
                    <button id="palette-modal-done-btn" class="py-1.5 px-4 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition">
                        Listo
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Eventos
        const openBtn = document.getElementById('palette-open-btn');
        const closeBtn = document.getElementById('palette-close-btn');
        const doneBtn = document.getElementById('palette-modal-done-btn');
        const modalCard = document.getElementById('palette-modal-card');

        function openModal() {
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modalCard.classList.remove('scale-95');
            modalCard.classList.add('scale-100');
        }

        function closeModal() {
            modal.classList.add('opacity-0', 'pointer-events-none');
            modalCard.classList.remove('scale-100');
            modalCard.classList.add('scale-95');
        }

        openBtn.addEventListener('click', openModal);
        closeBtn.addEventListener('click', closeModal);
        doneBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Tabs
        const tabCuratedBtn = document.getElementById('tab-curated-btn');
        const tabCustomBtn = document.getElementById('tab-custom-btn');
        const tabCuratedContent = document.getElementById('tab-curated-content');
        const tabCustomContent = document.getElementById('tab-custom-content');

        tabCuratedBtn.addEventListener('click', () => {
            tabCuratedBtn.className = 'pb-2.5 text-xs font-bold border-b-2 border-brand-navy text-brand-navy transition flex items-center gap-1.5';
            tabCustomBtn.className = 'pb-2.5 text-xs font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition flex items-center gap-1.5';
            tabCuratedContent.classList.remove('hidden');
            tabCustomContent.classList.add('hidden');
        });

        tabCustomBtn.addEventListener('click', () => {
            tabCustomBtn.className = 'pb-2.5 text-xs font-bold border-b-2 border-brand-navy text-brand-navy transition flex items-center gap-1.5';
            tabCuratedBtn.className = 'pb-2.5 text-xs font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition flex items-center gap-1.5';
            tabCustomContent.classList.remove('hidden');
            tabCuratedContent.classList.add('hidden');
        });

        // Click en cada paleta curada
        document.querySelectorAll('.palette-card-option').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.getAttribute('data-palette-id');
                applyById(id);
                showToast(`Paleta aplicada: ${PALETTES.find(p => p.id === id).name}`);
            });
        });

        // Botón Restablecer Original
        document.getElementById('palette-reset-btn').addEventListener('click', () => {
            resetToOriginal();
            showToast('¡Restablecida la paleta oficial Midnight Navy & Palo de Rosa!');
        });

        // Copiar códigos
        document.getElementById('palette-copy-btn').addEventListener('click', copyCurrentPaletteCodes);

        // Custom Pickers sync
        const customPrimaryPicker = document.getElementById('custom-primary-picker');
        const customPrimaryInput = document.getElementById('custom-primary-input');
        const customAccentPicker = document.getElementById('custom-accent-picker');
        const customAccentInput = document.getElementById('custom-accent-input');
        const applyCustomBtn = document.getElementById('apply-custom-btn');

        customPrimaryPicker.addEventListener('input', (e) => {
            customPrimaryInput.value = e.target.value.toUpperCase();
        });
        customPrimaryInput.addEventListener('input', (e) => {
            if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                customPrimaryPicker.value = e.target.value;
            }
        });

        customAccentPicker.addEventListener('input', (e) => {
            customAccentInput.value = e.target.value.toUpperCase();
        });
        customAccentInput.addEventListener('input', (e) => {
            if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                customAccentPicker.value = e.target.value;
            }
        });

        applyCustomBtn.addEventListener('click', () => {
            applyCustom(customPrimaryPicker.value, customAccentPicker.value);
            showToast('¡Combinación personalizada aplicada!');
        });

        if (window.lucide) {
            lucide.createIcons();
        }
    }

    // Inicialización al cargar la página
    function init() {
        // Limpiar cachés de versiones anteriores
        try {
            localStorage.removeItem('textil_selected_palette_v2');
            localStorage.removeItem('textil_selected_palette_v3');
            localStorage.removeItem('loyliz_selected_palette_v1');
        } catch (e) {}

        const saved = localStorage.getItem(STORAGE_KEY);
        let configToApply = PALETTES[0]; // Por defecto Midnight Navy & Palo de Rosa
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed && (parsed.id === 'custom' || PALETTES.some(p => p.id === parsed.id))) {
                    configToApply = parsed;
                }
            } catch (e) {
                configToApply = PALETTES[0];
            }
        }

        applyPaletteConfig(configToApply, false);
        renderPaletteUI();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Exponer API global por si se quiere invocar desde consola o botones
    window.ThemeSwitcher = {
        palettes: PALETTES,
        applyById: applyById,
        applyCustom: applyCustom,
        resetToOriginal: resetToOriginal,
        getCurrent: () => currentPalette
    };
})();

