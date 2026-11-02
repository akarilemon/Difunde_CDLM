import Component from '@glimmer/component';
import { service } from '@ember/service';
import { LinkTo } from '@ember/routing';
import PasoIndicador from 'difunde-cdlm/components/paso-indicador';
import VistaCanvas from 'difunde-cdlm/components/vista-canvas';
import BotonCompartir from 'difunde-cdlm/components/boton-compartir';

export default class NuevoVistaPreviaTemplate extends Component {
  @service wizard;

  alGuardarEnHistorial = (guardado) => {
    if (guardado && guardado.id) {
      this.wizard.id = guardado.id;
    }
  };

  <template>
    <div class="paso-vista" data-test-paso-4>
      <PasoIndicador @paso={{4}} />

      <div class="paso-tarjeta">
        <h1 class="paso-titulo">Vista previa de tu diseño</h1>
        <p class="paso-instruccion">
          Revisa que toda la información sea correcta antes de compartir o descargar la imagen.
        </p>

        <div class="vista-previa-marco">
          <VistaCanvas @diseno={{this.wizard.borrador}} />
        </div>

        <BotonCompartir
          @diseno={{this.wizard.borrador}}
          @onCompartido={{this.alGuardarEnHistorial}}
        />

        <div class="paso-navegacion secundario">
          <LinkTo
            @route="nuevo.datos"
            class="btn btn-fantasma"
            data-test-btn-corregir-datos
          >
            ✏️ Corregir datos
          </LinkTo>
          <LinkTo
            @route="nuevo.plantilla"
            class="btn btn-fantasma"
            data-test-btn-cambiar-plantilla
          >
            🎨 Cambiar plantilla
          </LinkTo>
        </div>
      </div>
    </div>
  </template>
}
