import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class NuevoRoute extends Route {
  @service router;

  beforeModel(transition) {
    if (transition.to.name === 'nuevo.index') {
      this.router.replaceWith('nuevo.tipo');
    }
  }
}
