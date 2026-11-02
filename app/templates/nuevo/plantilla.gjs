import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';
import { LinkTo } from '@ember/routing';
import PasoIndicador from 'difunde-cdlm/components/paso-indicador';
import SelectorPlantilla from 'difunde-cdlm/components/selector-plantilla';

function negar(valor) {
  return !valor;
}

export default class NuevoPlantillaTemplate extends Component {
  @service wizard;
  @service router;

  get pasoValido() {
    return this.wizard.esValidoPaso(3);
  }

  elegirPlantilla = (id) => {
    this.wizard.plantillaId = id;
  };

  irASiguiente = () => {
    if (this.pasoValido) {
      this.router.transitionTo('nuevo.vista-previa');
    }
  };

  <template>
    <div class="paso-vista" data-test-paso-3>
      <PasoIndicador @paso={{3}} />

      <div class="paso-tarjeta">
        <h1 class="paso-titulo">Elige una de las 3 plantillas</h1>
        <p class="paso-instruccion">
          Cada diseño se previsualiza con tus datos reales en tonos morados de la identidad del colectivo.
        </p>

        <SelectorPlantilla
          @plantillas={{@model}}
          @datos={{this.wizard.borrador}}
          @seleccionada={{this.wizard.plantillaId}}
          @onElegir={{this.elegirPlantilla}}
        />

        <div class="paso-navegacion">
          <LinkTo @route="nuevo.datos" class="btn btn-fantasma" data-test-btn-atras>
            ← Atrás
          </LinkTo>
          <button
            type="button"
            class="btn btn-primario"
            disabled={{negar this.pasoValido}}
            data-test-btn-siguiente
            {{on "click" this.irASiguiente}}
          >
            Ver vista previa →
          </button>
        </div>
      </div>
    </div>
  </template>
}
