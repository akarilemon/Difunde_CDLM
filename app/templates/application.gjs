import { pageTitle } from 'ember-page-title';
import { LinkTo } from '@ember/routing';

<template>
  {{pageTitle "Difunde CDLM · Colectivo Casa de la Mujer"}}

  <div class="app-contenedor">
    <header class="app-cabecera">
      <div class="app-cabecera-interior">
        <LinkTo @route="index" class="app-marca" data-test-link-inicio>
          <span class="app-logo" aria-hidden="true">💜</span>
          <div class="app-marca-textos">
            <span class="app-nombre">Difunde CDLM</span>
            <span class="app-subtitulo">Colectivo Casa de la Mujer</span>
          </div>
        </LinkTo>
      </div>
    </header>

    <main class="app-principal">
      {{outlet}}
    </main>

    <footer class="app-pie">
      <p>
        Difunde CDLM · Aplicación libre, privada y sin conexión a servidores externos
      </p>
    </footer>
  </div>
</template>
