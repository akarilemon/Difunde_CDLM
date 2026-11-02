import { module, test } from 'qunit';
import { setupTest } from 'difunde-cdlm/tests/helpers';

module('Unit | Service | wizard', function (hooks) {
  setupTest(hooks);

  test('valida cada paso según las reglas del documento (RF-2)', function (assert) {
    const wizard = this.owner.lookup('service:wizard');
    wizard.reiniciar();

    assert.false(wizard.esValidoPaso(1), 'Paso 1 inválido sin tipo');
    assert.strictEqual(wizard.errorTipo, 'Elige qué vas a anunciar');

    wizard.tipo = 'evento';
    assert.true(wizard.esValidoPaso(1), 'Paso 1 válido al elegir tipo');
    assert.false(wizard.esValidoPaso(2), 'Paso 2 inválido sin datos');
    assert.strictEqual(wizard.errorTitulo, 'Escribe un título');
    assert.strictEqual(wizard.errorFecha, 'Elige una fecha');
    assert.strictEqual(wizard.errorLugar, 'Escribe el lugar');

    wizard.titulo = 'Taller de bordado colectivo';
    wizard.fecha = '2026-10-01';
    wizard.lugar = 'Casa de la Mujer';
    wizard.hora = '17:00';
    wizard.descripcion = 'Trae tus hilos y bastidor.';

    assert.true(wizard.esValidoPaso(2), 'Paso 2 válido con campos obligatorios');
    assert.true(wizard.esValidoPaso(3), 'Paso 3 válido con plantilla por defecto');
    assert.true(wizard.esValidoPaso(4), 'Paso 4 válido cuando todo está completo');
  });

  test('cargar y reiniciar funcionan correctamente', function (assert) {
    const wizard = this.owner.lookup('service:wizard');

    wizard.cargar({
      id: 'abc-123',
      tipo: 'invitacion',
      titulo: 'Círculo de lectura',
      fecha: '2026-11-15',
      hora: '18:30',
      lugar: 'Jardín central',
      descripcion: 'Entrada libre',
      plantillaId: 'barro',
    });

    assert.strictEqual(wizard.borrador.titulo, 'Círculo de lectura');
    assert.strictEqual(wizard.borrador.plantillaId, 'barro');

    wizard.reiniciar();
    assert.strictEqual(wizard.borrador.titulo, '');
    assert.strictEqual(wizard.borrador.tipo, '');
  });
});
