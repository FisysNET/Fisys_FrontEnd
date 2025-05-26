/* ---------------- Utils globales de la app --------------- */

/**
 * Devuelve el texto del rol a partir del código numérico.
 * @param {number|string} num
 * @returns {string}
 */
function rolTexto(num) {
  switch (+num) {                  // “+” asegura que comparamos número
    case 0: return "SuperAdmin";
    case 1: return "Auditor";
    case 2: return "Responsable";
    case 3: return "Fisio2";
    case 4: return "Administración";
    default: return String(num);   // por si viene texto o código desconocido
  }
}

/* ---- Exportarlo en el espacio global ---- */
window.Utils = Object.assign(window.Utils || {}, { rolTexto });

/**Roles disponibles */
function getRoles()
{
  const roles = [
    'SuperAdmin',
    'Auditor',
    'Responsable',
    'Fisio',
    'Administracion'
  ];
  return roles.join(',');
}

function getNumberOfRole(roleString)
{
  switch(roleString) {
    case 'SuperAdmin':
      return 0;
    case 'Auditor':
      return 1;
    case 'Responsable':
      return 2;
    case 'Fisio':
      return 3;
    case 'Administracion':
      return 4;
    default:
      return 99;
  }
}

/**Claims del usuario */
const claims   = window.userClaims || {};
function getCurretTrabajadorId()
{
  return claims.sub;  
}
function getCurretClinicaIdTrabajador()
{
  return claims.clinica;  
}


