$(document).ready(function () {
  $('#loginForm').on('submit', function (e) {
    e.preventDefault();

    const login = $('#login').val(); // este es el ID correcto del input
    const password = $('#password').val();

    $.ajax({
      url: API_BASE_URL + 'auth/login', // usamos la constante global del config
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ login: login, password: password }),
      success: function (response) {
        debugger;
        console.log('Login correcto:', response);

        //Guarda el JWT
        localStorage.setItem('token', response.accessToken);
      
        // Redirige al dashboard
        window.location.href = 'Lobby/dashboard.html';
      },
      error: function (xhr) {
        debugger;
        console.error('Error al iniciar sesión:', xhr);
        $('#loginError').show();
      }
    });
  });
});
