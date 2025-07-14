// menu-lateral.js
const plantillaMenuLateral = document.createElement("template");
plantillaMenuLateral.innerHTML = `
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" />
  <style>
    :host { display: block; height: calc(100vh - 65px); background: #343a40; color: white; width: 250px; transition: width 0.2s ease; }
    /* estado colapsado */
    :host(.collapsed) { width: 70px; }
    :host(.collapsed) #sidebar ul li a span { display: none; }
    :host(.collapsed) #sidebar ul li a { justify-content: center; }
    #sidebar { display: flex; flex-direction: column; height: 100%; }
    #sidebar ul { flex-grow: 1; list-style: none; margin: 0; padding: 0; }
    #sidebar ul li a { display: flex; align-items: center; gap: 0.6rem; padding: 0.75rem 1rem; color: #fff; text-decoration: none; transition: background 0.15s; cursor: pointer; }
    #sidebar ul li a:hover { background: #495057; }
    .sub-menu { display: none; margin-left: 1.5rem; padding-left: 0; }
    li.open > .sub-menu { display: block; }
  </style>
  <aside id="sidebar">
    <ul id="sidebarMenu">
      <li><a class="has-action" data-route="EntradaApp"><i class="bi bi-house"></i><span>Inicio</span></a></li>
      <li><a class="has-sub"><i class="bi bi-clipboard2-pulse-fill"></i><span>Mi consulta</span></a>
        <ul class="sub-menu">
          <li><a class="has-action" data-route="MiConsulta"><span>Acceder</span></a></li>
          <li><a class="has-action" data-route="MiConsulta-Calendario"><span>Calendario</span></a></li>
        </ul>
      </li>
      <li><a class="has-sub"><i class="bi bi-journal"></i><span>Clientes</span></a>
        <ul class="sub-menu">
          <li><a class="has-action" data-route="Clientes-Gestion"><span>Gestión</span></a></li>
          <li><a class="has-action data-route="Clientes-Reportes"><span>Reportes</span></a></li>
        </ul>
      </li>
      <li><a class="has-sub"><i class="bi bi-person-fill"></i><span>Trabajadores</span></a>
        <ul class="sub-menu">
          <li><a class="has-action" data-route="Trabajadores-Gestion"><span>Gestión</span></a></li>
          <li><a class="has-action" data-route="Trabajadores-Reportes"><span>Reportes</span></a></li>
        </ul>
      </li>
      <li><a class="has-sub"><i class="bi bi-hospital"></i><span>Clínicas</span></a>
        <ul class="sub-menu">
          <li><a class="has-action" data-route="Clinicas-Gestion"><span>Gestión</span></a></li>
          <li><a class="has-action" data-route="Clinicas-Reportes"><span>Reportes</span></a></li>
        </ul>
      </li>
      <li><a class="has-action"><i class="bi bi-gear"></i><span>Administración</span></a></li>
    </ul>
  </aside>
`;
//marca error pero está bien
import { NavegarA } from './../../Enrutador.js';

export class MenuLateral extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(plantillaMenuLateral.content.cloneNode(true));
  }

  connectedCallback() {
    const shadow = this.shadowRoot;
    const host = this;

    // 1) Toggle sub-menús
    shadow.querySelectorAll('a.has-sub').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        if (host.classList.contains('collapsed')) {
          host.classList.remove('collapsed');
          return setTimeout(() => link.parentElement.classList.add('open'), 200);
        }
        const li = link.parentElement;
        li.classList.toggle('open');
        li.parentElement.querySelectorAll('li.open').forEach(other => {
          if (other !== li) other.classList.remove('open');
        });
      });
    });

    // 2) Enrutador
    shadow.querySelectorAll('a.has-action').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        // Si colapsado, solo expandir
        if (host.classList.contains('collapsed')) {
          return host.classList.remove('collapsed');
        }
        // Leer ruta del atributo data-route
        const ruta = link.getAttribute('data-route');
        if (ruta) {
         // alert(ruta);
          NavegarA(ruta);
        } else {
          console.warn('No existe atributo data-route en', link);
        }
      });
    });


    // 3) Espera a que exista el botón en el DOM y añade el listener
    const addToggleListener = () => {
      const toggleBtn = document.getElementById('boton-colapsar-menu');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', e => {
          e.preventDefault();
          host.classList.toggle('collapsed');
        });
      } else {
        // si no está aún, lo intentamos de nuevo en 100ms
        setTimeout(addToggleListener, 100);
      }
    };
    addToggleListener();
  }
}

customElements.define('menu-lateral', MenuLateral);
