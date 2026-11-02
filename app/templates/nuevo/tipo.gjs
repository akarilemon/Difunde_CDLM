import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';
import { LinkTo } from '@ember/routing';
import PasoIndicador from 'difunde-cdlm/components/paso-indicador';
import TarjetaTipo from 'difunde-cdlm/components/tarjeta-tipo';

function esIgual(a, b) {
  return a === b;
}

function negar(valor) {
  return !valor;
}

export default class NuevoTipoTemplate extends Component {
  @service wizard;
  @service router;

  get pasoValido() {
    return this.wizard.esValidoPaso(1);
  }

  seleccionarTipo = (tipo) => {
    this.wizard.tipo = tipo;
  };

  irASiguiente = () => {
    if (this.pasoValido) {
      this.router.transitionTo('nuevo.datos');
    }
  };

  <template>
    <div class="paso-vista" data-test-paso-1>
      <PasoIndicador @paso={{1}} />

      <div class="paso-tarjeta">
        <h1 class="paso-titulo">¿Qué vas a anunciar hoy?</h1>
        <p class="paso-instruccion">
          Selecciona el tipo de pieza para adaptar el encabezado de tu diseño.
        </p>

        <div class="tarjetas-tipo-lista">
          {{#each @model as |opcion|}}
            <TarjetaTipo
              @tipo={{opcion.id}}
              @nombre={{opcion.nombre}}
              @descripcion={{opcion.descripcion}}
              @icono={{opcion.icono}}
              @seleccionado={{esIgual this.wizard.tipo opcion.id}}
              @onSeleccionar={{this.seleccionarTipo}}
            />
          {{/each}}
        </div>

        {{#if this.wizard.errorTipo}}
          <p class="campo-error centrado" role="status" data-test-error-tipo>
            {{this.wizard.errorTipo}}
          </p>
        {{/if}}

        <div class="paso-navegacion">
          <LinkTo @route="index" class="btn btn-fantasma" data-test-btn-cancelar>
            ← Inicio
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
