export class ComboBoxComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const endpoint = this.getAttribute("endpoint");
    const valueField = this.getAttribute("value-field");
    const textField = this.getAttribute("text-field");
    const placeholder = this.getAttribute("placeholder") || "Seleccione...";

    const select = document.createElement("select");
    select.className = "form-select";

    const opcionInicial = document.createElement("option");
    opcionInicial.value = "";
    opcionInicial.textContent = placeholder;
    select.appendChild(opcionInicial);

    try {
      const respuesta = await fetch(endpoint);
      const datos = await respuesta.json();

      datos.forEach(item => {
        const opcion = document.createElement("option");
        opcion.value = item[valueField];
        opcion.textContent = item[textField];
        select.appendChild(opcion);
      });
    } catch (error) {
      select.innerHTML = '<option value="">Error al cargar</option>';
      console.error("Error cargando ComboBox:", error);
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; margin-bottom: 1rem; }
      </style>
    `;
    this.shadowRoot.appendChild(select);
  }
}
