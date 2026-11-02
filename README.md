# Difunde CDLM 💜

Aplicación web progresiva de una sola página (SPA) construida con **EmberJS (Octane)** para las integrantes del **Colectivo Casa de la Mujer**. Permite crear banners y flyers a partir de un asistente guiado de 4 pasos y compartirlos directamente desde el celular sin requerir servidor ni base de datos externa.

## Arquitectura por capas

1. **Presentación (`app/templates/`, `app/components/`, `app/styles/app.css`)**:
   - Componentes Glimmer (`.gjs`) y estilos con paleta de colores a partir del morado (`--morado-950` a `--morado-50`, amatista, ciruela y lavanda).
2. **Navegación y control (`app/router.js`, `app/routes/`)**:
   - Rutas anidadas del asistente (`/nuevo/tipo`, `/nuevo/datos`, `/nuevo/plantilla`, `/nuevo/vista-previa`), inicio con historial (`/`) y vista de recompartir (`/compartir/:id`) con guardas de ruta (`beforeModel()`).
3. **Servicios de dominio (`app/services/`)**:
   - `wizard.js`: Estado `@tracked` del borrador, validación por campo y por paso (`esValidoPaso(n)`), `reiniciar()` y `cargar(diseno)`.
   - `renderer.js`: Dibujo declarativo en `Canvas API` (`1080 × 1350`), ajuste automático de renglones y tamaño de fuente con `ctx.measureText()`, exportación a `Blob` PNG y generación de miniaturas JPEG de `240 px`.
   - `share.js`: Integración con `Web Share API` (`navigator.canShare` / `navigator.share`), manejo de `AbortError` como cancelación normal y respaldo de descarga directa (`<a download>`).
   - `storage.js`: Persistencia en `localStorage` bajo la clave `difunde:historial` (máximo 10 diseños), manejo de JSON corrupto y recuperación ante `QuotaExceededError`.
4. **Datos declarativos (`app/data/plantillas.js`)**:
   - Plantillas `'flor'`, `'barro'` y `'verde'` definidas declarativamente en gama morada.

## Comandos principales

```bash
# Iniciar servidor de desarrollo
npm start

# Compilar versión estática de producción en dist/
npm run build

# Ejecutar pruebas automatizadas
npm test
```
