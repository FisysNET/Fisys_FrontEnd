$(function () {

// #region variables de cache
  const $tbody      = $("#workersTable tbody");
  const $search     = $("#globalSearch");
  const $form       = $("#workerForm");
  const modal       = new bootstrap.Modal('#workerModal');
  const canEdit     = window.Auth?.hasRole('SuperAdmin','Administracion','Responsable');
  const clinicId    = window.userClaims?.clinica;   // claim del JWT
  let   allData     = [];                           // cache lista
// #endregion

//#region helpers

  // Convierte valor a string en minúsculas
  const safe = v => (v ?? '').toString().toLowerCase();
//#endregion

// #region tabla de trabajadores
  // Devuelve <tr> para la tabla
  function rowHtml(w){
    const clinicas = Array.isArray(w.clinicas)
        ? w.clinicas.map(c => c.nombre).join(', ')
        : '';

    return `<tr data-id="${w.id}">
        <td>${w.login}</td>
        <td>${w.nombre}</td>
        <td>${rolTexto(w.rol)}</td>
        <td>${clinicas}</td>
        <td class="text-end">
          ${canEdit ? `
            <button class="btn btn-sm btn-outline-primary me-1 btn-edit"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-outline-danger btn-del"><i class="bi bi-trash"></i></button>`
          : ''}
        </td>
      </tr>`;
  }

  function renderRows(list){
    $tbody.empty();
    list.forEach(w => $tbody.append(rowHtml(w)));
  }

  /* ---------- 3 · llamada inicial ----------- */
  function loadWorkers(){
    $.getJSON(`${API_BASE_URL}Trabajador/GetAllTrabajadoresActivosByClinica`,
              { id: clinicId })               
     .done(data => {
        allData = data;
        renderRows(data);
     })
     .fail(err => console.error('Error cargando trabajadores', err));
  }
// #endregion

// #region búsqueda tabla
  $search.on('input', function(){
    const q = safe($(this).val().trim());

    if (!q){
      renderRows(allData);
      return;
    }

    const filtered = allData.filter(w => {
      const clinicas = Array.isArray(w.clinicas)
            ? w.clinicas.map(c => c.nombre).join(' ')
            : '';
      return (
        safe(w.login).includes(q)      ||
        safe(w.nombre).includes(q)     ||
        safe(w.rol).includes(q)        ||
        safe(clinicas).includes(q)
      );
    });

    renderRows(filtered);
  });
// #endregion
  


// CUD de Trabajadores — sólo si puede editar
if (canEdit) {
  //#region  Memorias
  let clinicsList = [];
  let trabajadorId = getCurretTrabajadorId();
  let selectedClinics = [];
  //#endregion
  
  // #region Funciones auxiliares
  function generatePassword(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~%¬&/()=?¿@!ºª';
    let pwd = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      pwd += chars.charAt(randomIndex);
    }
    return pwd;
  }
  //#endregion

  //#region carga de datos generales
  
  function loadClinics() {
    return $.getJSON(
      `${API_BASE_URL}Trabajador/GetAllClinicasByTrabajador`,
      { id: trabajadorId }
    )
    .done(data => { clinicsList = data; })
    .fail(err => console.error('Error cargando clínicas', err));
  }

  $(function() {

    // 1) Obtén la cadena de roles y conviértela en array
    const rolesCsv = getRoles();
    const rolesArray = rolesCsv.split(',').map(r => r.trim()).filter(r => r);

    // 2) Selecciona el <select> y vacíalo
    const $rolesSelect = $('#workerCargo').empty();

    // 3) Inyecta cada rol como <option>
    rolesArray.forEach(role => {
      $rolesSelect.append(
        `<option value="${role}">${role}</option>`
      );
    });

    // … resto de tu init …
  });

//#endregion  



  //desplegable clinica
  function fillClinicsDropdown() {
    const $drop = $('#workerClinicaDropdown').empty();
    clinicsList.forEach(c => {
      const active = selectedClinics.includes(c.id) ? ' active' : '';
      $drop.append(`
        <li class="list-group-item${active}" 
            data-id="${c.id}">
          ${c.nombre}
        </li>
      `);
    });
  }

  // 2) Dibujar los tags arriba del input
  function renderClinicTags() {
    const $tags = $('#tagsContainer').empty();
    selectedClinics.forEach(id => {
      const clinic = clinicsList.find(c => c.id === id);
      if (!clinic) return;
      $tags.append(`
        <span class="tag-item">
          ${clinic.nombre}
          <span class="remove-tag" data-id="${id}">&times;</span>
        </span>
      `);
    });
  }

  // 3) Toggle dropdown al hacer clic en el input
  $('#workerClinicaInput').on('click', () => {
    $('#workerClinicaDropdown').toggle();
  });

  // 4) Click en cada <li> para seleccionar/deseleccionar
  $('#workerClinicaDropdown').on('click', 'li', function(){
    const id = Number($(this).data('id'));
    if (selectedClinics.includes(id)) {
      // quitar
      selectedClinics = selectedClinics.filter(x => x !== id);
    } else {
      // añadir
      selectedClinics.push(id);
    }
    fillClinicsDropdown();
    renderClinicTags();
  });

  // 5) Quitar tag con la “×”
  $('#tagsContainer').on('click', '.remove-tag', function(){
    const id = Number($(this).data('id'));
    selectedClinics = selectedClinics.filter(x => x !== id);
    fillClinicsDropdown();
    renderClinicTags();
  });

  // 6) Cerrar dropdown al hacer clic fuera
  $(document).on('click', function(e){
    if (!$(e.target).closest('.select-tags').length) {
      $('#workerClinicaDropdown').hide();
    }
  });

  // 7) Al abrir modal “Nuevo”, reinicia tus variables y pinta
  $('#btnAddWorker').on('click', () => {
    selectedClinics = [];            // vacío para alta
    fillClinicsDropdown();           // carga todas
    renderClinicTags();               // pinta 0 tags
    $('#workerClinicaDropdown').hide();
    $form.trigger('reset');
    $('#workerId').val('');
    $('#workerModalTitle').text('Nuevo trabajador');
    modal.show();
  });

  //fin desplegable clinica
  // --------------------------------------------------------------------------
  // Handlers de eventos
  // --------------------------------------------------------------------------
  
  /**
   * Al hacer clic en el botón de generar contraseña, crea una nueva
   * y la inyecta en el input correspondiente.
   */
  $('#btnGeneratePassword').on('click', () => {
    const pwd = generatePassword(10);         // longitud personalizable
    $('#workerPassword').val(pwd);
  });

  /**
   * Al hacer clic en "Nuevo trabajador":
   * - Resetea el formulario
   * - Pone el modo "alta"
   * - Rellena el select de clínicas
   * - Abre el modal
   */
  $('#btnAddWorker').on('click', () => {
    // Limpia todos los campos
    $form.trigger('reset');
    // Quita cualquier ID previo (modo alta)
    $('#workerId').val('');
    // Título del modal
    $('#workerModalTitle').text('Nuevo trabajador');
    // Mostrar modal
    modal.show();
  });

  /**
   * Al enviar el formulario:
   * - Recolecta datos de los inputs
   * - Envía POST a la API para crear el trabajador
   * - Cierra modal y recarga la tabla en caso de éxito
   */
  $form.on('submit', function(e) {
    e.preventDefault();

  const dto = {
    login:       $('#workerNombre').val().trim().toLowerCase(),
    password:    $('#workerPassword').val().trim(),           // obligatorio
    nombre:      $('#workerNombre').val().trim(),            // si puedes añadir apellidos al backend, haz: nombre + ' ' + apellidos
    rol:         getNumberOfRole($('#workerCargo').val()),            // convierte a número
    clinicasId:  selectedClinics.map(id => Number(id))      // array de IDs
  };

    debugger;

    $.ajax({
      url: `${API_BASE_URL}Trabajador/CreateTrabajador`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(dto)
    })
    .done(() => {
      modal.hide();      // cierra modal
      loadWorkers();     // recarga tabla
    })
    .fail(xhr => alert('Error guardando: ' + xhr.status));
  });

  // --------------------------------------------------------------------------
  // Inicialización
  // --------------------------------------------------------------------------
  loadClinics();







  //eliminar trabajador
  $(function(){
    const $tbody = $("#workersTable tbody");

    // 1) Delegamos el click sobre el botón de eliminar
    $tbody.on('click', '.btn-del', function(){
    const $tr = $(this).closest("tr");
    const id  = $tr.attr("data-id"); 

      // 2) Confirmación
      if (!confirm('¿Seguro que quieres eliminar este trabajador?'+ id)) {
        return;
      }

      // 3) Llamada AJAX DELETE
  $.ajax({
    url: `${API_BASE_URL}Trabajador/ActivarDesactivarTrabajador`
         + `?id=${encodeURIComponent(id)}&activo=false`,
    method: 'DELETE'
    // ni data ni contentType
  })
      .done(() => {
        // 4) Recarga la lista
        loadWorkers();
      })
      .fail(xhr => {
        console.error('Error eliminando:', xhr.responseText || xhr.status);
        alert('No se pudo eliminar. Código: ' + xhr.status);
      });
    });
  });


}


  /* ---------- 6 · init ----------- */
  applyRoleFilter();   // oculta elementos con data-role
  loadWorkers();
});
