import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { PLANTILLAS } from 'difunde-cdlm/data/plantillas';

export default class NuevoPlantillaRoute extends Route {
  @service wizard;
  @service router;

  beforeModel() {
    // Diagrama 2: Si los pasos anteriores no están completos, redirigir a /nuevo/datos
    if (!this.wizard.esValidoPaso(2)) {
      this.router.replaceWith('nuevo.datos');
    }
  }

  model() {
    return PLANTILLAS;
  }
}
