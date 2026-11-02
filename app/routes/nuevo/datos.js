import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class NuevoDatosRoute extends Route {
  @service wizard;
  @service router;

  beforeModel() {
    if (!this.wizard.esValidoPaso(1)) {
      this.router.replaceWith('nuevo.tipo');
    }
  }
}
