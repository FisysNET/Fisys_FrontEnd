import { CargarHTML } from './utilidades.js';

const RUTAS = {
  '/': './Bienvenida.html', // o cualquier página principal
  
  '/EntradaApp': './App/Index.html',
  '/MiConsulta': '',
  '/Clientes-Gestion': '',
  '/Clientes-Reportes': '',
  '/Trabajadores-Gestion': './App/Trabajadores/Gestion.html',
  '/Trabajadores-Reportes': '',
  '/Clinicas-Gestion': '',
  '/Clinicas-Reportes': ''
  

};

export function IniciarEnrutador() {
    window.addEventListener('popstate', ManejarCambioRuta);
    document.body.addEventListener('click', evento => {
        if (evento.target.matches('[data-enlace]')) {
            evento.preventDefault();
            const ruta = evento.target.getAttribute('href');
            NavegarA(ruta);
        }
    });
    ManejarCambioRuta();
}

export function NavegarA(ruta) {
    history.pushState(null, null, ruta);
    ManejarCambioRuta();
}

async function ManejarCambioRuta() {
    const rutaActual = window.location.pathname;
        debugger;

    const rutaAnterior = sessionStorage.getItem('rutaAnterior');

    const rutaHTML = RUTAS[rutaActual] || RUTAS[rutaAnterior] || './rutas/Error/404.html';
    await CargarHTML('#contenido-principal', rutaHTML);
    
}
