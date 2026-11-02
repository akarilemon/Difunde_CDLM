import Component from '@glimmer/component';

const PASOS = [
  { numero: 1, etiqueta: 'Tipo de pieza' },
  { numero: 2, etiqueta: 'Datos del aviso' },
  { numero: 3, etiqueta: 'Plantilla' },
  { numero: 4, etiqueta: 'Vista previa' },
];

export default class PasoIndicadorComponent extends Component {
  get pasoActual() {
    return Number(this.args.paso) || 1;
  }

  get nombrePasoActual() {
    const encontrado = PASOS.find((p) => p.numero === this.pasoActual);
    return encontrado ? encontrado.etiqueta : '';
  }

  get listaPasos() {
    return PASOS.map((p) => ({
      ...p,
      activo: p.numero === this.pasoActual,
      completado: p.numero < this.pasoActual,
      claseEstado:
        p.numero === this.pasoActual
          ? 'paso-punto activo'
          : p.numero < this.pasoActual
            ? 'paso-punto completado'
            : 'paso-punto',
    }));
  }

  <template>
    <nav class="paso-indicador" aria-label="Progreso del asistente" data-test-paso-indicador>
      <div class="paso-indicador-encabezado">
        <span class="paso-contador" data-test-paso-texto>
          Paso {{this.pasoActual}} de 4
        </span>
        <span class="paso-nombre">{{this.nombrePasoActual}}</span>
      </div>
      <ol class="paso-puntos" role="list">
        {{#each this.listaPasos as |item|}}
          <li
            class={{item.claseEstado}}
            aria-current={{if item.activo "step"}}
            data-test-punto={{item.numero}}
          >
            <span class="paso-circulo">{{item.numero}}</span>
            <span class="paso-etiqueta-corta">{{item.etiqueta}}</span>
          </li>
        {{/each}}
      </ol>
    </nav>
  </template>
}
