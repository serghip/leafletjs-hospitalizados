//LEAFLETJS
//Declaracion de mapa con coordenadas en buenos aires, zoom:6
var map = L.map('map').
  setView([-37.250, -60.029],
    5);
//capas de OPENSTREETMAP con uso de coordenadas anteriores
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
//Control de escala
L.control.scale().addTo(map);
//Marcadores y popups = linea 125


//Redireccion filtro hospital
document.getElementById('select-location-hospital').addEventListener('change', function (e) {
  document.getElementById('inicialHospital').style.display = "none";
  let coords = e.target.value.split(",");
  map.flyTo(coords, 14);
});
//Redireccion filtro paciente
document.getElementById('select-location-paciente').addEventListener('change', function (e) {
  document.getElementById('inicialPaciente').style.display = "none";
  let coords = e.target.value.split(",");
  map.flyTo(coords, 14);
});
//Redireccion table pacientes
function clickTable(event) {
  var hospLat = event.target.parentNode.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML;
  var hospLong = event.target.parentNode.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML;
  let coords= (hospLat + ', ' + hospLong);
  coords= coords.split(",");
  map.flyTo(coords,14)
}


//JQUERY
$(function () {
  // URI llama a /data
  // /data enlazado a ./routes/index
  // ./routes/index declara funcion GET con reslutado res.json(pacientes)
  // res.json(pacientes) donde pacientes se define como ../data.json
  // ../data.json es el contenido json
  const URIDATA = '/data';
  const URIHOSPITAL = '/data-hospital';

  //Ajax solicitud base de datos
  $(document).ready(function () {
    //solicitud pacientes
    $.ajax({
      url: URIDATA,
      success: function (pacientes) {
        //dropdown-menu pacientes
        let locationPaciente = $('#locationPaciente');
        pacientes.forEach(paciente => {
          locationPaciente.append(`
              <option class="paciente" value="${paciente.hospital}">${paciente.apeynom}</option>
            `);
        });
        //table pacientes
        let tablePaciente = $('#tablePaciente');
        pacientes.forEach(paciente => {
          tablePaciente.append(`
            <tr class='rowPaciente'>
                <td class='apeynom'>${paciente.apeynom}</td>
                <td class='hospital'>${paciente.hospital}</td>
                <td class='lat'></td>
                <td class='long'></td> 
                <td>${paciente.ing}</td>
                <td>${paciente.egr}</td>
                <td>${paciente.estado}</td>
            </tr>
            `);
        });
      }
    });


    //solicitud hospitales
    $.ajax({
      url: URIHOSPITAL,
      success: function (hospitales) {
        //dropdown-menu hospitales
        let locationHospital = $('#locationHospital');
        hospitales.forEach(hospital => {
          locationHospital.append(`
              <option value="${hospital.lat}, ${hospital.long}">${hospital.descripcion}</option>
            `);
        });
        //dropdown-menu pacientes
        let optionPacientes = $('.paciente');
        let acumPaciente=$('.paciente').length;
        for (var i = 0; i < acumPaciente; i++){
          let current = optionPacientes[i].value;
          hospitales.forEach(hospital => {
            if (hospital.descripcion == current){
              let lat= hospital.lat;
              let long= hospital.long;
              let coord= (lat + ', ' + long);
              optionPacientes[i].value = coord;
            };
          });
          };
        //table pacientes
        let tdHospitales = $('.hospital');
        let tdLat = $('.lat');
        let tdLong = $('.long');
        let acumHospital= $('.hospital').length;
        for (var i = 0; i < acumHospital; i++) {
          var current= tdHospitales[i].innerHTML;
          hospitales.forEach(hospital => {
            if (hospital.descripcion == current){
              tdLat[i].innerHTML= hospital.lat;
              tdLong[i].innerHTML= hospital.long;
            };
          });
        };
        //grupo de marcadores y popups
        var markers = L.markerClusterGroup();
        let tdPacientes = $('.rowPaciente');
        for (var i = 0; i < acumPaciente; i++){
          let apeynom = tdPacientes[i].firstChild.nextSibling.innerHTML;
          let hospital = tdPacientes[i].firstChild.nextSibling.nextSibling.nextSibling.innerHTML;
          let lat = tdPacientes[i].firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML;
          let long = tdPacientes[i].firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML;
          var popup = L.responsivePopup().setContent("<table><thead><tr><th>Apellido y nombre</th><th>Hospital</th></tr></thead><tbody><tr><td>" + apeynom + "</td><td>" + hospital + "</td></tr></tbody>");
          markers.addLayer(L.marker([lat, long]).bindPopup(popup));
        }
        map.addLayer(markers);
      }//fin success
    })//fin solicitud
    
  });
});

