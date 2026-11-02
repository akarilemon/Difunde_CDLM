import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';
import ListaHistorial from 'difunde-cdlm/components/lista-historial';

export default class IndexTemplate extends Component {
  @service wizard;
  @service storage;
  @service router;

  get disenosGuardados() {
    return this.storage.listar();
  }

  iniciarNuevoDiseno = () => {
    this.wizard.reiniciar();
    this.router.transitionTo('nuevo.tipo');
  };

  abrirDiseno = (id) => {
    this.router.transitionTo('compartir', id);
  };

  eliminarDiseno = (id) => {
    this.storage.eliminar(id);
  };

  <template>
    <div class="vista-inicio" data-test-vista-inicio>
      <section class="hero-tarjeta">
        <span class="hero-insignia">Asistente de difusión en 4 pasos</span>
        <h1 class="hero-titulo">
          Crea banners y flyers para tu comunidad desde tu celular
        </h1>
        <p class="hero-descripcion">
          Diseña avisos, invitaciones y carteles de eventos del Colectivo Casa de la Mujer listos para compartir por WhatsApp y redes sociales.
        </p>
        <button
          type="button"
          class="btn btn-primario btn-grande hero-boton"
          data-test-btn-crear-diseno
          {{on "click" this.iniciarNuevoDiseno}}
        >
          <span>✨ Crear un diseño</span>
        </button>
      </section>

      <ListaHistorial
        @disenos={{this.disenosGuardados}}
        @onAbrir={{this.abrirDiseno}}
        @onEliminar={{this.eliminarDiseno}}
      />
    </div>
  </template>
}
