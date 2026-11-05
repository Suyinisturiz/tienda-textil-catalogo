# LOYLIZ | Diseño, Asesoría & Confección Premium

> Plataforma web interactiva de exhibición y catálogo textil para **LOYLIZ**, orientada al re-branding de alta gama: estilo premium, minimalista y con enfoque en **Asesoría de Imagen**.

---

## 1. Identidad de Marca & Brand Kit

| Elemento | Especificación | HEX / Formato | Aplicación en la Plataforma |
| :--- | :--- | :--- | :--- |
| **Color Principal** | Gris Antracita | `#22252A` (`rgb(34 37 42)`) | Textos, headers, barras de navegación y tarjetas base |
| **Color de Fondo** | Blanco Puro | `#FFFFFF` (`rgb(255 255 255)`) | Estética limpia, fondos de contraste y lectura diáfana |
| **Color de Acento** | Verde Menta Suave | `#84DCC6` (`rgb(132 220 198)`) | Botones de acción, badges, halos y detalles luminosos |
| **Tipografía Display** | 'Montserrat', sans-serif | Pesos Bold (700) y SemiBold (600) | Títulos principales (H1, H2, H3), logotipo y cifras |
| **Tipografía Cuerpo** | 'Open Sans', sans-serif | Peso Regular (400) y Medium (500) | Párrafos, fichas técnicas, viñetas y descripciones |

---

## 2. Arquitectura de Secciones

```
LOYLIZ
├── Top Announcement Bar ("Diseño, Asesoría & Confección Premium | Envíos a toda Venezuela" + Horario + WhatsApp)
├── Header Sticky (Logo LOYLIZ + Navegación + Botón Asesoría WhatsApp)
├── Hero Section (H1: "Tu Estilo Diario, Diseñado con Propósito." + Subtítulo + 3 Viñetas de Valor + Foto Lifestyle)
├── ✦ Cinta Infinita LOYLIZ (Marquee continuo con valores de marca y atributos técnicos)
├── Líneas de Producción (Grid de 6 tarjetas con badges, títulos y descripciones exactas):
│   ├── 1. Línea Sanitaria & Quirúrgica ("Bioseguridad & Confort")
│   ├── 2. Jerseys Deportivos LVBP ("Pasión en Movimiento")
│   ├── 3. Colecciones Temáticas & Casual ("Estilo Único")
│   ├── 4. Franelas & Básicos Premium ("Esenciales del Día a Día")
│   ├── 5. Uniformes Corporativos ("Identidad Empresarial")
│   └── 6. Infantil & Juvenil ("Comodidad para Crecer")
├── ✦ Sección de Contadores / Stats (+1000 Guardias Cómodas, 100% Confección Nacional, +50 Marcas, ∞ Opciones)
├── Catálogo de Exhibición Interactivo (Filtros por línea + Tarjeta Ficha Técnica con modelo REF: LLZ-MED-01)
├── Modal Cinemático de Inspección Técnica (Ficha técnica completa y botón a WhatsApp directo)
├── Estándares de Calidad (Doble Pespunte, Microfibra Antifluido de 4 vías y Asesoría de Imagen)
├── Módulo de Asesoría & Formulario de Cotización
├── Footer Informativo (Valencia, Edo. Carabobo + Horarios + WhatsApp + Créditos)
├── 🎨 Botón Flotante: Selector de Paletas en Vivo (LOYLIZ predeterminado)
└── 💬 Botón Flotante: WhatsApp Directo (+58 416-3329389 con mensaje prellenado)
```

---

## 3. Canales de Contacto Directo

- **WhatsApp Comercial:** `+58 416-3329389`
- **Mensaje Preconfigurado:** *"¡Hola LOYLIZ! Quiero recibir asesoría para renovar mis prendas/uniformes."*
- **Ubicación:** Valencia, Edo. Carabobo | Despachos a nivel nacional.
- **Horario de Atención:** Lunes a Viernes: 8:00 AM - 5:00 PM

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
| **Tipografía** | Google Fonts | *Montserrat* (títulos) y *Open Sans* (cuerpo de lectura) |
| **Versionado** | Git | Control de versiones y sincronización en GitHub |

---

## 5. Instrucciones de Uso y Visualización

1. **Abrir la plantilla:** Haz doble clic en el archivo `index.html` en tu navegador web preferido (Chrome, Edge, Firefox, Safari).
2. **Probar combinaciones de color:** Haz clic en el botón flotante 🎨 **"Paletas de Color"** en la esquina inferior izquierda.
3. **Inspeccionar prendas:** Haz clic en cualquier tarjeta del catálogo o en *"Ver Ficha Técnica"* para abrir el modal de detalles y simular la solicitud de cotización por WhatsApp.
4. **Volver a la versión original en Git (si fuera necesario):**
   ```powershell
   git checkout v1-original-navy-gold
   ```

