# TEXTIL MODA | Catálogo & Showroom Digital de Confección

> Plataforma web interactiva de exhibición textil y confección de alto impacto, diseñada para fabricantes, marcas de ropa, dotaciones corporativas e instituciones.

---

## 1. Idea Fundamental & Propósito del Proyecto

A diferencia de una tienda de comercio electrónico tradicional orientada a la venta minorista con precios fijos y carritos de compra genéricos, **TEXTIL MODA** está concebida como un **Showroom Digital Técnico de Exhibición y Confección por Lotes**.

### Principios Fundamentales:
1. **Enfoque B2B y Pedidos por Lote:**
   - La plataforma no muestra precios unitarios estáticos porque los costos de confección textil dependen del **volumen**, el **gramaje de la tela**, el **tipo de teñido**, el **corte** y la **personalización** (bordados, serigrafía, transfer, etiquetas).
2. **Jerarquía en la Ficha Técnica de los Tejidos:**
   - Cada producto exhibido destaca su composición exacta (ej. *Jersey 100% Algodón Peinado 24/1*, *Gabardina Pesada*, *Microfibra Antifuido Quirúrgica*), sus usos recomendados, tallas disponibles y gama de coloración.
3. **Conversión Rápida a Asesoría Comercial:**
   - Cada prenda integra un disparador directo al canal de atención vía WhatsApp con el código de referencia preconfigurado (`REF: SAN-104`, `REF: BAS-015`, etc.), agilizando la solicitud de cotizaciones y muestras físicas.
4. **Distinción Visual & Flexibilidad de Marca:**
   - Permite al confeccionista vestir toda la plataforma con la identidad corporativa de su propio taller o la de clientes específicos mediante un motor dinámico de paletas en vivo.

---

## 2. Arquitectura de Secciones y Contenido

```
TEXTIL MODA
├── Top Announcement Bar (Línea de contacto, showroom y asesoría comercial)
├── Header Sticky con Navegación y Menú Responsive
├── Hero Section (Título display, galería editorial de bienvenida y accesos rápidos)
├── ✦ Cinta Infinita de Fibras & Tejidos (Marquee con loop continuo de materiales)
├── Líneas de Producción / Rubros (6 sectores principales de confección)
│   ├── Ropa Cotidiana & Casual
│   ├── Moda Urbana & Streetwear
│   ├── Franelas & Básicos (Algodón 20/1 y 24/1)
│   ├── Uniformes Escolares (Piqué y Gabardinas)
│   ├── Línea Sanitaria & Quirúrgica (Antifluido)
│   └── Infantil & Juvenil
├── ✦ Barra de Métricas y Estándares de Producción (Contadores animados con Count-Up)
├── Catálogo de Exhibición Interactivo (Filtros en tiempo real + Grid de prendas)
├── Modal Cinemático de Inspección Técnica (Ficha técnica completa y botón a WhatsApp)
├── Lookbook & Control de Calidad (Fotografías de taller, acabados y tejidos macro)
├── Módulo de Asesoría & Formulario de Cotización
├── Footer Informativo y Créditos Técnicos
├── 🎨 Botón Flotante: Selector de Paletas de Color en Vivo
└── 💬 Botón Flotante: WhatsApp Directo con Halo Pulsante
```

---

## 3. Módulos y Tecnologías Clave

### A. Sistema Dinámico de Paletas (Theme Switcher)
- **Archivo:** `js/theme-switcher.js`
- **Concepto:** Las clases de Tailwind CSS están vinculadas a variables CSS Custom Properties (`--color-navy`, `--color-gold`, etc.) en lugar de códigos hexadecimales rígidos.
- **Capacidades:**
  - **Paletas Curadas:** Incluye la paleta original en Azul Marino y Oro, las dos variantes solicitadas por el cliente (*Midnight Navy & Champagne* y *Midnight & Oro Bronce*), así como opciones sastre, alta costura, industrial y boutique.
  - **Personalizador Libre:** Dispone de dos selectores de color nativos HTML5 para experimentar con cualquier color primario y secundario en tiempo real.
  - **Persistencia:** Guarda la elección en `localStorage` para recordar la selección al recargar.
  - **Exportación:** Permite copiar al portapapeles los códigos CSS y HEX generados con un solo clic.

### B. Sistema de Animaciones & Dinamismo Táctil
- **Archivos:** `css/styles.css` y `js/main.js`
- **Características:**
  1. **Textile Infinite Marquee:** Cinta continua de tejidos con efecto de bordes degradados y pausa suave al posar el cursor (*pause on hover*).
  2. **Scroll Reveal Progresivo:** Observador nativo (`IntersectionObserver`) que desplaza y desvanece las tarjetas con retardos escalonados (*staggered delay*).
  3. **Contadores Numéricos Dinámicos:** Animación de cifras de trayectoria y producción desde `0` hasta el objetivo mediante curvas matemáticas `easeOutExpo`.
  4. **Micro-interacción 3D Tilt:** Las tarjetas de las prendas calculan las coordenadas del cursor y se inclinan sutilmente en perspectiva tridimensional (hasta 5°).
  5. **Destello Sedoso (*Silk Shimmer*):** Haz de luz que recorre periódicamente los botones principales simulando el brillo de la seda.
  6. **Halo Pulsante (*Pulse Glow*):** Ondas de luz suaves en el color de acento alrededor de los botones flotantes de acción.

### C. Estrategia de Versionado y Control de Cambios (Git)
- Repositorio Git inicializado localmente.
- **Etiqueta Permanente de Seguridad:** `v1-original-navy-gold` (permite restaurar la versión base en cualquier momento).
- Commits semánticos que documentan la adición del selector de paletas, la paleta del cliente y las animaciones interactivas.

---

## 4. Stack Técnico

| Área | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Estructura** | HTML5 Semántico | Maquetación limpia, accesible y optimizada para SEO |
| **Estilos** | Tailwind CSS (CDN) | Framework de utilidades para layout y diseño responsivo |
| **Estilos Personalizados** | CSS3 Moderno (`css/styles.css`) | Variables CSS dinámicas, keyframes de animación y micro-interacciones |
| **Lógica & Estado** | JavaScript ES6+ (`js/main.js`) | Filtrado de catálogo, modal de ficha técnica, contadores y tilt 3D |
| **Gestión de Temas** | JavaScript ES6+ (`js/theme-switcher.js`) | Motor de cálculo de contrastes, paletas y persistencia local |
| **Iconografía** | Lucide Icons (CDN) | Iconos vectoriales ligeros de alta legibilidad |
| **Tipografía** | Google Fonts | *Outfit* (títulos display) y *Plus Jakarta Sans* (lectura de fichas) |
| **Versionado** | Git | Control de versiones, ramas y puntos de restauración |

---

## 5. Instrucciones de Uso y Visualización

1. **Abrir la plantilla:** Haz doble clic en el archivo `index.html` en tu navegador web preferido (Chrome, Edge, Firefox, Safari).
2. **Probar combinaciones de color:** Haz clic en el botón flotante 🎨 **"Paletas de Color"** en la esquina inferior izquierda.
3. **Inspeccionar prendas:** Haz clic en cualquier tarjeta del catálogo o en *"Ver Ficha Técnica"* para abrir el modal de detalles y simular la solicitud de cotización por WhatsApp.
4. **Volver a la versión original en Git (si fuera necesario):**
   ```powershell
   git checkout v1-original-navy-gold
   ```
