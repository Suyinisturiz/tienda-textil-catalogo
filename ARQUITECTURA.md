# LOYLIZ | Documentación Técnica & Arquitectura del Proyecto

> **Guía de Contexto y Referencia Integral para Desarrolladores y Agentes de IA.**  
> Este documento preserva el contexto técnico, la arquitectura de datos, el Brand Kit oficial y los patrones de implementación de la plataforma web de **LOYLIZ (Diseño, Asesoría & Confección Premium)**.

---

## 1. Identidad de Marca & Brand Kit

| Token / Rol | Color HEX | Formato RGB | Aplicación en la Plataforma |
| :--- | :--- | :--- | :--- |
| **Midnight Navy** (Principal) | `#152942` | `rgb(21, 41, 66)` | Headers, barras de navegación, botones primarios, títulos H1/H2 |
| **Deep Midnight** (Fondo Oscuro) | `#060E11` | `rgb(6, 14, 17)` | Footers, marquesina textil continua, fondos de alto contraste |
| **Dusty Rose / Palo de Rosa** (Acento) | `#D48C95` | `rgb(212, 140, 149)` | Badges, halos luminosos, puntos activos de carrusel, acentos |
| **Ash Rose / Rosa Cenizo** (Hover) | `#B36573` | `rgb(179, 101, 115)` | Estados hover en botones interactivos y bordes destacados |
| **Textile Ivory / Marfil Textil** (Cálido) | `#FAECDA` | `rgb(250, 236, 218)` | Fondos secundarios, tarjetas cálidas y contrastes suaves |

- **Tipografía Display (Títulos):** `'Montserrat', sans-serif` (Pesos 600 SemiBold, 700 Bold, 800 ExtraBold).
- **Tipografía de Lectura (Cuerpo):** `'Open Sans', sans-serif` (Pesos 400 Regular, 500 Medium, 600 SemiBold).

---

## 2. Arquitectura de Archivos del Proyecto

```
tienda-textil-catalogo/
├── index.html                # Catálogo público interactivo, Hero con carrusel y cotizador WhatsApp
├── admin.html                # Panel administrativo privado con login Supabase, CRUD y subida a Storage
├── ARQUITECTURA.md           # Memoria técnica del proyecto y referencia de IA (este archivo)
├── README.md                 # Documentación general del repositorio
├── .gitignore                # Reglas de exclusión de Git
├── css/
│   └── styles.css            # Variables CSS dinámicas, transiciones del carrusel y micro-animaciones
├── js/
│   ├── supabase-config.js    # Credenciales de conexión unificada (REST API & Storage) para Browser/ESM
│   ├── hero-carousel.js      # Carrusel Hero autónomo: auto-play 4.5s, swipe táctil, cero solapamiento
│   ├── catalog-service.js    # Servicio del catálogo público con caché en sessionStorage y fallback
│   ├── admin.js              # Controlador del panel admin: auth, compresión WebP Canvas y RLS
│   ├── main.js               # Lógica interactiva del catálogo: filtros, modal cinemático y WhatsApp
│   └── theme-switcher.js     # Selector y persistencia de temas visuales
└── img/
    ├── logos/                # Imagotipos y logotipos oficiales de LOYLIZ en PNG transparente
    └── productos/            # Fotografías de prendas y muestrarios locales
```

---

## 3. Carrusel Interactivo del Hero (`js/hero-carousel.js`)

El carrusel reemplazó la imagen estática de la columna derecha del Hero por un visualizador auto-play dinámico y accesible:

### Características Clave:
- **Zero Librerías:** 100% Vanilla JS y transiciones CSS optimizadas por GPU (*crossfade* + zoom sutil *Ken Burns*).
- **Auto-play Inteligente:** Rota cada **4500 ms**. Se pausa al colocar el cursor encima (`mouseenter`) o al recibir foco (`focusin`), y se reanuda al salir (`mouseleave` / `focusout`).
- **Soporte Táctil (Swipe):** Detección de deslizamiento a la izquierda (siguiente) y derecha (anterior) en móviles.
- **Solución al Solapamiento (0% Overlap):**
  - Los badges flotantes (*"Asesoría de Imagen"* a la izquierda y *"Doble Pespunte"* a la derecha) están en `z-index: 30`.
  - El texto de las diapositivas (`.hero-slide-caption`) tiene un padding inferior y lateral estratégico (`pb-24 sm:pb-20`), garantizando que **todas las líneas de texto queden más de +23px por encima del badge flotante**.
- **Cero Cumulative Layout Shift (CLS):** Dimensiones protegidas con `aspect-[4/5] sm:aspect-auto sm:h-[500px] lg:h-[520px]`.
- **Accesibilidad:** Cumple WCAG 2.1 con roles semánticos (`role="region"`, `aria-roledescription="carrusel"`), soporte de teclado (flechas `←` y `→`) y respeto a `prefers-reduced-motion: reduce`.

### Cómo Editar Diapositivas:
En `js/hero-carousel.js`, modifica el arreglo `HERO_SLIDES`:
```javascript
const HERO_SLIDES = [
    {
        image: 'img/hero-1.jpg',
        fallback: 'https://images.unsplash.com/...',
        alt: 'LOYLIZ - Línea Sanitaria & Quirúrgica',
        tag: 'LOYLIZ · COLECCIÓN 2026',
        title: 'Línea Sanitaria & Quirúrgica',
        subtitle: 'Bioseguridad, estética clínica y confort en cada guardia médica.'
    },
    // ... más diapositivas
];
```

---

## 4. Base de Datos & Backend (Supabase / PostgreSQL)

- **Instancia Activa:** `https://coedkmgwbuxskconzbdp.supabase.co`
- **Bucket de Almacenamiento:** `catalogo-loyliz` (Público)

