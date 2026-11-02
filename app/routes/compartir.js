import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CompartirRoute extends Route {
  @service storage;
  @service router;

  model(params) {
    const diseno = this.storage.obtener(params.id);
    if (!diseno) {
      this.router.replaceWith('index');
      return null;
    }
    return diseno;
  }
}
