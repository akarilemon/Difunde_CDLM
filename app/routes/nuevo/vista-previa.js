import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class NuevoVistaPreviaRoute extends Route {
  @service wizard;
  @service router;

  beforeModel() {
    if (!this.wizard.esValidoPaso(2)) {
      this.router.replaceWith('nuevo.datos');
      return;
    }
    if (!this.wizard.esValidoPaso(3)) {
      this.router.replaceWith('nuevo.plantilla');
    }
  }
}
