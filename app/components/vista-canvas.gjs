import Component from '@glimmer/component';
import { service } from '@ember/service';
import { modifier } from 'ember-modifier';

export default class VistaCanvasComponent extends Component {
  @service renderer;

  renderizarEnCanvas = modifier((elemento, [diseno]) => {
    // Lectura de las propiedades para suscribirse a cambios reactivos
    const datos = {
      tipo: diseno?.tipo,
      titulo: diseno?.titulo,
      fecha: diseno?.fecha,
      hora: diseno?.hora,
      lugar: diseno?.lugar,
      descripcion: diseno?.descripcion,
      plantillaId: diseno?.plantillaId,
    };
    this.renderer.dibujarEnCanvas(elemento, datos);
  });

  get textoAlternativo() {
    const titulo = this.args.diseno?.titulo || 'Anuncio';
    return `Vista previa del diseño: ${titulo}`;
  }

  <template>
    <div class="vista-canvas-contenedor" data-test-vista-canvas>
      <canvas
        class="vista-canvas-lienzo"
        aria-label={{this.textoAlternativo}}
        {{this.renderizarEnCanvas @diseno}}
      ></canvas>
    </div>
  </template>
}
