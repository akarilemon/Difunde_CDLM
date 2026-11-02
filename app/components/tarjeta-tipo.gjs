import Component from '@glimmer/component';
import { on } from '@ember/modifier';

export default class TarjetaTipoComponent extends Component {
  seleccionar = () => {
    if (typeof this.args.onSeleccionar === 'function') {
      this.args.onSeleccionar(this.args.tipo);
    }
  };

  get claseTarjeta() {
    return this.args.seleccionado
      ? 'tarjeta-tipo seleccionada'
      : 'tarjeta-tipo';
  }

  <template>
    <button
      type="button"
      class={{this.claseTarjeta}}
      aria-pressed={{if @seleccionado "true" "false"}}
      data-test-tarjeta-tipo={{@tipo}}
      {{on "click" this.seleccionar}}
    >
      <span class="tarjeta-tipo-icono" aria-hidden="true">{{@icono}}</span>
      <span class="tarjeta-tipo-contenido">
        <span class="tarjeta-tipo-titulo">{{@nombre}}</span>
        <span class="tarjeta-tipo-descripcion">{{@descripcion}}</span>
      </span>
      <span class="tarjeta-tipo-check" aria-hidden="true">
        {{if @seleccionado "✓" "→"}}
      </span>
    </button>
  </template>
}
