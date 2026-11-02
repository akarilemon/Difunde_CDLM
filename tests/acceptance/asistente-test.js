import { module, test } from 'qunit';
import { visit, click, fillIn, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'difunde-cdlm/tests/helpers';

module('Acceptance | flujo del asistente Difunde CDLM', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    window.localStorage.removeItem('difunde:historial');
  });

  test('recorre los 4 pasos del asistente y valida las guardas de ruta', async function (assert) {
    // Si intenta entrar directo al paso 3 sin datos, redirige a /nuevo/tipo (vía /nuevo/datos)
    await visit('/nuevo/plantilla');
    assert.strictEqual(currentURL(), '/nuevo/tipo');

    // Inicio -> Crear un diseño
    await visit('/');
    await click('[data-test-btn-crear-diseno]');
    assert.strictEqual(currentURL(), '/nuevo/tipo');
    assert.dom('[data-test-btn-siguiente]').isDisabled();

    // Paso 1: Elegir tipo de pieza
    await click('[data-test-tarjeta-tipo="evento"]');
    assert.dom('[data-test-btn-siguiente]').isEnabled();
    await click('[data-test-btn-siguiente]');
    assert.strictEqual(currentURL(), '/nuevo/datos');

    // Paso 2: Capturar los datos del aviso
    assert.dom('[data-test-btn-siguiente]').isDisabled();
    await fillIn('[data-test-input-titulo]', 'Asamblea General de Mujeres');
    await fillIn('[data-test-input-fecha]', '2026-10-15');
    await fillIn('[data-test-input-hora]', '16:30');
    await fillIn('[data-test-input-lugar]', 'Salón Violeta CDLM');
    await fillIn('[data-test-input-descripcion]', 'Espacio abierto de diálogo y organización comunitaria.');
    assert.dom('[data-test-btn-siguiente]').isEnabled();
    await click('[data-test-btn-siguiente]');
    assert.strictEqual(currentURL(), '/nuevo/plantilla');

    // Paso 3: Elegir una de las 3 plantillas
    await click('[data-test-plantilla-opcion="barro"]');
    await click('[data-test-btn-siguiente]');
    assert.strictEqual(currentURL(), '/nuevo/vista-previa');

    // Paso 4: Vista previa y canvas
    assert.dom('[data-test-vista-canvas] canvas').exists();
    assert.dom('[data-test-boton-compartir]').exists();
  });
});
