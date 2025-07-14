import { IniciarEnrutador } from './enrutador.js';
import { CargarHTML } from './utilidades.js';

async function InicializarEstructura() {
   // await CargarHTML('#Cabecera', './componentes/Cabecera.html');
   // await CargarHTML('#MenuLateral', './componentes/MenuLateral.html');
}

InicializarEstructura().then(() => {
    IniciarEnrutador();
});
