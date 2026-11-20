/**
 * ============================================================================
 * LOYLIZ | Lógica del Panel de Administración (Supabase Auth, REST & Storage)
 * ============================================================================
 * Panel seguro y minimalista para la gestión del catálogo textil LOYLIZ.
 * Integra:
 * - Autenticación con Supabase Auth (Email & Contraseña).
 * - Compresión de imágenes en cliente a WebP mediante HTML5 Canvas (< 1400px, 82%).
 * - Subida y eliminación en Storage bucket público 'catalogo-loyliz'.
 * - Operaciones CRUD alineadas con el esquema PostgreSQL ('productos', 'categorias', 'producto_imagenes').
 * - Empaquetado y desempaquetado de especificaciones técnicas JSONB.
 * - Limpieza de caché pública en sessionStorage.
 */

(function () {
    'use strict';

    // 1. Constantes y Configuración Base
    const BUCKET_NAME = 'catalogo-loyliz';
    const CACHE_KEYS = {
        CATEGORIAS: 'loyliz_cache_categorias_v1',
        PRODUCTOS: 'loyliz_cache_productos_v1'
    };
    const SIZES_AVAILABLE = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Única'];

    // Marcador SVG institucional de contingencia
    const FALLBACK_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
    <rect width="300" height="300" fill="#FAECDA"/>
    <text x="150" y="150" font-family="'Montserrat', sans-serif" font-size="14" font-weight="700" fill="#152942" text-anchor="middle">LOY<tspan fill="#D48C95">LIZ</tspan></text>
    <text x="150" y="172" font-family="'Open Sans', sans-serif" font-size="9" fill="#B36573" text-anchor="middle">Sin Imagen</text>
</svg>
`)}`;

    // 2. Estado Global de la Aplicación Administrativa
    let supabaseClient = null;
    let currentSession = null;
    let isLoadingDashboard = false;
    let isAuthInitialized = false;
    let dashboardInitialized = false;

    let categoriesList = [];
    let productsList = [];
    let stagedImages = []; // Array de { id, file, blob, previewUrl, originalSize, compressedSize, isPrincipal, isExisting, url, storagePath }
    let deletedImageIds = [];
    let deletedImagePaths = [];

    let isEditingMode = false;
    let editingProductId = null;
    let pendingDeleteProduct = null;

    // 3. Referencias al DOM
    const authView = document.getElementById('auth-view');
    const dashboardView = document.getElementById('dashboard-view');
    const loginForm = document.getElementById('login-form');
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const loginAlert = document.getElementById('login-alert');
    const loginAlertText = document.getElementById('login-alert-text');
    const btnTogglePassword = document.getElementById('btn-toggle-password');
    const btnLoginSubmit = document.getElementById('btn-login-submit');

    const adminUserEmail = document.getElementById('admin-user-email');
    const btnLogout = document.getElementById('btn-logout');
    const btnClearCache = document.getElementById('btn-clear-cache');

    const metricTotal = document.getElementById('metric-total');
    const metricActive = document.getElementById('metric-active');
    const metricPaused = document.getElementById('metric-paused');

    const productForm = document.getElementById('product-form');
    const prodIdInput = document.getElementById('prod-id');
    const prodCategoriaSelect = document.getElementById('prod-categoria');
    const prodReferenciaInput = document.getElementById('prod-referencia');
    const btnAutoRef = document.getElementById('btn-auto-ref');
    const prodNombreInput = document.getElementById('prod-nombre');
    const prodTelaInput = document.getElementById('prod-tela');
    const prodGeneroInput = document.getElementById('prod-genero');
    const prodColoresInput = document.getElementById('prod-colores');
    const prodUsoInput = document.getElementById('prod-uso');
    const prodDescripcionTextarea = document.getElementById('prod-descripcion');
    const prodActivoCheckbox = document.getElementById('prod-activo');
    const prodDestacadoCheckbox = document.getElementById('prod-destacado');
    const sizesCheckboxContainer = document.getElementById('sizes-checkbox-container');
    const btnToggleAllSizes = document.getElementById('btn-toggle-all-sizes');
    const specsListContainer = document.getElementById('specs-list-container');
    const btnAddSpec = document.getElementById('btn-add-spec');

    const dropzone = document.getElementById('dropzone');
    const prodImagesInput = document.getElementById('prod-images-input');
    const stagedImagesContainer = document.getElementById('staged-images-container');
    const stagedImagesGrid = document.getElementById('staged-images-grid');

    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const btnCancelEdit = document.getElementById('btn-cancel-edit');
    const btnResetForm = document.getElementById('btn-reset-form');
    const btnSubmitProduct = document.getElementById('btn-submit-product');
    const btnSubmitText = document.getElementById('btn-submit-text');

    const tableSearch = document.getElementById('table-search');
    const tableFilterCat = document.getElementById('table-filter-cat');
    const tableFilterStatus = document.getElementById('table-filter-status');
    const inventoryTbody = document.getElementById('inventory-tbody');

    const confirmModal = document.getElementById('confirm-modal');
    const confirmCard = document.getElementById('confirm-card');
    const confirmTitle = document.getElementById('confirm-title');
    const confirmMessage = document.getElementById('confirm-message');
    const btnConfirmCancel = document.getElementById('btn-confirm-cancel');
    const btnConfirmAccept = document.getElementById('btn-confirm-accept');

    // ========================================================================
    // NOTIFICACIONES TOAST EN ESPAÑOL
    // ========================================================================
    function showToast(message, type = 'success', duration = 4000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `p-4 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs font-semibold pointer-events-auto transform transition-all duration-300 translate-y-2 opacity-0 border ${
            type === 'success' ? 'bg-brand-navy text-white border-brand-gold/40' :
            type === 'error' ? 'bg-rose-900 text-white border-rose-500' :
            type === 'warning' ? 'bg-amber-800 text-white border-amber-400' :
            'bg-brand-navyDark text-white border-white/20'
        }`;

        let iconName = 'check-circle';
        let iconColor = 'text-brand-gold';
        if (type === 'error') { iconName = 'alert-octagon'; iconColor = 'text-rose-300'; }
        if (type === 'warning') { iconName = 'alert-triangle'; iconColor = 'text-amber-300'; }
        if (type === 'info') { iconName = 'info'; iconColor = 'text-blue-300'; }

        toast.innerHTML = `
            <div class="flex items-center gap-2.5">
                <i data-lucide="${iconName}" class="w-4 h-4 shrink-0 ${iconColor}"></i>
                <span>${message}</span>
            </div>
            <button type="button" class="text-white/60 hover:text-white transition ml-2">
                <i data-lucide="x" class="w-3.5 h-3.5"></i>
            </button>
        `;

        container.appendChild(toast);
        if (window.lucide) lucide.createIcons();

        // Animar entrada
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-2', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');
        });

        const closeBtn = toast.querySelector('button');
        const dismiss = () => {
            toast.classList.add('opacity-0', 'scale-95');
            setTimeout(() => toast.remove(), 250);
        };

        closeBtn.addEventListener('click', dismiss);
        setTimeout(dismiss, duration);
    }

    // ========================================================================
    // INICIALIZACIÓN UNIFICADA DE SUPABASE CLIENT
    // ========================================================================
    function getSupabaseCredentials() {
        let url = '';
        let key = '';

        if (typeof window !== 'undefined') {
            url = window.SUPABASE_URL || (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) || '';
            key = window.SUPABASE_ANON_KEY || (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.anonKey) || '';
        }

        if (!url && typeof globalThis !== 'undefined') {
            url = globalThis.SUPABASE_URL || (globalThis.SUPABASE_CONFIG && globalThis.SUPABASE_CONFIG.url) || '';
        }
        if (!key && typeof globalThis !== 'undefined') {
            key = globalThis.SUPABASE_ANON_KEY || (globalThis.SUPABASE_CONFIG && globalThis.SUPABASE_CONFIG.anonKey) || '';
        }

        return {
            url: (url || '').trim(),
            key: (key || '').trim()
        };
    }

    function initSupabase() {
        const { url, key } = getSupabaseCredentials();

        if (!url || !key || url.includes('tu-proyecto') || key.includes('TU_SUPABASE')) {
            showToast('Credenciales de Supabase no configuradas en js/supabase-config.js', 'warning', 6000);
            return false;
        }

        if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
            showToast('Librería de Supabase JS no pudo ser cargada desde el CDN.', 'error', 6000);
            return false;
        }

        try {
            supabaseClient = window.supabase.createClient(url, key, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true,
                    storageKey: 'loyliz-admin-auth-session'
                }
            });
            return true;
        } catch (e) {
            console.error('[LOYLIZ Admin] Error creando cliente Supabase:', e);
            showToast(`Error al inicializar conexión con Supabase: ${e.message || 'Error crítico'}`, 'error');
            return false;
        }
    }

    // ========================================================================
    // GESTIÓN DE SESIÓN, AUTH & GUARD DE EJECUCIÓN DUPLICADA
    // ========================================================================
    function isSessionExpiredError(err) {
        if (!err) return false;
        const msg = (err.message || '').toLowerCase();
        const code = String(err.code || '');
        return msg.includes('jwt expired') ||
               msg.includes('invalid jwt') ||
               msg.includes('token is expired') ||
               code === 'PGRST301' ||
               err.status === 401;
    }

    async function handleSessionExpired() {
        console.warn('[LOYLIZ Admin] Sesión expirada o token inválido detectado. Redirigiendo a pantalla de acceso.');
        showToast('Tu sesión ha expirado o el token es inválido. Por favor inicia sesión nuevamente.', 'warning', 6000);
        try {
            await supabaseClient.auth.signOut();
        } catch (e) {}
        handleAuthStateChange('SIGNED_OUT', null);
    }

    async function initDashboard() {
        if (isLoadingDashboard) {
            console.warn('[LOYLIZ Admin] Carga de dashboard ya en progreso. Evitando ejecución duplicada.');
            return;
        }
        isLoadingDashboard = true;

        try {
            await Promise.all([loadCategories(), loadProducts()]);
            dashboardInitialized = true;
            if (window.lucide) lucide.createIcons();
        } catch (err) {
            console.error('[LOYLIZ Admin] Error al inicializar panel de inventario:', err);
            showToast(`Error al inicializar inventario: ${err.message || 'Error de conexión'}`, 'error');
        } finally {
            isLoadingDashboard = false;
        }
    }

    async function initAuth() {
        if (!supabaseClient) return;

        // 1. Escuchar cambios de estado en Auth de forma reactiva
        supabaseClient.auth.onAuthStateChange((event, session) => {
            handleAuthStateChange(event, session);
        });

        // 2. Verificar sesión inicial persistida si aún no ha sido procesada
        try {
            const { data: { session }, error } = await supabaseClient.auth.getSession();
            if (error) throw error;

            if (!isAuthInitialized) {
                handleAuthStateChange('INITIAL_GET_SESSION', session);
            }
        } catch (err) {
            console.error('[LOYLIZ Admin] Error verificando sesión:', err);
            showToast(`Error al verificar sesión: ${err.message || 'Error de conexión'}`, 'error');
            handleAuthStateChange('SESSION_ERROR', null);
        }
    }

    function handleAuthStateChange(event, session) {
        isAuthInitialized = true;
        currentSession = session;

        if (session && session.user) {
            authView.classList.add('hidden');
            dashboardView.classList.remove('hidden');
            adminUserEmail.textContent = session.user.email || 'Admin';

            // Ejecutar carga del panel solo si no ha sido cargado aún o si es un inicio explícito de sesión
            if (event === 'SIGNED_IN' || !dashboardInitialized) {
                initDashboard();
            } else if (window.lucide) {
                lucide.createIcons();
            }
        } else {
            dashboardInitialized = false;
            dashboardView.classList.add('hidden');
            authView.classList.remove('hidden');
            loginEmailInput.value = '';
            loginPasswordInput.value = '';
            hideLoginAlert();
            if (window.lucide) lucide.createIcons();
        }
    }

    // Iniciar Sesión con Email & Contraseña
    async function handleLoginSubmit(e) {
        e.preventDefault();
        hideLoginAlert();

        const email = loginEmailInput.value.trim();
        const password = loginPasswordInput.value.trim();

        if (!email || !password) {
            showLoginAlert('Por favor ingresa tu correo y contraseña.');
            return;
        }

        btnLoginSubmit.disabled = true;
        btnLoginSubmit.innerHTML = `
            <div class="w-4 h-4 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
            <span>Autenticando...</span>
        `;

        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                console.error('[LOYLIZ Admin] Error en inicio de sesión:', error);
                if (error.message.includes('Invalid login credentials')) {
                    showLoginAlert('Credenciales incorrectas. Verifica tu correo y contraseña.');
                } else if (error.message.includes('Email not confirmed')) {
                    showLoginAlert('El correo aún no ha sido confirmado en Supabase Auth.');
                } else {
                    showLoginAlert(error.message || 'Error de autenticación.');
                }
                showToast(`Acceso denegado: ${error.message || 'Revisa tus credenciales'}`, 'error');
                return;
            }

            showToast(`¡Bienvenido, ${data.user.email}!`, 'success');
        } catch (err) {
            console.error('[LOYLIZ Admin] Excepción durante inicio de sesión:', err);
            showLoginAlert('Ocurrió un error de red al intentar conectar con Supabase.');
            showToast(`Fallo de conexión: ${err.message || 'Error de red'}`, 'error');
        } finally {
            btnLoginSubmit.disabled = false;
            btnLoginSubmit.innerHTML = `
                <i data-lucide="log-in" class="w-4 h-4"></i>
                <span>Ingresar al Panel LOYLIZ</span>
            `;
            if (window.lucide) lucide.createIcons();
        }
    }

    // Cerrar Sesión
    async function handleLogout() {
        try {
            const { error } = await supabaseClient.auth.signOut();
            if (error) throw error;
            showToast('Sesión finalizada exitosamente.', 'info');
        } catch (err) {
            console.error('[LOYLIZ Admin] Error al cerrar sesión:', err);
            showToast(`Error al cerrar sesión: ${err.message || 'Error desconocido'}`, 'error');
        }
    }

    function showLoginAlert(msg) {
        loginAlertText.textContent = msg;
        loginAlert.classList.remove('hidden');
    }

    function hideLoginAlert() {
        loginAlert.classList.add('hidden');
        loginAlertText.textContent = '';
    }

    function togglePasswordVisibility() {
        const isPassword = loginPasswordInput.type === 'password';
        loginPasswordInput.type = isPassword ? 'text' : 'password';
        btnTogglePassword.innerHTML = `<i data-lucide="${isPassword ? 'eye-off' : 'eye'}" class="w-4 h-4"></i>`;
        if (window.lucide) lucide.createIcons();
    }

    // ========================================================================
    // CARGA DE DATOS ALINEADA CON EL ESQUEMA POSTGRESQL
    // ========================================================================
    async function loadCategories() {
        if (!supabaseClient) return;

        try {
            // Esquema public.categorias: id, slug, nombre, subtitulo, orden, activa
            const { data, error } = await supabaseClient
                .from('categorias')
                .select('id, slug, nombre, subtitulo, orden, activa')
                .order('orden', { ascending: true });

            if (error) throw error;

            categoriesList = data || [];
            renderCategoriesDropdown();
            renderTableCategoryFilter();
        } catch (err) {
            console.error('[LOYLIZ Admin] Error cargando categorías:', err);
            if (isSessionExpiredError(err)) {
                await handleSessionExpired();
                return;
            }
            showToast(`Error al cargar categorías: ${err.message || 'Error de conexión'}`, 'error');
        }
    }

    function renderCategoriesDropdown() {
        prodCategoriaSelect.innerHTML = '<option value="" disabled selected>Selecciona una línea textil...</option>';
        categoriesList.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.id; // UUID como valor
            opt.dataset.slug = cat.slug;
            opt.textContent = `${cat.nombre} (${cat.slug})`;
            prodCategoriaSelect.appendChild(opt);
        });
    }

    function renderTableCategoryFilter() {
        tableFilterCat.innerHTML = '<option value="all">Todas las Líneas</option>';
        categoriesList.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.id;
            opt.textContent = cat.nombre;
            tableFilterCat.appendChild(opt);
        });
    }

    async function loadProducts() {
        if (!supabaseClient) return;

        inventoryTbody.innerHTML = `
            <tr>
                <td colspan="7" class="py-12 text-center text-gray-400">
                    <div class="w-8 h-8 mx-auto mb-2 border-2 border-brand-navy border-t-brand-gold rounded-full animate-spin"></div>
                    <span>Cargando inventario desde Supabase...</span>
                </td>
            </tr>
        `;

        try {
            // Esquema public.productos alineado con columnas existentes
            const { data, error } = await supabaseClient
                .from('productos')
                .select('id, categoria_id, referencia, nombre, descripcion, tela, tallas, especificaciones, destacado, activo, created_at, categorias(id, nombre, slug), producto_imagenes(id, url_imagen, alt_text, es_principal, orden)')
                .order('created_at', { ascending: false });

            if (error) throw error;

            productsList = data || [];
            updateMetrics();
            renderInventoryTable();
        } catch (err) {
            console.error('[LOYLIZ Admin] Error cargando productos:', err);
            if (isSessionExpiredError(err)) {
                await handleSessionExpired();
                return;
            }
            inventoryTbody.innerHTML = `
                <tr>
                    <td colspan="7" class="py-10 text-center text-rose-500 font-semibold">
                        <i data-lucide="alert-circle" class="w-6 h-6 mx-auto mb-2"></i>
                        <span>Error al cargar productos: ${err.message || 'Error de permisos o tabla'}</span>
                    </td>
                </tr>
            `;
            if (window.lucide) lucide.createIcons();
            showToast(`Error al cargar productos: ${err.message || 'Error de conexión'}`, 'error');
        }
    }

    function updateMetrics() {
        const total = productsList.length;
        const active = productsList.filter(p => p.activo !== false).length;
        const paused = total - active;

        metricTotal.textContent = total;
        metricActive.textContent = active;
        metricPaused.textContent = paused;
    }

    // ========================================================================
    // RENDERIZADO DE TABLA DE INVENTARIO & ACCIONES RÁPIDAS
    // ========================================================================
    function renderInventoryTable() {
        const searchTerm = tableSearch.value.trim().toLowerCase();
        const selectedCat = tableFilterCat.value;
        const selectedStatus = tableFilterStatus.value;

        const filtered = productsList.filter(prod => {
            const ref = (prod.referencia || '').toLowerCase();
            const nom = (prod.nombre || '').toLowerCase();
            const tel = (prod.tela || '').toLowerCase();
            const catNom = (prod.categorias?.nombre || '').toLowerCase();

            const matchesSearch = !searchTerm || ref.includes(searchTerm) || nom.includes(searchTerm) || tel.includes(searchTerm) || catNom.includes(searchTerm);

            const matchesCat = (selectedCat === 'all') || (String(prod.categoria_id) === String(selectedCat)) || (String(prod.categorias?.id) === String(selectedCat));

            const isActive = prod.activo !== false;
            const matchesStatus = (selectedStatus === 'all') || (selectedStatus === 'active' && isActive) || (selectedStatus === 'paused' && !isActive);

            return matchesSearch && matchesCat && matchesStatus;
        });

        inventoryTbody.innerHTML = '';

        if (filtered.length === 0) {
            inventoryTbody.innerHTML = `
                <tr>
                    <td colspan="7" class="py-12 text-center text-gray-400">
                        <i data-lucide="package-x" class="w-8 h-8 mx-auto mb-2 text-gray-300"></i>
                        <p class="font-bold text-gray-500">No se encontraron prendas con los filtros aplicados.</p>
                        <p class="text-[11px] mt-0.5">Prueba cambiando los criterios de búsqueda o registra un nuevo modelo.</p>
                    </td>
                </tr>
            `;
            if (window.lucide) lucide.createIcons();
            return;
        }

        filtered.forEach(prod => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50/80 transition-colors group';

            // Resolver imagen principal ordenada
            let mainImgUrl = FALLBACK_PLACEHOLDER;
            if (Array.isArray(prod.producto_imagenes) && prod.producto_imagenes.length > 0) {
                const sorted = [...prod.producto_imagenes].sort((a, b) => {
                    const aP = a.es_principal ? 1 : 0;
                    const bP = b.es_principal ? 1 : 0;
                    if (bP !== aP) return bP - aP;
                    return (a.orden || 0) - (b.orden || 0);
                });
                mainImgUrl = sorted[0].url_imagen || FALLBACK_PLACEHOLDER;
            }

            const ref = prod.referencia || `LLZ-${prod.id}`;
            const nombre = prod.nombre || 'Sin nombre';
            const tela = prod.tela || 'Confección Nacional';
            const catNombre = prod.categorias?.nombre || 'General';
            const isActive = prod.activo !== false;

            let tallasStr = '--';
            if (Array.isArray(prod.tallas) && prod.tallas.length > 0) {
                tallasStr = prod.tallas.join(', ');
            } else if (typeof prod.tallas === 'string') {
                tallasStr = prod.tallas;
            }

            tr.innerHTML = `
                <!-- Miniatura -->
                <td class="py-3 px-4">
                    <div class="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 relative">
                        <img src="${mainImgUrl}" alt="${nombre}" onerror="this.onerror=null; this.src='${FALLBACK_PLACEHOLDER}';" class="w-full h-full object-cover">
                    </div>
                </td>

                <!-- Referencia -->
                <td class="py-3 px-4 font-mono font-bold text-brand-navy">
                    <span>${ref}</span>
                </td>

                <!-- Modelo & Tela -->
                <td class="py-3 px-4 max-w-xs">
                    <span class="font-display font-bold text-brand-navy block truncate" title="${nombre}">${nombre}</span>
                    <span class="text-[11px] text-gray-500 block truncate" title="${tela}">${tela}</span>
                </td>

                <!-- Línea / Categoría -->
                <td class="py-3 px-4 whitespace-nowrap">
                    <span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-navy/10 text-brand-navy">
                        ${catNombre}
                    </span>
                </td>

                <!-- Tallas -->
                <td class="py-3 px-4 text-gray-600 max-w-[120px] truncate" title="${tallasStr}">
                    ${tallasStr}
                </td>

                <!-- Estado Activo / Pausado (Píldora interactiva) -->
                <td class="py-3 px-4 text-center whitespace-nowrap">
                    <button type="button" data-action="toggle-status" data-id="${prod.id}"
                            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition shadow-xs cursor-pointer ${
                                isActive ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            }" title="Clic para alternar estado">
                        <span class="w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-amber-500'}"></span>
                        <span>${isActive ? 'Activo' : 'Pausado'}</span>
                    </button>
                </td>

                <!-- Acciones -->
                <td class="py-3 px-4 text-right whitespace-nowrap">
                    <div class="inline-flex items-center gap-1">
                        <button type="button" data-action="edit" data-id="${prod.id}" title="Editar modelo"
                                class="p-2 rounded-xl text-brand-navy hover:bg-brand-navy/10 transition">
                            <i data-lucide="edit-3" class="w-4 h-4"></i>
                        </button>
                        <button type="button" data-action="delete" data-id="${prod.id}" title="Eliminar modelo y fotos"
                                class="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </td>
            `;

            inventoryTbody.appendChild(tr);
        });

        if (window.lucide) lucide.createIcons();
    }

    // Delegación de eventos en la tabla de inventario
    inventoryTbody.addEventListener('click', async (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;

        const action = btn.dataset.action;
        const id = btn.dataset.id;
        const product = productsList.find(p => String(p.id) === String(id));
        if (!product) return;

        if (action === 'toggle-status') {
            await handleToggleStatus(product);
        } else if (action === 'edit') {
            startEditProduct(product);
        } else if (action === 'delete') {
            askDeleteProduct(product);
        }
    });

    // Alternar visibilidad (Activo / Pausado)
    async function handleToggleStatus(product) {
        const newStatus = !(product.activo !== false);

        try {
            const { error } = await supabaseClient
                .from('productos')
                .update({ activo: newStatus })
                .eq('id', product.id);

            if (error) throw error;

            product.activo = newStatus;
            invalidatePublicCache();
            updateMetrics();
            renderInventoryTable();
            showToast(`Modelo '${product.nombre || product.referencia}' ${newStatus ? 'activado' : 'pausado'} con éxito.`, 'success');
        } catch (err) {
            console.error('[LOYLIZ Admin] Error cambiando estado del producto:', err);
            showToast(`Error al actualizar estado: ${err.message || 'Error de conexión'}`, 'error');
        }
    }

    // ========================================================================
    // EDICIÓN DE PRENDAS & DESEMPAQUETADO DE ESPECIFICACIONES JSONB
    // ========================================================================
    function startEditProduct(product) {
        isEditingMode = true;
        editingProductId = product.id;
        deletedImageIds = [];
        deletedImagePaths = [];

        // Actualizar UI del formulario
        formTitle.textContent = `Editar Modelo: ${product.nombre || product.referencia}`;
        formSubtitle.textContent = `Modificando registro ID #${product.id} (REF: ${product.referencia})`;
        btnCancelEdit.classList.remove('hidden');
        btnSubmitText.textContent = 'Actualizar Modelo';

        // Llenar campos directos del esquema PostgreSQL
        prodIdInput.value = product.id;
        prodCategoriaSelect.value = product.categoria_id || '';
        prodReferenciaInput.value = product.referencia || '';
        prodNombreInput.value = product.nombre || '';
        prodTelaInput.value = product.tela || '';
        prodDescripcionTextarea.value = product.descripcion || '';
        prodActivoCheckbox.checked = product.activo !== false;
        prodDestacadoCheckbox.checked = Boolean(product.destacado);

        // Desempaquetar especificaciones JSONB (genero, colores, uso_recomendado y pares clave-valor)
        const specs = (product.especificaciones && typeof product.especificaciones === 'object')
            ? product.especificaciones
            : {};

        prodGeneroInput.value = specs.genero || '';
        prodColoresInput.value = specs.colores || '';
        prodUsoInput.value = specs.uso_recomendado || specs.uso || '';

        // Filtrar campos estándar de UI para no duplicarlos en la lista de especificaciones libres
        const reservedKeys = ['genero', 'gender', 'colores', 'colors', 'uso_recomendado', 'uso', 'use'];
        const customSpecs = {};
        Object.entries(specs).forEach(([k, v]) => {
            if (!reservedKeys.includes(k.toLowerCase().trim())) {
                customSpecs[k] = v;
            }
        });
        renderSpecsBuilder(customSpecs);

        // Llenar tallas
        let selectedSizes = [];
        if (Array.isArray(product.tallas)) {
            selectedSizes = product.tallas;
        } else if (typeof product.tallas === 'string') {
            try {
                const parsed = JSON.parse(product.tallas);
                selectedSizes = Array.isArray(parsed) ? parsed : [product.tallas];
            } catch {
                selectedSizes = product.tallas.split(/[-–—,;/]+/).map(s => s.trim());
            }
        }
        document.querySelectorAll('input[name="prod_size"]').forEach(cb => {
            cb.checked = selectedSizes.includes(cb.value);
        });

        // Llenar imágenes existentes
        stagedImages = [];
        if (Array.isArray(product.producto_imagenes)) {
            product.producto_imagenes.forEach((img, idx) => {
                stagedImages.push({
                    id: img.id,
                    isExisting: true,
                    url: img.url_imagen,
                    previewUrl: img.url_imagen,
                    isPrincipal: Boolean(img.es_principal),
                    orden: typeof img.orden === 'number' ? img.orden : idx + 1,
                    altText: img.alt_text || ''
                });
            });
        }
        renderStagedImages();

        // Desplazamiento al formulario
        document.getElementById('formulario-prenda').scrollIntoView({ behavior: 'smooth' });
        showToast(`Datos de '${product.nombre || product.referencia}' cargados para edición.`, 'info');
        if (window.lucide) lucide.createIcons();
    }

    function cancelEditMode() {
        isEditingMode = false;
        editingProductId = null;
        deletedImageIds = [];
        deletedImagePaths = [];
        formTitle.textContent = 'Registrar Nuevo Modelo Textil';
        formSubtitle.textContent = 'Completa la ficha técnica para publicar la prenda en el catálogo público';
        btnCancelEdit.classList.add('hidden');
        btnSubmitText.textContent = 'Guardar y Publicar Prenda';
        resetForm();
    }

    // Modal de confirmación para eliminar
    function askDeleteProduct(product) {
        pendingDeleteProduct = product;
        confirmTitle.textContent = `¿Eliminar '${product.nombre || product.referencia}'?`;
        confirmMessage.textContent = `Esta acción eliminará el registro de la base de datos y purgará todas sus fotografías asociadas en el bucket '${BUCKET_NAME}'. No se puede deshacer.`;

        confirmModal.classList.remove('opacity-0', 'pointer-events-none');
        confirmCard.classList.remove('scale-95');
        confirmCard.classList.add('scale-100');
    }

    function closeConfirmModal() {
        confirmModal.classList.add('opacity-0', 'pointer-events-none');
        confirmCard.classList.remove('scale-100');
        confirmCard.classList.add('scale-95');
        pendingDeleteProduct = null;
    }

    btnConfirmCancel.addEventListener('click', closeConfirmModal);
    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) closeConfirmModal();
    });

    btnConfirmAccept.addEventListener('click', async () => {
        if (!pendingDeleteProduct) return;
        const prod = pendingDeleteProduct;
        closeConfirmModal();

        try {
            // 1. Limpiar imágenes del bucket en Storage si existen
            if (Array.isArray(prod.producto_imagenes) && prod.producto_imagenes.length > 0) {
                const pathsToDelete = prod.producto_imagenes
                    .map(img => extractStoragePath(img.url_imagen))
                    .filter(Boolean);

                if (pathsToDelete.length > 0) {
                    const { error: storageErr } = await supabaseClient.storage.from(BUCKET_NAME).remove(pathsToDelete);
                    if (storageErr) console.warn('[LOYLIZ Admin] Advertencia purgando fotos en Storage:', storageErr);
                }
            }

            // 2. Eliminar filas asociadas en 'producto_imagenes'
            const { error: imgDelError } = await supabaseClient.from('producto_imagenes').delete().eq('producto_id', prod.id);
            if (imgDelError) console.warn('[LOYLIZ Admin] Advertencia eliminando filas de producto_imagenes:', imgDelError);

            // 3. Eliminar el producto de la tabla 'productos'
            const { error } = await supabaseClient.from('productos').delete().eq('id', prod.id);
            if (error) throw error;

            productsList = productsList.filter(p => p.id !== prod.id);
            invalidatePublicCache();
            updateMetrics();
            renderInventoryTable();
            showToast(`Modelo '${prod.nombre || prod.referencia}' eliminado correctamente.`, 'success');
        } catch (err) {
            console.error('[LOYLIZ Admin] Error al eliminar producto:', err);
            showToast(`Error al eliminar modelo: ${err.message || 'Error de conexión'}`, 'error');
        }
    });

    function extractStoragePath(url) {
        if (!url || typeof url !== 'string') return null;
        const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;
        const idx = url.indexOf(marker);
        if (idx !== -1) {
            return url.substring(idx + marker.length);
        }
        return null;
    }

    // ========================================================================
    // TALLAS (CHECKBOXES INTERACTIVOS)
    // ========================================================================
    function renderSizesCheckboxes() {
        sizesCheckboxContainer.innerHTML = '';
        SIZES_AVAILABLE.forEach(size => {
            const label = document.createElement('label');
            label.className = 'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold cursor-pointer hover:border-brand-navy transition shadow-xs select-none';
            label.innerHTML = `
                <input type="checkbox" name="prod_size" value="${size}" class="w-4 h-4 rounded text-brand-navy focus:ring-brand-gold accent-brand-navy">
                <span class="text-brand-navy">${size}</span>
            `;
            sizesCheckboxContainer.appendChild(label);
        });
    }

    btnToggleAllSizes.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('input[name="prod_size"]');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        checkboxes.forEach(cb => { cb.checked = !allChecked; });
    });

    function getSelectedSizes() {
        const checked = document.querySelectorAll('input[name="prod_size"]:checked');
        return Array.from(checked).map(cb => cb.value);
    }

    // ========================================================================
    // CONSTRUCTOR DE ESPECIFICACIONES DINÁMICAS (JSONB BUILDER)
    // ========================================================================
    function renderSpecsBuilder(existingSpecs = null) {
        specsListContainer.innerHTML = '';

        const defaults = {
            "Costura": "Doble pespunte industrial reforzado",
            "Gramaje": "180 gsm"
        };

        const specs = (existingSpecs && typeof existingSpecs === 'object' && Object.keys(existingSpecs).length > 0)
            ? existingSpecs
            : (existingSpecs !== null ? {} : defaults);

        Object.entries(specs).forEach(([k, v]) => {
            addSpecRow(k, v);
        });
    }

    function addSpecRow(key = '', val = '') {
        const row = document.createElement('div');
        row.className = 'spec-row flex items-center gap-2.5';
        row.innerHTML = `
            <div class="w-1/3">
                <input type="text" placeholder="Atributo (ej: Cuello)" value="${key}"
                       class="spec-key w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-gold/30 bg-white">
            </div>
            <div class="flex-1">
                <input type="text" placeholder="Valor (ej: Redondo con rib 1x1)" value="${val}"
                       class="spec-val w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-gold/30 bg-white">
            </div>
            <button type="button" class="btn-remove-spec p-2 text-gray-400 hover:text-rose-600 transition" title="Quitar atributo">
                <i data-lucide="trash" class="w-4 h-4"></i>
            </button>
        `;

        row.querySelector('.btn-remove-spec').addEventListener('click', () => {
            row.remove();
        });

        specsListContainer.appendChild(row);
        if (window.lucide) lucide.createIcons();
    }

    btnAddSpec.addEventListener('click', () => {
        addSpecRow('', '');
    });

    function getSpecsObject() {
        const result = {};
        const rows = specsListContainer.querySelectorAll('.spec-row');
        rows.forEach(r => {
            const k = r.querySelector('.spec-key')?.value.trim();
            const v = r.querySelector('.spec-val')?.value.trim();
            if (k && v) {
                result[k] = v;
            }
        });
        return result;
    }

    // ========================================================================
    // AUTO-GENERADOR DE CÓDIGO DE REFERENCIA
    // ========================================================================
    btnAutoRef.addEventListener('click', () => {
        const selectedOpt = prodCategoriaSelect.options[prodCategoriaSelect.selectedIndex];
        let prefix = 'LLZ';

        if (selectedOpt && selectedOpt.dataset.slug) {
            const s = selectedOpt.dataset.slug.toUpperCase();
            if (s.includes('SANITAR') || s.includes('MED')) prefix = 'LLZ-MED';
            else if (s.includes('DEPORT') || s.includes('DEP')) prefix = 'LLZ-DEP';
            else if (s.includes('CASUAL') || s.includes('TEMAT')) prefix = 'LLZ-CAS';
            else if (s.includes('FRANEL') || s.includes('BAS')) prefix = 'LLZ-BAS';
            else if (s.includes('CORP')) prefix = 'LLZ-CORP';
            else if (s.includes('INFANT') || s.includes('JUV')) prefix = 'LLZ-KID';
            else prefix = `LLZ-${s.substring(0, 3)}`;
        }

        const randomNum = String(Math.floor(Math.random() * 90) + 10).padStart(2, '0');
        prodReferenciaInput.value = `${prefix}-${randomNum}`;
    });

    // ========================================================================
    // COMPRESIÓN WEBP EN CLIENTE & GESTIÓN MULTIMEDIA
    // ========================================================================
    async function compressImageToWebP(file, maxWidth = 1400, quality = 0.82) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (!blob) {
                            reject(new Error('No se pudo comprimir la imagen en WebP.'));
                            return;
                        }

                        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                        const cleanName = baseName.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
                        const webpFileName = `${cleanName}-${Date.now()}.webp`;

                        const webpFile = new File([blob], webpFileName, { type: 'image/webp' });

                        resolve({
                            file: webpFile,
                            blob: blob,
                            previewUrl: URL.createObjectURL(blob),
                            originalSize: file.size,
                            compressedSize: blob.size,
                            width: width,
                            height: height
                        });
                    }, 'image/webp', quality);
                };
                img.onerror = () => reject(new Error('Error al procesar el archivo de imagen.'));
            };
            reader.onerror = () => reject(new Error('Error al leer el archivo.'));
        });
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    // Drag and Drop & File Input
    dropzone.addEventListener('click', () => prodImagesInput.click());
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('border-brand-navy', 'bg-[#FAECDA]/40');
    });
    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('border-brand-navy', 'bg-[#FAECDA]/40');
    });
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-brand-navy', 'bg-[#FAECDA]/40');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFilesSelected(e.dataTransfer.files);
        }
    });

    prodImagesInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFilesSelected(e.target.files);
        }
    });

    async function handleFilesSelected(fileList) {
        const files = Array.from(fileList);
        showToast(`Comprimiendo ${files.length} imagen(es) a WebP...`, 'info', 2500);

        for (const file of files) {
            if (!file.type.startsWith('image/')) continue;

            try {
                const compressed = await compressImageToWebP(file);
                const isFirst = stagedImages.length === 0;

                stagedImages.push({
                    id: `new-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                    isExisting: false,
                    file: compressed.file,
                    blob: compressed.blob,
                    previewUrl: compressed.previewUrl,
                    originalSize: compressed.originalSize,
                    compressedSize: compressed.compressedSize,
                    isPrincipal: isFirst
                });
            } catch (err) {
                console.error('[LOYLIZ Admin] Error comprimiendo imagen:', err);
                showToast(`Error al comprimir ${file.name}: ${err.message}`, 'error');
            }
        }

        renderStagedImages();
        showToast('Imágenes procesadas en WebP listas para subir.', 'success');
    }

    function renderStagedImages() {
        if (stagedImages.length === 0) {
            stagedImagesContainer.classList.add('hidden');
            stagedImagesGrid.innerHTML = '';
            return;
        }

        stagedImagesContainer.classList.remove('hidden');
        stagedImagesGrid.innerHTML = '';

        // Asegurar que al menos una imagen sea la principal
        const hasPrincipal = stagedImages.some(img => img.isPrincipal);
        if (!hasPrincipal && stagedImages.length > 0) {
            stagedImages[0].isPrincipal = true;
        }

        stagedImages.forEach((img, idx) => {
            const card = document.createElement('div');
            card.className = `relative rounded-2xl overflow-hidden border-2 transition-all p-1 bg-white shadow-xs group ${
                img.isPrincipal ? 'border-brand-gold ring-2 ring-brand-gold/40' : 'border-gray-200'
            }`;

            let sizePill = '';
            if (!img.isExisting && img.originalSize && img.compressedSize) {
                const savings = Math.round((1 - (img.compressedSize / img.originalSize)) * 100);
                sizePill = `<span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-0.5 block truncate">
                    ${formatFileSize(img.compressedSize)} (-${savings}%)
                </span>`;
            }

            card.innerHTML = `
                <div class="h-28 rounded-xl overflow-hidden bg-gray-100 relative">
                    <img src="${img.previewUrl}" alt="Foto ${idx + 1}" class="w-full h-full object-cover">
                    <!-- Botón Estrella para Foto Principal -->
                    <button type="button" data-action="set-principal" data-index="${idx}"
                            class="absolute top-1.5 left-1.5 p-1.5 rounded-lg backdrop-blur-sm transition ${
                                img.isPrincipal ? 'bg-brand-navy text-brand-gold shadow' : 'bg-black/40 text-white/80 hover:text-white'
                            }" title="${img.isPrincipal ? 'Foto Principal Oficial' : 'Marcar como Foto Principal'}">
                        <i data-lucide="star" class="w-3.5 h-3.5 ${img.isPrincipal ? 'fill-brand-gold' : ''}"></i>
                    </button>
                    <!-- Botón Eliminar Miniatura -->
                    <button type="button" data-action="remove-thumb" data-index="${idx}"
                            class="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-black/40 text-white hover:bg-rose-600 transition" title="Quitar foto">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
                <div class="p-1.5 text-center">
                    <span class="text-[10px] font-bold text-brand-navy block truncate">
                        ${img.isPrincipal ? '★ Principal' : `Vista ${idx + 1}`}
                    </span>
                    ${sizePill}
                </div>
            `;

            card.querySelector('button[data-action="set-principal"]').addEventListener('click', () => {
                stagedImages.forEach((item, i) => { item.isPrincipal = (i === idx); });
                renderStagedImages();
            });

            card.querySelector('button[data-action="remove-thumb"]').addEventListener('click', () => {
                const removed = stagedImages.splice(idx, 1)[0];
                if (removed && removed.isExisting && removed.id) {
                    deletedImageIds.push(removed.id);
                    if (removed.url) {
                        deletedImagePaths.push(extractStoragePath(removed.url));
                    }
                }
                renderStagedImages();
            });

            stagedImagesGrid.appendChild(card);
        });

        if (window.lucide) lucide.createIcons();
    }

    // ========================================================================
    // ENVÍO DEL FORMULARIO: REGISTRAR / EDITAR MODELO
    // ========================================================================
    async function handleProductFormSubmit(e) {
        e.preventDefault();

        const referencia = prodReferenciaInput.value.trim().toUpperCase();
        const nombre = prodNombreInput.value.trim();
        const categoriaId = prodCategoriaSelect.value; // UUID string
        const tela = prodTelaInput.value.trim();
        const genero = prodGeneroInput.value.trim() || 'Unisex / Confección Premium';
        const colores = prodColoresInput.value.trim() || 'A convenir';
        const uso = prodUsoInput.value.trim() || 'Uso profesional y casual';
        const descripcion = prodDescripcionTextarea.value.trim();
        const activo = prodActivoCheckbox.checked;
        const destacado = prodDestacadoCheckbox.checked;
        const tallas = getSelectedSizes();

        if (!referencia || !nombre || !categoriaId || !tela) {
            showToast('Por favor completa los campos obligatorios (*).', 'warning');
            return;
        }

        if (tallas.length === 0) {
            showToast('Selecciona al menos una talla disponible para el modelo.', 'warning');
            return;
        }

        btnSubmitProduct.disabled = true;
        btnSubmitProduct.innerHTML = `
            <div class="w-4 h-4 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
            <span>Guardando en Supabase...</span>
        `;

        try {
            // Empaquetar genero, colores y uso_recomendado junto a las especificaciones clave-valor
            const customSpecs = getSpecsObject();
            const especificaciones = {
                ...customSpecs,
                genero: genero,
                colores: colores,
                uso_recomendado: uso
            };

            // Payload alineado 100% con las columnas de public.productos
            const productPayload = {
                categoria_id: categoriaId,
                referencia: referencia,
                nombre: nombre,
                descripcion: descripcion,
                tela: tela,
                tallas: tallas,
                especificaciones: especificaciones,
                destacado: Boolean(destacado),
                activo: Boolean(activo)
            };

            let savedProduct = null;

            if (isEditingMode && editingProductId) {
                // Actualizar registro existente
                const { data, error } = await supabaseClient
                    .from('productos')
                    .update(productPayload)
                    .eq('id', editingProductId)
                    .select('id, categoria_id, referencia, nombre, descripcion, tela, tallas, especificaciones, destacado, activo, created_at')
                    .single();

                if (error) throw error;
                savedProduct = data;
                showToast(`Modelo '${nombre}' actualizado con éxito.`, 'success');
            } else {
                // Insertar nuevo registro
                const { data, error } = await supabaseClient
                    .from('productos')
                    .insert([productPayload])
                    .select('id, categoria_id, referencia, nombre, descripcion, tela, tallas, especificaciones, destacado, activo, created_at')
                    .single();

                if (error) throw error;
                savedProduct = data;
                showToast(`Nuevo modelo '${nombre}' publicado con éxito.`, 'success');
            }

            // Purgar imágenes existentes que fueron eliminadas del staged grid
            if (isEditingMode && deletedImageIds.length > 0) {
                try {
                    const { error: delImgsErr } = await supabaseClient
                        .from('producto_imagenes')
                        .delete()
                        .in('id', deletedImageIds);
                    if (delImgsErr) throw delImgsErr;

                    const paths = deletedImagePaths.filter(Boolean);
                    if (paths.length > 0) {
                        await supabaseClient.storage.from(BUCKET_NAME).remove(paths);
                    }
                } catch (delErr) {
                    console.error('[LOYLIZ Admin] Error eliminando imágenes anteriores:', delErr);
                    showToast(`Advertencia al remover imágenes anteriores: ${delErr.message}`, 'warning');
                }
            }

            // Subir nuevas imágenes al Storage y registrar en producto_imagenes
            const newImagesToUpload = stagedImages.filter(img => !img.isExisting && img.file);
            if (newImagesToUpload.length > 0) {
                showToast(`Subiendo ${newImagesToUpload.length} foto(s) a Supabase Storage (${BUCKET_NAME})...`, 'info', 3000);

                for (let i = 0; i < newImagesToUpload.length; i++) {
                    const imgItem = newImagesToUpload[i];
                    const cleanRef = referencia.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
                    const filePath = `productos/${cleanRef}-${Date.now()}-${i + 1}.webp`;

                    const { error: uploadError } = await supabaseClient
                        .storage
                        .from(BUCKET_NAME)
                        .upload(filePath, imgItem.file, {
                            contentType: 'image/webp',
                            upsert: true
                        });

                    if (uploadError) {
                        console.error('[LOYLIZ Admin] Error subiendo foto a Storage:', uploadError);
                        showToast(`Fallo al subir foto ${i + 1} a Storage: ${uploadError.message}`, 'error');
                        continue;
                    }

                    // Obtener URL pública absoluta
                    const { data: urlData } = supabaseClient
                        .storage
                        .from(BUCKET_NAME)
                        .getPublicUrl(filePath);

                    const publicUrl = urlData?.publicUrl || '';

                    // Insertar fila en 'producto_imagenes'
                    const globalIndex = stagedImages.indexOf(imgItem);
                    const { error: imgInsertError } = await supabaseClient
                        .from('producto_imagenes')
                        .insert([{
                            producto_id: savedProduct.id,
                            url_imagen: publicUrl,
                            alt_text: `${nombre} - Vista ${i + 1}`,
                            es_principal: Boolean(imgItem.isPrincipal),
                            orden: globalIndex >= 0 ? globalIndex + 1 : i + 1
                        }]);

                    if (imgInsertError) {
                        console.error('[LOYLIZ Admin] Error registrando foto en base de datos:', imgInsertError);
                        showToast(`Error al asociar foto en BD: ${imgInsertError.message}`, 'error');
                    }
                }
            }

            // Si se editó la foto principal u orden de imágenes existentes
            if (isEditingMode) {
                for (let idx = 0; idx < stagedImages.length; idx++) {
                    const item = stagedImages[idx];
                    if (item.isExisting && item.id) {
                        const { error: updErr } = await supabaseClient
                            .from('producto_imagenes')
                            .update({
                                es_principal: Boolean(item.isPrincipal),
                                orden: idx + 1
                            })
                            .eq('id', item.id);
                        if (updErr) console.warn('[LOYLIZ Admin] Error actualizando orden de imagen:', updErr);
                    }
                }
            }

            // Limpiar caché pública de sessionStorage para reflejar cambios inmediatos
            invalidatePublicCache();

            // Resetear formulario y recargar inventario
            cancelEditMode();
            await loadProducts();
        } catch (err) {
            console.error('[LOYLIZ Admin] Error guardando producto:', err);
            showToast(`Error al guardar modelo: ${err.message || 'Verifica permisos RLS'}`, 'error', 6000);
        } finally {
            btnSubmitProduct.disabled = false;
            btnSubmitProduct.innerHTML = `
                <i data-lucide="check" class="w-4 h-4"></i>
                <span>${isEditingMode ? 'Actualizar Modelo' : 'Guardar y Publicar Prenda'}</span>
            `;
            if (window.lucide) lucide.createIcons();
        }
    }

    function resetForm() {
        productForm.reset();
        prodIdInput.value = '';
        prodActivoCheckbox.checked = true;
        prodDestacadoCheckbox.checked = false;
        stagedImages = [];
        deletedImageIds = [];
        deletedImagePaths = [];
        renderStagedImages();
        renderSizesCheckboxes();
        renderSpecsBuilder();
        if (window.lucide) lucide.createIcons();
    }

    function invalidatePublicCache() {
        try {
            sessionStorage.removeItem(CACHE_KEYS.PRODUCTOS);
            sessionStorage.removeItem(CACHE_KEYS.CATEGORIAS);
            console.info('[LOYLIZ Admin] Caché pública de sessionStorage limpiada exitosamente.');
        } catch (e) {
            console.warn('[LOYLIZ Admin] No se pudo acceder a sessionStorage:', e);
        }
    }

    // ========================================================================
    // LISTENERS GLOBALES
    // ========================================================================
    function setupEventListeners() {
        loginForm.addEventListener('submit', handleLoginSubmit);
        btnTogglePassword.addEventListener('click', togglePasswordVisibility);
        btnLogout.addEventListener('click', handleLogout);

        btnClearCache.addEventListener('click', () => {
            invalidatePublicCache();
            showToast('Caché del catálogo limpiada. Los visitantes verán los cambios inmediatamente.', 'success');
        });

        productForm.addEventListener('submit', handleProductFormSubmit);
        btnResetForm.addEventListener('click', resetForm);
        btnCancelEdit.addEventListener('click', cancelEditMode);

        // Búsqueda y filtros de tabla
        tableSearch.addEventListener('input', renderInventoryTable);
        tableFilterCat.addEventListener('change', renderInventoryTable);
        tableFilterStatus.addEventListener('change', renderInventoryTable);
    }

    // Inicialización al cargar el DOM
    document.addEventListener('DOMContentLoaded', () => {
        setupEventListeners();
        renderSizesCheckboxes();
        renderSpecsBuilder();

        const isSupabaseReady = initSupabase();
        if (isSupabaseReady) {
            initAuth();
        }

        if (window.lucide) lucide.createIcons();
    });

})();
