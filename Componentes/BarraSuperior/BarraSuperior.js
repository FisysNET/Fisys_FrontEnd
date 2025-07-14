/*
export class BarraSuperior extends HTMLElement {
  async connectedCallback() {
    const html = await fetch('/Componentes/BarraSuperior/barra-superior.html').then(r => r.text());
    this.innerHTML = html;
  }
}
customElements.define('barra-superior', BarraSuperior);
*/
export class BarraSuperior extends HTMLElement {
  async connectedCallback() {
    const html = await fetch('/Componentes/BarraSuperior/barra-superior.html').then(r => r.text());
    this.innerHTML = html;

    // ⬇️ Esperamos a que el botón exista para agregar el listener
    const botonMenu = this.querySelector("#boton-colapsar-menu");
    if (botonMenu) {
      botonMenu.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("alternar-menu-lateral"));
      });
    }
  }
}

customElements.define('barra-superior', BarraSuperior);
