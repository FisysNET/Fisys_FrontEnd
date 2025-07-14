// Componentes.js
// Este archivo se encarga de registrar y configurar los componentes personalizados
// y de exponer una API global para interactuar con ellos.
// Puedes agregar más componentes aquí según sea necesario.


//imports especiales barras menús
import './BarraSuperior/BarraSuperior.js';
import './MenuLateral/MenuLateral.js';

//imports
import { ComboBoxComponent } from './general/ComboBox.js';
//import { BarraSuperiorComponent } from './BarraSuperior/BarraSuperior.js';
//import { MenuLateralComponent } from './MenuLateral/MenuLateral.js';
//import { CalendarioBoxComponent } from './CalendarioBox.js'; nuevo

//registros 
customElements.define('combo-box', ComboBoxComponent);
//customElements.define('barra-superior', BarraSuperiorComponent);
//customElements.define('menu-lateral', MenuLateralComponent);
//customElements.define('calendar-box', CalendarioBoxComponent); nuevo


// API global para configurar componentes desde cualquier parte
window.Componentes = {
  ComboBox: {
    configurar(id, opciones = {}) {
      const combo = document.querySelector(`combo-box#${id}`);
      if (!combo || !combo.shadowRoot) return;

      const select = combo.shadowRoot.querySelector("select");
      if (!select) return;

      //evento al cambiar de valor
      //if (opciones.onSelect) {
      //  select.addEventListener("change", () => {
      //    opciones.onSelect(select.value);
      //  });
      //}
    }
  }
  // En el futuro puedes extender esto: Modal, Calendario, etc.
};