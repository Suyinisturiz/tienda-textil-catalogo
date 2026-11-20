/**
 * ============================================================================
 * LOYLIZ | Configuración Unificada de Supabase (REST API & Storage)
 * ============================================================================
 * Provee credenciales seguras e interoperables tanto para scripts estándar en
 * el navegador (window / globalThis) como para entornos modulares ES / CommonJS.
 */

(function (global) {
    'use strict';

    // Credenciales activas de Supabase REST API & Storage para LOYLIZ
    var SUPABASE_URL = 'https://coedkmgwbuxskconzbdp.supabase.co';
    var SUPABASE_ANON_KEY = 'sb_publishable_dXYJ8_Q5so82E3wsLWKnNA_0HXrPRv_';

    var SUPABASE_CONFIG = {
        url: SUPABASE_URL,
        anonKey: SUPABASE_ANON_KEY
    };

    // Asignación directa en el ámbito global del navegador
    if (typeof window !== 'undefined') {
        window.SUPABASE_URL = SUPABASE_URL;
        window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
        window.SUPABASE_CONFIG = SUPABASE_CONFIG;
    }

    if (typeof global !== 'undefined') {
        global.SUPABASE_URL = SUPABASE_URL;
        global.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
        global.SUPABASE_CONFIG = SUPABASE_CONFIG;
    }

    // Compatibilidad con CommonJS / Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            SUPABASE_URL: SUPABASE_URL,
            SUPABASE_ANON_KEY: SUPABASE_ANON_KEY,
            SUPABASE_CONFIG: SUPABASE_CONFIG
        };
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
