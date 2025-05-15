(function () {

    const API_BASE_URL = window.API_BASE_URL || '/api/';
  
    //helpers
    function parseJwt(token) {
      const base64Url = token.split('.')[1];
      if (!base64Url) throw Error('Sin payload');
  
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
      return JSON.parse(atob(padded));
    }
  
    function isTokenValidLocally(token) {
      if (!token) return false;
      try {
        const payload = parseJwt(token);
        return !payload.exp || payload.exp * 1000 > Date.now();
      } catch {
        return false;
      }
    }
  
    // Pregunta al backend si el token sigue siendo válido.
    // Devuelve una promesa true/false.          
    function validateTokenServer(token) {
      return $.ajax({
        url: API_BASE_URL + 'auth/validate', 
        method: 'GET',
        headers: { Authorization: 'Bearer ' + token }
      }).then(
        () => true, // 200
        () => false // 401, 403
      );
    }
  

    //Comprobación constante
    (async function () {
      const token = localStorage.getItem('token');
  
      //chek local rápido
      if (!isTokenValidLocally(token)) return kickToLogin();
  
      //TODO --------------------------------------------------------------------------------!!!!!!!!!!!!!!!!!!!!
      // chek con el servidor, bloqueamos la navegación hasta comprobar que es correcto
      //const stillValid = await validateTokenServer(token);
      //if (!stillValid) return kickToLogin();
  
      // token OK configuramos Ajax y exponemos claims
      window.userClaims = parseJwt(token);
      $.ajaxSetup({ headers: { Authorization: 'Bearer ' + token } });
  
      // Capturamos 401 globales (por si el token caduca mientras se navega)
      $(document).ajaxError((_e, xhr) => {
        if (xhr.status === 401) kickToLogin();
      });
    })();
  
    //para enviar al login
    function kickToLogin() {
      localStorage.removeItem('token');
      location.href = '/login.html';
    }
  
  })();
  

  //Control de roles
  function getRole() {
    return window.userClaims?.role 
        ?? window.userClaims?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  }

  function hasRole(roles) {
    return roles.includes(getRole());
  }
  window.Auth = Object.assign(window.Auth || {}, { getRole, hasRole });

  //para el menú
  (() => {
    const myRole = Auth.getRole();
    document.querySelectorAll('#sidebarMenu li[data-role]').forEach(li => {
      const allowed = li.dataset.role.split(',').map(r => r.trim());
      if (!allowed.includes(myRole)) li.style.display = 'none';
    });
  })();

  (function () {
    // Oculta menús con data-role que NO contengan el rol del usuario
    function applyRoleFilter(root = document) {
      const myRole = Auth.getRole();
      root.querySelectorAll('[data-role]').forEach(el => {
        const allowed = el.dataset.role.split(',').map(r => r.trim());
        if (!allowed.includes(myRole)) el.classList.add('d-none');
      });
    }
  
    document.addEventListener('DOMContentLoaded', () => {
      applyRoleFilter();
  
      const obs = new MutationObserver(muts =>
        muts.forEach(m =>
          m.addedNodes.forEach(n => {
            if (n.nodeType === 1) applyRoleFilter(n);
          })
        )
      );
  
      // observa sobre document.body sólo una vez que el DOM está listo para aplicar filtros de rol
      obs.observe(document.body, { childList: true, subtree: true });
    });
  
    // Exporta si luego para volver a filtrarlo manualmente
    window.applyRoleFilter = applyRoleFilter;
  })();
  