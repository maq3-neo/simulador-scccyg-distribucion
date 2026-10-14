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
