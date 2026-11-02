import Service, { service } from '@ember/service';

export default class ShareService extends Service {
  @service renderer;

  /**
   * Comparte el diseño usando la Web Share API o descarga el archivo como respaldo (Diagrama 4).
   */
  async compartir(diseno) {
    const blob = await this.renderer.renderizarBlob(diseno);
    const file = new File([blob], 'difunde.png', { type: 'image/png' });
    const title = diseno?.titulo || 'Difunde CDLM';

    const puedeCompartirArchivos =
      typeof navigator !== 'undefined' &&
      typeof navigator.canShare === 'function' &&
      typeof navigator.share === 'function' &&
      this.#verificarCanShare(file);

    if (puedeCompartirArchivos) {
      try {
        await navigator.share({
          files: [file],
          title,
          text: `${title} — Colectivo Casa de la Mujer`,
        });
        return { metodo: 'share', exito: true, cancelado: false };
      } catch (error) {
        if (error && error.name === 'AbortError') {
          // Tratado como cancelación normal y no como falla (Diagrama 4)
          return { metodo: 'share', exito: false, cancelado: true };
        }
        // Si falló por otra razón, usar respaldo de descarga
        this.descargarBlob(blob, 'difunde.png');
        return { metodo: 'download', exito: true, cancelado: false };
      }
    }

    this.descargarBlob(blob, 'difunde.png');
    return { metodo: 'download', exito: true, cancelado: false };
  }

  /**
   * Descarga directamente el diseño como PNG.
   */
  async descargar(diseno) {
    const blob = await this.renderer.renderizarBlob(diseno);
    this.descargarBlob(blob, 'difunde.png');
    return { metodo: 'download', exito: true, cancelado: false };
  }

  descargarBlob(blob, nombreArchivo = 'difunde.png') {
    const url = URL.createObjectURL(blob);
    try {
      const enlace = document.createElement('a');
      enlace.href = url;
      enlace.download = nombreArchivo;
      enlace.style.display = 'none';
      document.body.appendChild(enlace);
      enlace.click();
      document.body.removeChild(enlace);
    } finally {
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 200);
    }
  }

  #verificarCanShare(file) {
    try {
      return Boolean(navigator.canShare({ files: [file] }));
    } catch {
      return false;
    }
  }
}
