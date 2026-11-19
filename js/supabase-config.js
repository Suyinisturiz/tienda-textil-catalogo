/**
 * ============================================================================
 * LOYLIZ | Configuración de Conexión a Supabase (REST API & Storage)
 * ============================================================================
 * 
 * GUÍA RÁPIDA DE CONFIGURACIÓN:
 * 1. Ingresa a tu panel de Supabase: https://supabase.com/dashboard
 * 2. Selecciona tu proyecto LOYLIZ.
 * 3. En la barra lateral izquierda, haz clic en el icono de engranaje (Project Settings) > "API".
 * 4. Copia la "Project URL" y pégala en la constante SUPABASE_URL (sustituyendo el placeholder).
 * 5. En "Project API Keys", copia la clave "anon" / "public" (o "publishable key") y pégala en SUPABASE_ANON_KEY.
 * 
 * NOTA DE SEGURIDAD & DESPLIEGUE (GitHub Pages / cPanel):
 * La clave "anon" es pública por diseño y segura para navegadores cliente siempre
 * que tengas configuradas las políticas de Row Level Security (RLS) en PostgreSQL.
 * NUNCA coloques aquí la clave "service_role" (secreta).
 * 
 * MODO DE CONTINGENCIA AUTOMÁTICO (FALLBACK):
 * Si las credenciales no están configuradas o permanecen con los placeholders por defecto,
 * el catálogo activará automáticamente el catálogo local con los modelos de muestra,
 * garantizando que el sitio web nunca se muestre roto o vacío ante los clientes.
 */

// Credenciales activas de Supabase REST API para LOYLIZ
const SUPABASE_URL = 'https://coedkmgwbuxskconzbdp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dXYJ8_Q5so82E3wsLWKnNA_0HXrPRv_';

// Configuración unificada accesible globalmente en el navegador
const SUPABASE_CONFIG = {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY
};

// Exportación compatible para navegadores sin empaquetadores (Vanilla JS) y entornos modulares
if (typeof window !== 'undefined') {
    window.SUPABASE_URL = SUPABASE_URL;
    window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_CONFIG };
}
