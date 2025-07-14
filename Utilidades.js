//export async function CargarHTML(selectorContenedor, rutaArchivo) {
//    const contenedor = document.querySelector(selectorContenedor);
//    const respuesta = await fetch(rutaArchivo);
//    const html = await respuesta.text();
//    contenedor.innerHTML = html;
//}

export async function CargarHTML(selectorContenedor, rutaArchivo) {
  const contenedor = document.querySelector(selectorContenedor);
  if (!contenedor) {
    console.error(`No se encontró el contenedor: ${selectorContenedor}`);
    return;
  }

  const respuesta = await fetch(rutaArchivo);
  const html = await respuesta.text();
  contenedor.innerHTML = html;

  // Vuelve a ejecutar cualquier <script> dentro del HTML insertado
  const scripts = contenedor.querySelectorAll("script");
  scripts.forEach((scriptOriginal) => {
    const nuevoScript = document.createElement("script");
    if (scriptOriginal.type) nuevoScript.type = scriptOriginal.type;
    if (scriptOriginal.src) {
      nuevoScript.src = scriptOriginal.src;
    } else {
      nuevoScript.textContent = scriptOriginal.textContent;
    }
    scriptOriginal.replaceWith(nuevoScript);
  });
}
