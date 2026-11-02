import Service from '@ember/service';
import { obtenerPlantilla } from 'difunde-cdlm/data/plantillas';

const ETIQUETAS_TIPO = {
  evento: 'EVENTO',
  aviso: 'AVISO IMPORTANTE',
  invitacion: 'INVITACIÓN ESPECIAL',
};

const DIAS_SEMANA = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

export default class RendererService extends Service {
  /**
   * Formatea una fecha YYYY-MM-DD en español, p. ej. "Jueves 1 de octubre"
   */
  formatearFechaEspanol(fechaIso) {
    if (!fechaIso || !/^\d{4}-\d{2}-\d{2}$/.test(fechaIso)) {
      return fechaIso || 'Fecha por confirmar';
    }
    const [anio, mes, dia] = fechaIso.split('-').map(Number);
    const fecha = new Date(Date.UTC(anio, mes - 1, dia));
    if (Number.isNaN(fecha.getTime())) {
      return fechaIso;
    }
    const diaSemana = DIAS_SEMANA[fecha.getUTCDay()];
    const nombreMes = MESES[fecha.getUTCMonth()];
    return `${diaSemana} ${dia} de ${nombreMes}`;
  }

  /**
   * Parte un texto en renglones usando ctx.measureText() según el ancho máximo.
   */
  ajustarLineas(ctx, texto, anchoMaximo) {
    const limpio = (texto || '').trim();
    if (!limpio) return [];

    const palabras = limpio.split(/\s+/);
    const lineas = [];
    let lineaActual = palabras[0];

    for (let i = 1; i < palabras.length; i++) {
      const palabra = palabras[i];
      const prueba = `${lineaActual} ${palabra}`;
      const metricas = ctx.measureText(prueba);
      if (metricas.width <= anchoMaximo) {
        lineaActual = prueba;
      } else {
        lineas.push(lineaActual);
        lineaActual = palabra;
      }
    }
    lineas.push(lineaActual);
    return lineas;
  }

  /**
   * Paso 1: Esperar las fuentes con document.fonts.load()
   */
  async cargarFuentes(plantilla) {
    if (typeof document !== 'undefined' && document.fonts && document.fonts.load) {
      try {
        await Promise.all([
          document.fonts.load(`bold 64px ${plantilla.tipografias.titulo}`),
          document.fonts.load(`400 36px ${plantilla.tipografias.cuerpo}`),
        ]);
      } catch {
        // Continuar con fuentes del sistema si falla la carga
      }
    }
  }

  /**
   * Dibuja el diseño completo en el canvas proporcionado (1080 x 1350).
   */
  async dibujarEnCanvas(canvas, diseno) {
    const plantilla = obtenerPlantilla(diseno?.plantillaId);
    await this.cargarFuentes(plantilla);

    const { ancho, alto, margen } = plantilla.dimensiones;
    canvas.width = ancho;
    canvas.height = alto;

    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // 3. Dibujar el fondo (degradado) y los elementos decorativos de la plantilla
    this.#dibujarFondo(ctx, plantilla, ancho, alto);
    this.#dibujarPatronDecorativo(ctx, plantilla, ancho, alto);
    this.#dibujarTarjetaCentral(ctx, plantilla, ancho, alto, margen);

    const xContenido = margen + 70;
    const anchoMaximo = ancho - (margen + 70) * 2;
    let cursorY = margen + 125;

    // 4. Dibujar la etiqueta del tipo de pieza (Evento, Aviso o Invitación)
    const textoEtiqueta =
      ETIQUETAS_TIPO[diseno?.tipo] || 'COMUNICADO CDLM';
    cursorY = this.#dibujarEtiqueta(
      ctx,
      plantilla,
      textoEtiqueta,
       ancho / 2,
      cursorY
    );

    cursorY += 56;

