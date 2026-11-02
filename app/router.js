import EmberRouter from '@embroider/router';
import config from 'difunde-cdlm/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('nuevo', function () {
    this.route('tipo');
    this.route('datos');
    this.route('plantilla');
    this.route('vista-previa');
  });
  this.route('compartir', { path: '/compartir/:id' });
});
