import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

const NOMBRES_TIPO = {
  evento: 'Evento',
  aviso: 'Aviso',
  invitacion: 'Invitación',
};

export default class ListaHistorialComponent extends Component {
  @service renderer;

  get tieneDisenos() {
    return Array.isArray(this.args.disenos) && this.args.disenos.length > 0;
  }

  get elementosDecorados() {
    return (this.args.disenos || []).map((diseno) => ({
      ...diseno,
      etiquetaTipo: NOMBRES_TIPO[diseno.tipo] || 'Diseño',
      fechaLegible: this.renderer.formatearFechaEspanol(diseno.fecha),
    }));
  }

  abrir = (id) => {
    if (typeof this.args.onAbrir === 'function') {
      this.args.onAbrir(id);
    }
  };

  eliminar = (id, evento) => {
    evento.stopPropagation();
    if (typeof this.args.onEliminar === 'function') {
      this.args.onEliminar(id);
    }
  };

  <template>
    <section class="historial-seccion" aria-labelledby="titulo-historial" data-test-lista-historial>
      <div class="historial-cabecera">
        <h2 id="titulo-historial" class="seccion-titulo">Tus diseños recientes</h2>
        {{#if this.tieneDisenos}}
          <span class="historial-contador">
            {{this.elementosDecorados.length}} de 10 guardados
          </span>
        {{/if}}
      </div>

      {{#if this.tieneDisenos}}
        <ul class="historial-cuadricula" role="list">
          {{#each this.elementosDecorados as |item|}}
            <li class="historial-item" data-test-historial-item={{item.id}}>
              <button
                type="button"
                class="historial-tarjeta"
                data-test-abrir-diseno={{item.id}}
                {{on "click" (fn this.abrir item.id)}}
              >
                <div class="historial-miniatura-marco">
                  {{#if item.miniatura}}
                    <img
                      src={{item.miniatura}}
                      alt="Miniatura de {{item.titulo}}"
                      class="historial-miniatura-img"
                      loading="lazy"
                    />
                  {{else}}
                    <div class="historial-miniatura-respaldo">💜</div>
                  {{/if}}
                </div>
                <div class="historial-detalles">
                  <span class="historial-etiqueta">{{item.etiquetaTipo}}</span>
                  <h3 class="historial-titulo">{{item.titulo}}</h3>
                  <p class="historial-meta">
                    📅 {{item.fechaLegible}}
                    {{#if item.hora}} · {{item.hora}}{{/if}}
                  </p>
                  <p class="historial-lugar">📍 {{item.lugar}}</p>
                </div>
              </button>
              {{#if @onEliminar}}
                <button
                  type="button"
                  class="historial-btn-eliminar"
                  title="Eliminar del historial"
                  aria-label="Eliminar {{item.titulo}} del historial"
                  data-test-eliminar-diseno={{item.id}}
                  {{on "click" (fn this.eliminar item.id)}}
                >
                  ✕
                </button>
              {{/if}}
            </li>
          {{/each}}
        </ul>
      {{else}}
        <div class="historial-vacio" data-test-historial-vacio>
          <span class="historial-vacio-icono" aria-hidden="true">🎨</span>
          <p class="historial-vacio-titulo">Aún no tienes diseños guardados</p>
          <p class="historial-vacio-texto">
            Cuando compartas o descargues un aviso, aparecerá aquí para que puedas volver a compartirlo o editarlo sin conexión.
          </p>
        </div>
      {{/if}}
    </section>
  </template>
}
