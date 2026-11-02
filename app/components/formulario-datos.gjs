import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';

export default class FormularioDatosComponent extends Component {
  @service wizard;

  @tracked tocadoTitulo = false;
  @tracked tocadoFecha = false;
  @tracked tocadoLugar = false;
  @tracked tocadoHora = false;
  @tracked tocadoDescripcion = false;

  get longitudTitulo() {
    return (this.wizard.titulo || '').length;
  }

  get longitudLugar() {
    return (this.wizard.lugar || '').length;
  }

  get longitudDescripcion() {
    return (this.wizard.descripcion || '').length;
  }

  actualizarTitulo = (evento) => {
    this.tocadoTitulo = true;
    this.wizard.titulo = evento.target.value;
  };

  actualizarFecha = (evento) => {
    this.tocadoFecha = true;
    this.wizard.fecha = evento.target.value;
  };

  actualizarHora = (evento) => {
    this.tocadoHora = true;
    this.wizard.hora = evento.target.value;
  };

  actualizarLugar = (evento) => {
    this.tocadoLugar = true;
    this.wizard.lugar = evento.target.value;
  };

  actualizarDescripcion = (evento) => {
    this.tocadoDescripcion = true;
    this.wizard.descripcion = evento.target.value;
  };

  marcarTituloTocado = () => {
    this.tocadoTitulo = true;
  };

  marcarFechaTocada = () => {
    this.tocadoFecha = true;
  };

  marcarLugarTocado = () => {
    this.tocadoLugar = true;
  };

  <template>
    <div class="formulario-datos" data-test-formulario-datos>
      <div class="campo-grupo">
        <div class="campo-cabecera">
          <label for="input-titulo" class="campo-etiqueta">
            Título principal <span class="obligatorio">*</span>
          </label>
          <span class="campo-contador">{{this.longitudTitulo}}/60</span>
        </div>
        <input
          id="input-titulo"
          type="text"
          maxlength="60"
          class="campo-input {{if this.wizard.errorTitulo 'con-error'}}"
          placeholder="Ej. Taller de defensa personal y autocuidado"
          value={{this.wizard.titulo}}
          data-test-input-titulo
          {{on "input" this.actualizarTitulo}}
          {{on "blur" this.marcarTituloTocado}}
        />
        {{#if this.wizard.errorTitulo}}
          <p class="campo-error" role="alert" data-test-error-titulo>
            {{this.wizard.errorTitulo}}
          </p>
        {{/if}}
      </div>

      <div class="campos-fila">
        <div class="campo-grupo">
          <div class="campo-cabecera">
            <label for="input-fecha" class="campo-etiqueta">
              Fecha <span class="obligatorio">*</span>
            </label>
          </div>
          <input
            id="input-fecha"
            type="date"
            class="campo-input {{if this.wizard.errorFecha 'con-error'}}"
            value={{this.wizard.fecha}}
            data-test-input-fecha
            {{on "input" this.actualizarFecha}}
            {{on "change" this.actualizarFecha}}
            {{on "blur" this.marcarFechaTocada}}
          />
          {{#if this.wizard.errorFecha}}
            <p class="campo-error" role="alert" data-test-error-fecha>
              {{this.wizard.errorFecha}}
            </p>
          {{/if}}
        </div>

        <div class="campo-grupo">
          <div class="campo-cabecera">
            <label for="input-hora" class="campo-etiqueta">
              Hora <span class="opcional">(opcional)</span>
            </label>
          </div>
          <input
            id="input-hora"
            type="time"
            class="campo-input {{if this.wizard.errorHora 'con-error'}}"
            value={{this.wizard.hora}}
            data-test-input-hora
            {{on "input" this.actualizarHora}}
            {{on "change" this.actualizarHora}}
          />
          {{#if this.wizard.errorHora}}
            <p class="campo-error" role="alert" data-test-error-hora>
              {{this.wizard.errorHora}}
            </p>
          {{/if}}
        </div>
      </div>

      <div class="campo-grupo">
        <div class="campo-cabecera">
          <label for="input-lugar" class="campo-etiqueta">
            Lugar <span class="obligatorio">*</span>
          </label>
          <span class="campo-contador">{{this.longitudLugar}}/80</span>
        </div>
        <input
          id="input-lugar"
          type="text"
          maxlength="80"
          class="campo-input {{if this.wizard.errorLugar 'con-error'}}"
          placeholder="Ej. Casa de la Mujer, salón principal"
          value={{this.wizard.lugar}}
          data-test-input-lugar
          {{on "input" this.actualizarLugar}}
          {{on "blur" this.marcarLugarTocado}}
        />
        {{#if this.wizard.errorLugar}}
          <p class="campo-error" role="alert" data-test-error-lugar>
            {{this.wizard.errorLugar}}
          </p>
        {{/if}}
      </div>

      <div class="campo-grupo">
        <div class="campo-cabecera">
          <label for="input-descripcion" class="campo-etiqueta">
            Descripción breve <span class="opcional">(opcional)</span>
          </label>
          <span class="campo-contador">{{this.longitudDescripcion}}/200</span>
        </div>
        <textarea
          id="input-descripcion"
          rows="3"
          maxlength="200"
          class="campo-textarea {{if this.wizard.errorDescripcion 'con-error'}}"
          placeholder="Agrega detalles adicionales como materiales, registro o recomendaciones..."
          data-test-input-descripcion
          {{on "input" this.actualizarDescripcion}}
        >{{this.wizard.descripcion}}</textarea>
        {{#if this.wizard.errorDescripcion}}
          <p class="campo-error" role="alert" data-test-error-descripcion>
            {{this.wizard.errorDescripcion}}
          </p>
        {{/if}}
      </div>
    </div>
  </template>
}
