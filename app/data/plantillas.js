/**
 * Definición declarativa de las plantillas para Difunde CDLM.
 * Paleta de colores construida a partir de tonos morados (violeta, amatista, ciruela y lavanda).
 */
export const PLANTILLAS = [
  {
    id: 'flor',
    nombre: 'Flor de Amatista',
    descripcion: 'Cálida y orgánica con motivos florales en tonos violeta y lavanda',
    patron: 'flores',
    colores: {
      fondoInicio: '#3b0764', // Morado profundo
      fondoMedio: '#581c87', // Púrpura real
      fondoFin: '#7e22ce', // Amatista vibrante
      tarjetaFondo: 'rgba(255, 255, 255, 0.94)',
      textoPrimario: '#2e1065',
      textoSecundario: '#5b21b6',
      textoClaro: '#faf5ff',
      acento: '#a855f7',
      etiquetaFondo: '#f3e8ff',
      etiquetaTexto: '#6b21a8',
      patronColor: 'rgba(233, 213, 255, 0.16)',
      divisor: '#d8b4fe',
    },
    tipografias: {
      titulo: 'Georgia, "Times New Roman", serif',
      cuerpo: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      etiqueta: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    },
    dimensiones: {
      ancho: 1080,
      alto: 1350,
      margen: 72,
    },
  },
  {
    id: 'barro',
    nombre: 'Barro Púrpura',
    descripcion: 'Tradicional y firme con arcos geométricos en ciruela y malva',
    patron: 'arcos',
    colores: {
      fondoInicio: '#4a044e', // Ciruela oscuro
      fondoMedio: '#701a75', // Magenta morado
      fondoFin: '#86198f', // Orquídea intenso
      tarjetaFondo: 'rgba(253, 244, 255, 0.95)',
      textoPrimario: '#3b0764',
      textoSecundario: '#701a75',
      textoClaro: '#fdf4ff',
      acento: '#c026d3',
      etiquetaFondo: '#fae8ff',
      etiquetaTexto: '#86198f',
      patronColor: 'rgba(245, 208, 254, 0.15)',
      divisor: '#f0abfc',
    },
    tipografias: {
      titulo: 'Georgia, "Times New Roman", serif',
      cuerpo: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      etiqueta: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    },
    dimensiones: {
      ancho: 1080,
      alto: 1350,
      margen: 72,
    },
  },
  {
    id: 'verde',
    nombre: 'Salvia y Lavanda',
    descripcion: 'Serena y fresca con follaje botánico sobre índigo y morado suave',
    patron: 'hojas',
    colores: {
      fondoInicio: '#2e1065', // Índigo morado oscuro
      fondoMedio: '#4c1d95', // Violeta intenso
      fondoFin: '#6d28d9', // Morado salvia
      tarjetaFondo: 'rgba(245, 243, 255, 0.95)',
      textoPrimario: '#1e1b4b',
      textoSecundario: '#4338ca',
      textoClaro: '#ede9fe',
      acento: '#8b5cf6',
      etiquetaFondo: '#ede9fe',
      etiquetaTexto: '#4c1d95',
      patronColor: 'rgba(196, 181, 253, 0.16)',
      divisor: '#c4b5fd',
    },
    tipografias: {
      titulo: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      cuerpo: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      etiqueta: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    },
    dimensiones: {
      ancho: 1080,
      alto: 1350,
      margen: 72,
    },
  },
];

export const TIPOS_PIEZA = [
  {
    id: 'evento',
    nombre: 'Evento',
    descripcion: 'Talleres, asambleas, círculos de lectura, ferias o reuniones del colectivo.',
    icono: '📅',
  },
  {
    id: 'aviso',
    nombre: 'Aviso',
    descripcion: 'Comunicados importantes, cambios de horario, convocatorias o noticias.',
    icono: '📢',
  },
  {
    id: 'invitacion',
    nombre: 'Invitación',
    descripcion: 'Invitaciones especiales a celebraciones, encuentros o actividades abiertas.',
    icono: '💜',
  },
];

export function obtenerPlantilla(id) {
  return PLANTILLAS.find((p) => p.id === id) || PLANTILLAS[0];
}
