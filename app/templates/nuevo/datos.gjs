import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';
import { LinkTo } from '@ember/routing';
import PasoIndicador from 'difunde-cdlm/components/paso-indicador';
import FormularioDatos from 'difunde-cdlm/components/formulario-datos';

function negar(valor) {
  return !valor;
}

export default class NuevoDatosTemplate extends Component {
  @service wizard;
  @service router;

  get pasoValido() {
    return this.wizard.esValidoPaso(2);
  }

  irASiguiente = () => {
    if (this.pasoValido) {
      this.router.transitionTo('nuevo.plantilla');
    }
  };

  <template>
    <div class="paso-vista" data-test-paso-2>
      <PasoIndicador @paso={{2}} />

      <div class="paso-tarjeta">
        <h1 class="paso-titulo">Captura los datos del aviso</h1>
        <p class="paso-instruccion">
          Completa los campos obligatorios (<span class="obligatorio">*</span>) para activar el botón Siguiente.
        </p>

        <FormularioDatos @borrador={{this.wizard.borrador}} />

        <div class="paso-navegacion">
          <LinkTo @route="nuevo.tipo" class="btn btn-fantasma" data-test-btn-atras>
            ← Atrás
          </LinkTo>
          <button
            type="button"
            class="btn btn-primario"
            disabled={{negar this.pasoValido}}
            data-test-btn-siguiente
            {{on "click" this.irASiguiente}}
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  </template>
}