### Esquema Exacto de Tablas:

#### A. `public.categorias`
| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid` (PK) | Identificador único de categoría |
| `slug` | `text` | Identificador amigable (ej: `'sanitaria'`, `'corporativos'`) |
| `nombre` | `text` | Nombre visible de la línea (ej: `'Línea Sanitaria & Quirúrgica'`) |
| `subtitulo` | `text` | Subtítulo descriptivo (ej: `'Bioseguridad & Confort'`) |
| `orden` | `integer` | Posición de ordenamiento (`ORDER BY orden ASC`) |
| `activa` | `boolean` | Estado de visibilidad de la línea |
| `created_at`| `timestamptz` | Fecha de creación del registro |

#### B. `public.productos`
| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid` (PK) | Identificador único del modelo |
| `categoria_id`| `uuid` (FK) | Relación con `categorias.id` |
| `referencia` | `text` | Código oficial (ej: `'LLZ-MED-01'`) |
| `nombre` | `text` | Nombre del modelo textil |
| `descripcion` | `text` | Descripción detallada de confección |
| `tela` | `text` | Composición textil de la prenda |
| `tallas` | `text[]` (Array) | Tallas disponibles (ej: `['XS', 'S', 'M', 'L', 'XL']`) |
| `especificaciones` | `jsonb` | Atributos adicionales empaquetados (`genero`, `colores`, `uso_recomendado` y especificaciones técnicas personalizadas) |
| `destacado` | `boolean` | Indicador de producto destacado |
| `activo` | `boolean` | Control de visibilidad en el catálogo |
| `created_at` | `timestamptz` | Marca de tiempo de registro |

#### C. `public.producto_imagenes`
| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid` (PK) | Identificador de la imagen |
| `producto_id` | `uuid` (FK) | Relación con `productos.id` |
| `url_imagen` | `text` | URL pública absoluta en Supabase Storage |
| `alt_text` | `text` | Texto descriptivo de la vista |
| `es_principal` | `boolean` | Define la fotografía principal de portada |
| `orden` | `integer` | Posición en la galería del producto |
| `created_at` | `timestamptz` | Fecha de carga |

---

## 5. Permisos & Script SQL de Configuración en Supabase

Para que tanto los visitantes (`anon`) como los administradores logueados (`authenticated`) operen sin errores `403 Forbidden (42501 permission denied)` o `404 NoSuchBucket`, debe estar ejecutado el siguiente script en el [SQL Editor de Supabase](https://supabase.com/dashboard/project/coedkmgwbuxskconzbdp/sql/new):

```sql
-- 1. Permisos en Esquema y Tablas
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

GRANT SELECT ON public.categorias TO anon;
GRANT ALL ON public.categorias TO authenticated;

GRANT SELECT ON public.productos TO anon;
GRANT ALL ON public.productos TO authenticated;

GRANT SELECT ON public.producto_imagenes TO anon;
GRANT ALL ON public.producto_imagenes TO authenticated;

-- 2. Habilitar RLS y Políticas
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.producto_imagenes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura publica categorias" ON public.categorias FOR SELECT TO public USING (true);
CREATE POLICY "Gestion total categorias admin" ON public.categorias FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Lectura publica productos" ON public.productos FOR SELECT TO public USING (true);
CREATE POLICY "Gestion total productos admin" ON public.productos FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Lectura publica imagenes" ON public.producto_imagenes FOR SELECT TO public USING (true);
CREATE POLICY "Gestion total imagenes admin" ON public.producto_imagenes FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Crear Bucket Storage y Políticas de Acceso
INSERT INTO storage.buckets (id, name, public)
VALUES ('catalogo-loyliz', 'catalogo-loyliz', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Lectura publica fotos storage" ON storage.objects FOR SELECT TO public USING (bucket_id = 'catalogo-loyliz');
CREATE POLICY "Gestion fotos storage admin" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'catalogo-loyliz') WITH CHECK (bucket_id = 'catalogo-loyliz');
```

---

## 6. Panel Administrativo (`admin.html` / `js/admin.js`)

- **Autenticación:** Supabase Auth vía correo y contraseña.
- **Compresión WebP en Cliente:** Utiliza HTML5 Canvas para reescalar imágenes a máximo 1400px con calidad 82% WebP antes de subirlas al Storage.
- **Guard de Concurrencia:** La bandera `isLoadingDashboard` evita que `initDashboard()` se ejecute dos veces en paralelo al cargar la página o al recibir el evento de sesión de Supabase.
- **Manejo de Sesión Caducada:** Si el token expira (`PGRST301` / `JWT expired`), la función `isSessionExpiredError` cierra la sesión y devuelve al usuario a la pantalla de login con un aviso amigable, evitando paneles rotos.
- **Control de Caché de Navegador:** Se utilizan parámetros de versión (`?v=20261119_02`) en las etiquetas `<script>` y meta tags anti-caché en el `<head>`.

---

## 7. Despliegue en Vivo & Enlaces Oficiales

- **Sitio Web Público (Index):** [https://suyinisturiz.github.io/tienda-textil-catalogo/](https://suyinisturiz.github.io/tienda-textil-catalogo/)
- **Panel Administrativo:** [https://suyinisturiz.github.io/tienda-textil-catalogo/admin.html](https://suyinisturiz.github.io/tienda-textil-catalogo/admin.html)
- **Repositorio GitHub:** [https://github.com/Suyinisturiz/tienda-textil-catalogo](https://github.com/Suyinisturiz/tienda-textil-catalogo)
- **WhatsApp Comercial:** `+58 416-3329389`
- **Ubicación:** Valencia, Edo. Carabobo, Venezuela.
