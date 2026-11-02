import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import VistaCanvas from 'difunde-cdlm/components/vista-canvas';

export default class SelectorPlantillaComponent extends Component {
  get plantillasConDatos() {
    const lista = this.args.plantillas || [];
    const datosBase = this.args.datos || {};
    const seleccionada = this.args.seleccionada || datosBase.plantillaId || 'flor';

    return lista.map((plantilla) => ({
      ...plantilla,
      activa: plantilla.id === seleccionada,
      claseOpcion:
        plantilla.id === seleccionada
          ? 'plantilla-opcion activa'
          : 'plantilla-opcion',
      disenoMuestra: {
        ...datosBase,
        plantillaId: plantilla.id,
      },
    }));
  }

  elegir = (id) => {
    if (typeof this.args.onElegir === 'function') {
      this.args.onElegir(id);
    }
  };

  <template>
    <div class="selector-plantilla" role="radiogroup" aria-label="Selecciona una plantilla" data-test-selector-plantilla>
      {{#each this.plantillasConDatos as |item|}}
        <button
          type="button"
          class={{item.claseOpcion}}
          role="radio"
          aria-checked={{if item.activa "true" "false"}}
          data-test-plantilla-opcion={{item.id}}
          {{on "click" (fn this.elegir item.id)}}
        >
          <div class="plantilla-miniatura">
            <VistaCanvas @diseno={{item.disenoMuestra}} />
          </div>
          <div class="plantilla-info">
            <div class="plantilla-cabecera">
              <span class="plantilla-nombre">{{item.nombre}}</span>
              <span class="plantilla-estado">
                {{if item.activa "Seleccionada ✓" "Elegir"}}
              </span>
            </div>
            <p class="plantilla-descripcion">{{item.descripcion}}</p>
          </div>
        </button>
      {{/each}}
    </div>
  </template>
}
