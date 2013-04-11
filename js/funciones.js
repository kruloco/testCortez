$(function() {

// Objeto para encapsular las funciones
    var Login = {};
    var celular = {'estado': false, 'conexion': '', 'plataforma': ''};
    var servidor = "http://colectivo.site90.net/controladorMail.php";

    (function(app) {

        // Función principal autoejecutable
        app.init = function() {
            document.addEventListener('deviceready', app.bindingsPG, false);
        };

        //Inicializa todos los EVENTOS de la página
        app.bindingsPG = function() {
            //Al tocar el botón DESACTIVAR
            $("#login-form #btnSubmit").on('click', function(e) {
                if (celular.estado === true)
                {
                    app.enviarFormulario();
                }
                else
                {
                    app.mostrarModal("No hay conexión a Internet", "Error");
                }
            });

            //Al tocar el botón SALIR
            $("#btnSalir").on('click', function() {
                app.cerrarAplicacion();
            });

            celular.conexion = app.getConexion();

            if ((celular.conexion !== 'Ninguna') && (celular.conexion !== 'Desconocida')) {
                celular.estado = true;
            }
            celular.plataforma = device.platform;
            if ((celular.plataforma === "Android") || (celular.plataforma === "3.0.0.100")) {
                document.addEventListener("online", function() {
                    celular.estado = true;
                }, false);
                document.addEventListener("offline", function() {
                    celular.estado = false;
                }, false);
            }
        };

        //Devuelve el tipo de conexion del dispositivo
        app.getConexion = function() {
            var estadoRed = navigator.connection.type;

            var estados = {};
            estados[Connection.UNKNOWN] = 'Desconocida';
            estados[Connection.ETHERNET] = 'Ethernet';
            estados[Connection.WIFI] = 'WiFi';
            estados[Connection.CELL_2G] = '2G';
            estados[Connection.CELL_3G] = '3G';
            estados[Connection.CELL_4G] = '4G';
            estados[Connection.NONE] = 'Ninguna';

            return estados[estadoRed];
        };

        app.cerrarAplicacion = function() {
            navigator.app.exitApp();
        };

        app.enviarFormulario = function() {
            var form = $('#login-form'),
                    inputs = form.find('input'),
                    camposValidados = true;
//Verifico que no haya inputs vacíos
            $.each(inputs, function(i, el) {
                if (el.value === '')
                {
                    camposValidados = false;
                    return;
                }
            });
            if (camposValidados) {
                $.ajax({
                    url: servidor,
                    dataType: 'jsonp',
                    data: form.serialize(),
                    success: function(data) {
                        app.mostrarModal(data.msj, data.status);
                        form[0].reset();
                    },
                    error: function(data) {
                        app.mostrarModal('Los Datos no fueron enviados', 'Error');
                        console.debug(data);
                    }
                });
            }
        };

        //Recibe una cadena de teto y la muestra en un Modal de Error
        app.mostrarModal = function(texto, titulo) {
            $("#lnkDialog").click();
            $("#dialogText").html(texto);
            $("#dialogTitle").html(titulo);
        };

        //Ejecuto función principal
        app.init();

    })(Login);
});
