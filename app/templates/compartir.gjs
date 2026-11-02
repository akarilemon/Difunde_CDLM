import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';
import { LinkTo } from '@ember/routing';
import VistaCanvas from 'difunde-cdlm/components/vista-canvas';
import BotonCompartir from 'difunde-cdlm/components/boton-compartir';

export default class CompartirTemplate extends Component {
  @service wizard;
  @service router;

  reeditarDiseno = () => {
    this.wizard.cargar(this.args.model);
    this.router.transitionTo('nuevo.datos');
  };

  <template>
    <div class="paso-vista" data-test-vista-compartir>
      <div class="paso-tarjeta">
        <div class="compartir-encabezado">
          <span class="hero-insignia">Diseño guardado en tu historial</span>
          <h1 class="paso-titulo">{{@model.titulo}}</h1>
          <p class="paso-instruccion">
            Imagen regenerada lista para volver a compartir o descargar en alta resolución.
          </p>
        </div>

        <div class="vista-previa-marco">
          <VistaCanvas @diseno={{@model}} />
        </div>

        <BotonCompartir @diseno={{@model}} />

        <div class="paso-navegacion secundario">
          <LinkTo @route="index" class="btn btn-fantasma" data-test-btn-volver-inicio>
            ← Volver a tus diseños
          </LinkTo>
          <button
            type="button"
            class="btn btn-fantasma"
            data-test-btn-reeditar
            {{on "click" this.reeditarDiseno}}
          >
            ✏️ Editar en el asistente
          </button>
        </div>
      </div>
    </div>
  </template>
}
