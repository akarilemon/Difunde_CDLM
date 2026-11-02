import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

const TIPOS_VALIDOS = ['evento', 'aviso', 'invitacion'];
const PLANTILLAS_VALIDAS = ['flor', 'barro', 'verde'];
const REGEX_FECHA_ISO = /^\d{4}-\d{2}-\d{2}$/;
const REGEX_HORA = /^([01]\d|2[0-3]):([0-5]\d)$/;

export default class WizardService extends Service {
  @tracked id = null;
  @tracked tipo = '';
  @tracked titulo = '';
  @tracked fecha = '';
  @tracked hora = '';
  @tracked lugar = '';
  @tracked descripcion = '';
  @tracked plantillaId = 'flor';

  get errorTipo() {
    if (!TIPOS_VALIDOS.includes(this.tipo)) {
      return 'Elige qué vas a anunciar';
    }
    return null;
  }

  get errorTitulo() {
    const limpio = (this.titulo || '').trim();
    if (!limpio || limpio.length > 60) {
      return 'Escribe un título';
    }
    return null;
  }

  get errorFecha() {
    const valor = (this.fecha || '').trim();
    if (!valor || !REGEX_FECHA_ISO.test(valor)) {
      return 'Elige una fecha';
    }
    const [anio, mes, dia] = valor.split('-').map(Number);
    const fechaObj = new Date(Date.UTC(anio, mes - 1, dia));
    const esValida =
      !Number.isNaN(fechaObj.getTime()) &&
      fechaObj.getUTCFullYear() === anio &&
      fechaObj.getUTCMonth() === mes - 1 &&
      fechaObj.getUTCDate() === dia;

    if (!esValida) {
      return 'Elige una fecha';
    }
    return null;
  }

  get errorLugar() {
    const limpio = (this.lugar || '').trim();
    if (!limpio || limpio.length > 80) {
      return 'Escribe el lugar';
    }
    return null;
  }

  get errorHora() {
    const valor = (this.hora || '').trim();
    if (!valor) {
      return null;
    }
    if (!REGEX_HORA.test(valor)) {
      return 'Formato de hora inválido (HH:mm)';
    }
    return null;
  }

  get errorDescripcion() {
    const valor = this.descripcion || '';
    if (valor.length > 200) {
      return 'Máximo 200 caracteres';
    }
    return null;
  }

  get errores() {
    return {
      tipo: this.errorTipo,
      titulo: this.errorTitulo,
      fecha: this.errorFecha,
      lugar: this.errorLugar,
      hora: this.errorHora,
      descripcion: this.errorDescripcion,
    };
  }

  esValidoPaso(n) {
    if (n === 1) {
      return !this.errorTipo;
    }
    if (n === 2) {
      return (
        this.esValidoPaso(1) &&
        !this.errorTitulo &&
        !this.errorFecha &&
        !this.errorLugar &&
        !this.errorHora &&
        !this.errorDescripcion
      );
    }
    if (n === 3) {
      return (
        this.esValidoPaso(2) && PLANTILLAS_VALIDAS.includes(this.plantillaId)
      );
    }
    if (n === 4) {
      return this.esValidoPaso(3);
    }
    return false;
  }

  get borrador() {
    return {
      id: this.id,
      tipo: this.tipo,
      titulo: (this.titulo || '').trim(),
      fecha: (this.fecha || '').trim(),
      hora: (this.hora || '').trim(),
      lugar: (this.lugar || '').trim(),
      descripcion: (this.descripcion || '').trim(),
      plantillaId: this.plantillaId || 'flor',
    };
  }

  reiniciar() {
    this.id = null;
    this.tipo = '';
    this.titulo = '';
    this.fecha = '';
    this.hora = '';
    this.lugar = '';
    this.descripcion = '';
    this.plantillaId = 'flor';
  }

  cargar(diseno) {
    if (!diseno) return;
    this.id = diseno.id || null;
    this.tipo = diseno.tipo || '';
    this.titulo = diseno.titulo || '';
    this.fecha = diseno.fecha || '';
    this.hora = diseno.hora || '';
    this.lugar = diseno.lugar || '';
    this.descripcion = diseno.descripcion || '';
    this.plantillaId = PLANTILLAS_VALIDAS.includes(diseno.plantillaId)
      ? diseno.plantillaId
      : 'flor';
  }
}