    // 5. Dibujar el título con ajuste automático de línea y reducción de fuente por pasos
    const tituloTexto = (diseno?.titulo || 'Título del anuncio').trim();
    cursorY = this.#dibujarTituloAjustado(
      ctx,
      plantilla,
      tituloTexto,
      ancho / 2,
      cursorY,
      anchoMaximo,
      260
    );

    // Línea divisoria decorativa
    cursorY += 28;
    this.#dibujarDivisor(ctx, plantilla, ancho / 2, cursorY, 240);
    cursorY += 58;

    // 6. Dibujar fecha (formateada en español), hora y lugar con sus íconos
    cursorY = this.#dibujarDatosEvento(
      ctx,
      plantilla,
      diseno,
      xContenido,
      cursorY,
      anchoMaximo
    );

    // 7. Dibujar la descripción con el mismo ajuste de línea y un límite de renglones
    if (diseno?.descripcion && diseno.descripcion.trim()) {
      cursorY += 34;
      this.#dibujarDescripcion(
        ctx,
        plantilla,
        diseno.descripcion.trim(),
        ancho / 2,
        cursorY,
        anchoMaximo,
        4
      );
    }

    // 8. Dibujar el pie con el nombre del colectivo
    this.#dibujarPieColectivo(ctx, plantilla, ancho, alto, margen);

    return canvas;
  }

  /**
   * 9. Exportar con canvas.toBlob('image/png')
   */
  async renderizarBlob(diseno) {
    const canvas = document.createElement('canvas');
    await this.dibujarEnCanvas(canvas, diseno);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('No fue posible exportar la imagen PNG.'));
        }
      }, 'image/png');
    });
  }

  /**
   * Genera una miniatura JPEG reducida de 240 px de ancho para localStorage (Diagrama 5).
   */
  async generarMiniatura(diseno, anchoMiniatura = 240) {
    const canvasOriginal = document.createElement('canvas');
    await this.dibujarEnCanvas(canvasOriginal, diseno);

    const proporcion = canvasOriginal.height / canvasOriginal.width;
    const altoMiniatura = Math.round(anchoMiniatura * proporcion);

    const canvasMini = document.createElement('canvas');
    canvasMini.width = anchoMiniatura;
    canvasMini.height = altoMiniatura;

    const ctxMini = canvasMini.getContext('2d');
    if (ctxMini) {
      ctxMini.drawImage(canvasOriginal, 0, 0, anchoMiniatura, altoMiniatura);
    }
    return canvasMini.toDataURL('image/jpeg', 0.8);
  }

  #dibujarFondo(ctx, plantilla, ancho, alto) {
    const gradiente = ctx.createLinearGradient(0, 0, ancho, alto);
    gradiente.addColorStop(0, plantilla.colores.fondoInicio);
    gradiente.addColorStop(0.5, plantilla.colores.fondoMedio);
    gradiente.addColorStop(1, plantilla.colores.fondoFin);

    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, ancho, alto);
  }

  #dibujarPatronDecorativo(ctx, plantilla, ancho, alto) {
    ctx.save();
    ctx.fillStyle = plantilla.colores.patronColor;
    ctx.strokeStyle = plantilla.colores.patronColor;
    ctx.lineWidth = 4;

    if (plantilla.patron === 'flores') {
      const posiciones = [
        [120, 120, 90],
        [960, 140, 85],
        [110, 1220, 95],
        [950, 1210, 90],
        [540, 70, 55],
      ];
      for (const [cx, cy, radio] of posiciones) {
        for (let i = 0; i < 6; i++) {
          const angulo = (i * Math.PI) / 3;
          const px = cx + Math.cos(angulo) * (radio * 0.55);
          const py = cy + Math.sin(angulo) * (radio * 0.55);
          ctx.beginPath();
          ctx.arc(px, py, radio * 0.42, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (plantilla.patron === 'arcos') {
      for (let r = 80; r <= 320; r += 60) {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI / 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ancho, 0, r, Math.PI / 2, Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, alto, r, -Math.PI / 2, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ancho, alto, r, Math.PI, (3 * Math.PI) / 2);
        ctx.stroke();
      }
    } else {
      // Patrón 'hojas'
      const esquinas = [
        [90, 90],
        [ancho - 90, 90],
        [90, alto - 90],
        [ancho - 90, alto - 90],
      ];
      for (const [cx, cy] of esquinas) {
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.ellipse(
            cx,
            cy,
            95,
            34,
            (i * Math.PI) / 4,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }

  #dibujarTarjetaCentral(ctx, plantilla, ancho, alto, margen) {
    ctx.save();
    const x = margen;
    const y = margen;
    const w = ancho - margen * 2;
    const h = alto - margen * 2 - 70;
    const radio = 40;

    ctx.fillStyle = plantilla.colores.tarjetaFondo;
    ctx.shadowColor = 'rgba(20, 5, 45, 0.35)';
    ctx.shadowBlur = 36;
    ctx.shadowOffsetY = 14;

    this.#rectanguloRedondeado(ctx, x, y, w, h, radio);
    ctx.fill();

    // Borde interior sutil
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = plantilla.colores.divisor;
    ctx.lineWidth = 3;
    this.#rectanguloRedondeado(ctx, x + 18, y + 18, w - 36, h - 36, radio - 12);
    ctx.stroke();
    ctx.restore();
  }

  #dibujarEtiqueta(ctx, plantilla, texto, centroX, y) {
    ctx.save();
    ctx.font = `700 28px ${plantilla.tipografias.etiqueta}`;
    const anchoTexto = ctx.measureText(texto).width;
    const padX = 36;
    const altoEtiqueta = 58;
    const anchoEtiqueta = anchoTexto + padX * 2;
    const x = centroX - anchoEtiqueta / 2;

    ctx.fillStyle = plantilla.colores.etiquetaFondo;
    this.#rectanguloRedondeado(ctx, x, y, anchoEtiqueta, altoEtiqueta, 29);
    ctx.fill();

    ctx.strokeStyle = plantilla.colores.acento;
    ctx.lineWidth = 2;
    this.#rectanguloRedondeado(ctx, x, y, anchoEtiqueta, altoEtiqueta, 29);
    ctx.stroke();

    ctx.fillStyle = plantilla.colores.etiquetaTexto;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(texto, centroX, y + altoEtiqueta / 2 + 2);
    ctx.restore();

    return y + altoEtiqueta;
  }

  #dibujarTituloAjustado(
    ctx,
    plantilla,
    titulo,
    centroX,
    yInicial,
    anchoMaximo,
    altoMaximo
  ) {
    ctx.save();
    let tamanoFuente = 68;
    const tamanoMinimo = 38;
    let lineas = [];
    let interlineado = Math.round(tamanoFuente * 1.2);

    while (tamanoFuente >= tamanoMinimo) {
      ctx.font = `700 ${tamanoFuente}px ${plantilla.tipografias.titulo}`;
      interlineado = Math.round(tamanoFuente * 1.2);
      lineas = this.ajustarLineas(ctx, titulo, anchoMaximo);
      const altoTotal = lineas.length * interlineado;
      if (altoTotal <= altoMaximo) {
        break;
      }
      tamanoFuente -= 4;
    }

    ctx.fillStyle = plantilla.colores.textoPrimario;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    let y = yInicial;
    for (const linea of lineas) {
      ctx.fillText(linea, centroX, y);
      y += interlineado;
    }
    ctx.restore();
    return y;
  }

  #dibujarDivisor(ctx, plantilla, centroX, y, ancho) {
    ctx.save();
    ctx.strokeStyle = plantilla.colores.acento;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(centroX - ancho / 2, y);
    ctx.lineTo(centroX + ancho / 2, y);
    ctx.stroke();

    ctx.fillStyle = plantilla.colores.acento;
    ctx.beginPath();
    ctx.arc(centroX, y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  #dibujarDatosEvento(ctx, plantilla, diseno, x, yInicial, anchoMaximo) {
    ctx.save();
    let y = yInicial;

    const fechaFormateada = this.formatearFechaEspanol(diseno?.fecha);
    const filas = [
      { icono: '📅', etiqueta: 'Fecha', valor: fechaFormateada },
    ];

    if (diseno?.hora && diseno.hora.trim()) {
      filas.push({
        icono: '🕒',
        etiqueta: 'Hora',
        valor: `${diseno.hora.trim()} h`,
      });
    }

    filas.push({
      icono: '📍',
      etiqueta: 'Lugar',
      valor: (diseno?.lugar || 'Lugar por confirmar').trim(),
    });

    for (const fila of filas) {
      ctx.font = `600 34px ${plantilla.tipografias.cuerpo}`;
      const lineasValor = this.ajustarLineas(
        ctx,
        fila.valor,
        anchoMaximo - 90
      ).slice(0, 2);
      const altoCaja = Math.max(76, lineasValor.length * 42 + 28);

      ctx.fillStyle = plantilla.colores.etiquetaFondo;
      this.#rectanguloRedondeado(ctx, x, y, anchoMaximo, altoCaja, 20);
      ctx.fill();

      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = `40px ${plantilla.tipografias.cuerpo}`;
      ctx.fillText(fila.icono, x + 24, y + altoCaja / 2);

      ctx.fillStyle = plantilla.colores.textoPrimario;
      ctx.font = `600 33px ${plantilla.tipografias.cuerpo}`;

      let yTexto =
        y + (altoCaja - (lineasValor.length - 1) * 40) / 2;
      for (const linea of lineasValor) {
        ctx.fillText(linea, x + 86, yTexto);
        yTexto += 40;
      }

      y += altoCaja + 18;
    }

    ctx.restore();
    return y;
  }

  #dibujarDescripcion(
    ctx,
    plantilla,
    descripcion,
    centroX,
    yInicial,
    anchoMaximo,
    maxRenglones
  ) {
    ctx.save();
    ctx.font = `400 31px ${plantilla.tipografias.cuerpo}`;
    ctx.fillStyle = plantilla.colores.textoSecundario;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    let lineas = this.ajustarLineas(ctx, descripcion, anchoMaximo - 20);
    if (lineas.length > maxRenglones) {
      lineas = lineas.slice(0, maxRenglones);
      lineas[maxRenglones - 1] = `${lineas[maxRenglones - 1].replace(/[.,;:\s]+$/, '')}…`;
    }

    let y = yInicial;
    for (const linea of lineas) {
      ctx.fillText(linea, centroX, y);
      y += 42;
    }
    ctx.restore();
    return y;
  }

  #dibujarPieColectivo(ctx, plantilla, ancho, alto, margen) {
    ctx.save();
    const yPie = alto - margen - 16;
    ctx.fillStyle = plantilla.colores.textoClaro;
    ctx.font = `700 30px ${plantilla.tipografias.etiqueta}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      '💜 Colectivo Casa de la Mujer · Difunde CDLM',
      ancho / 2,
      yPie
    );
    ctx.restore();
  }

  #rectanguloRedondeado(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}
