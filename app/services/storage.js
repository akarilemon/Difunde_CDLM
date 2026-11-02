import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

const STORAGE_KEY = 'difunde:historial';
const MAX_ELEMENTOS = 10;

export default class StorageService extends Service {
  @tracked version = 0;

  listar() {
    // Lectura de version para permitir reactividad en plantillas si se desea
    void this.version;
    try {
      const crudo = window.localStorage.getItem(STORAGE_KEY);
      if (!crudo) {
        return [];
      }
      const datos = JSON.parse(crudo);
      if (!Array.isArray(datos)) {
        window.localStorage.removeItem(STORAGE_KEY);
        return [];
      }
      return datos
        .filter((item) => item && typeof item.id === 'string')
        .sort((a, b) => (b.creadoEn || 0) - (a.creadoEn || 0));
    } catch {
      // Si el JSON está corrupto o localStorage está bloqueado, descartar y devolver []
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignorar si el almacenamiento está bloqueado
      }
      return [];
    }
  }

  guardar(diseno) {
    if (!diseno) return null;

    const nuevoDiseno = {
      ...diseno,
      id: diseno.id || this.#generarId(),
      creadoEn: diseno.creadoEn || Date.now(),
    };

    let lista = this.listar().filter((item) => item.id !== nuevoDiseno.id);
    lista.unshift(nuevoDiseno);
    lista = lista.slice(0, MAX_ELEMENTOS);

    this.#escribirConReintento(lista);
    this.version++;
    return nuevoDiseno;
  }

  obtener(id) {
    if (!id) return null;
    const lista = this.listar();
    return lista.find((item) => item.id === id) || null;
  }

  eliminar(id) {
    if (!id) return false;
    const lista = this.listar();
    const filtrada = lista.filter((item) => item.id !== id);
    this.#escribirConReintento(filtrada);
    this.version++;
    return filtrada.length !== lista.length;
  }

  #escribirConReintento(lista) {
    const copia = [...lista];
    while (copia.length > 0) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(copia));
        return true;
      } catch (error) {
        const esCuota =
          error &&
          (error.name === 'QuotaExceededError' ||
            error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
            error.code === 22 ||
            error.code === 1014);
        if (esCuota && copia.length > 1) {
          // Eliminar el más antiguo y reintentar (Diagrama 5)
          copia.pop();
        } else {
          return false;
        }
      }
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return true;
    } catch {
      return false;
    }
  }

  #generarId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `cdlm-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
