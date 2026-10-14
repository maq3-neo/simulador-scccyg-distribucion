(async function () {
  const boton = document.getElementById('descargar');
  const version = document.getElementById('t-descarga');
  try {
    const respuesta = await fetch('simulador-scccyg/v1/latest.json?t=' + Date.now(), {
      cache: 'no-store', signal: AbortSignal.timeout(10000)
    });
    if (!respuesta.ok) throw new Error('Manifiesto no disponible');
    const datos = await respuesta.json();
    if (datos.esquema !== 1 || !/^\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?$/.test(datos.version)) {
      throw new Error('Versión inválida');
    }
    const esperado = 'https://github.com/maq3-neo/simulador-scccyg-distribucion/releases/download/v' +
      datos.version + '/Simulador-SCCCyG-Setup-' + datos.version + '.exe';
    if (datos.url_instalador !== esperado) throw new Error('Destino inválido');
    const informacion = document.getElementById('datos-instalador');
    const partes = [];
    if (Number.isSafeInteger(datos.tamano_bytes) && datos.tamano_bytes > 0) {
      partes.push('Instalador de ' + (datos.tamano_bytes / 1000000).toLocaleString('es-MX', {minimumFractionDigits: 1, maximumFractionDigits: 1}) + ' MB');
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha)) {
      const fecha = new Date(datos.fecha + 'T12:00:00Z');
      if (!Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0,10) === datos.fecha) {
        partes.push('Publicado el ' + fecha.toLocaleDateString('es-MX', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'}));
      }
    }
    informacion.textContent = partes.join(' · ');
    version.textContent = 'Versión ' + datos.version;
    boton.href = esperado;
    boton.textContent = 'Descargar para Windows';
    boton.removeAttribute('aria-disabled');
  } catch (error) {
    version.textContent = 'No pudimos comprobar la versión disponible';
    boton.removeAttribute('href');
    boton.textContent = 'Recarga la página para volver a intentar';
  }
})();
