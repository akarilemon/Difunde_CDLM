import { module, test } from 'qunit';
import { setupTest } from 'difunde-cdlm/tests/helpers';

module('Unit | Service | storage', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    window.localStorage.removeItem('difunde:historial');
  });

  test('guarda, lista, limita a 10 elementos y descarta JSON corrupto', function (assert) {
    const storage = this.owner.lookup('service:storage');

    window.localStorage.setItem('difunde:historial', '{json-corrupto');
    assert.deepEqual(storage.listar(), [], 'Descarta JSON corrupto y devuelve []');

    for (let i = 1; i <= 12; i++) {
      storage.guardar({
        id: `diseno-${i}`,
        tipo: 'aviso',
        titulo: `Aviso ${i}`,
        fecha: '2026-10-01',
        lugar: 'CDLM',
        plantillaId: 'flor',
        miniatura: 'data:image/jpeg;base64,abc',
        creadoEn: 1000 + i,
      });
    }

    const lista = storage.listar();
    assert.strictEqual(lista.length, 10, 'Recorta a 10 elementos como máximo');
    assert.strictEqual(lista[0].id, 'diseno-12', 'Inserta el más reciente al inicio');
    assert.strictEqual(storage.obtener('diseno-12').titulo, 'Aviso 12');

    storage.eliminar('diseno-12');
    assert.strictEqual(storage.obtener('diseno-12'), null);
  });
});
