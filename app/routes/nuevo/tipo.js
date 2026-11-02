import Route from '@ember/routing/route';
import { TIPOS_PIEZA } from 'difunde-cdlm/data/plantillas';

export default class NuevoTipoRoute extends Route {
  model() {
    return TIPOS_PIEZA;
  }
}
