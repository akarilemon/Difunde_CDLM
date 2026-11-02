import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';

export default class BotonCompartirComponent extends Component {
  @service share;
  @service renderer;
  @service storage;

  @tracked procesando = false;
  @tracked mensajeAviso = null;

  ejecutarCompartir = async () => {
    if (this.procesando || !this.args.diseno) return;
    this.procesando = true;
    this.mensajeAviso = null;

    try {
      const resultado = await this.share.compartir(this.args.diseno);

      if (!resultado.cancelado) {
        // Diagrama 5: Al compartir o descargar, generar miniatura JPEG de 240 px y guardar en el historial
        const miniatura = await this.renderer.generarMiniatura(
          this.args.diseno,
          240
        );
        const guardado = this.storage.guardar({
          ...this.args.diseno,
          miniatura,
          creadoEn: Date.now(),
        });

        if (resultado.metodo === 'download') {
          this.mensajeAviso =
            '¡La imagen se descargó y guardó en tu dispositivo!';
        } else {
          this.mensajeAviso = '¡Diseño compartido y guardado en tu historial!';
        }

        if (typeof this.args.onCompartido === 'function') {
          this.args.onCompartido(guardado, resultado);
        }
      }
    } catch {
      this.mensajeAviso = 'Ocurrió un problema al generar la imagen.';
    } finally {
      this.procesando = false;
    }
  };

  ejecutarDescargaDirecta = async () => {
    if (this.procesando || !this.args.diseno) return;
    this.procesando = true;
    this.mensajeAviso = null;

    try {
      const resultado = await this.share.descargar(this.args.diseno);
      const miniatura = await this.renderer.generarMiniatura(
        this.args.diseno,
        240
      );
      const guardado = this.storage.guardar({
        ...this.args.diseno,
        miniatura,
        creadoEn: Date.now(),
      });

      this.mensajeAviso = '¡Imagen PNG descargada y guardada en tu historial!';

      if (typeof this.args.onCompartido === 'function') {
        this.args.onCompartido(guardado, resultado);
      }
    } catch {
      this.mensajeAviso = 'No se pudo descargar la imagen.';
    } finally {
      this.procesando = false;
    }
  };

  <template>
    <div class="boton-compartir-bloque" data-test-bloque-compartir>
      <div class="boton-compartir-acciones">
        <button
          type="button"
          class="btn btn-primario btn-grande btn-compartir"
          disabled={{this.procesando}}
          data-test-boton-compartir
          {{on "click" this.ejecutarCompartir}}
        >
          <span aria-hidden="true">📲</span>
          <span>
            {{if
              this.procesando
              "Generando imagen..."
              "Compartir o descargar imagen"
            }}
          </span>
        </button>

        <button
          type="button"
          class="btn btn-secundario btn-descargar"
          disabled={{this.procesando}}
          data-test-boton-descargar
          {{on "click" this.ejecutarDescargaDirecta}}
        >
          <span aria-hidden="true">⬇️</span>
          <span>Guardar PNG en el dispositivo</span>
        </button>
      </div>

      {{#if this.mensajeAviso}}
        <p class="aviso-compartido" role="status" data-test-aviso-compartido>
          {{this.mensajeAviso}}
        </p>
      {{/if}}
    </div>
  </template>
}
