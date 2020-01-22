// Objeto que almacena los parametros iniciales para elaborar el selector de horas
const botonGuardar = document.getElementById('botonHorario');
var arr;

var opcionesSelector = {

    days: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
    hours: '8:00AM-5:00PM',
    fontFamily: 'Roboto',
    fontColor: 'black',
    fontWeight: '200',
    fontSize: '12px',
    hoverColor: '#44d9eb',
    selectionColor: '#00bcd4',
    headerBackgroundColor: 'transparent',
    onSelected: function () {},
    onRemoved: function () {}

}

//Llamado a la funcion constructora del selector, y se le pasa como parametro el objeto con la informacion inicial
$('#selectorHoras').weekly_schedule(opcionesSelector);

$('.schedule').on('selectionmade', function () {
    console.log("Selection Made");
}).on('selectionremoved', function () {
    console.log("Selection Removed");
});

function guardarHorario() {

    var arreglo = $('#selectorHoras').weekly_schedule("getSelectedHour");

    var arregloString = new Array(0);

    for (var i = 0; i <= 5; i++) {
        arregloString.push(new Array(0))
    };

    for (i = 0; i <= 5; i++) {
        for (var j = 0; !(arreglo[i][j] === undefined); j++) {
            arregloString[i].push(`${arreglo[i][j].classList.item(1)} ${arreglo[i][j].classList.item(2)}`);
        }
    }

    return JSON.stringify(arregloString);
}

function mostrarHorario(horario) {

    horario = JSON.parse(horario);

    var seleccionados = document.getElementsByClassName('selected');
    var longitud = seleccionados.length;

    for (var i = 0; i < longitud; i++) {
        seleccionados.item(0).classList.remove('selected');
    }

    for (i = 0; i <= 5; i++) {
        for (var j = 0; !(horario[i][j] === undefined); j++) {
            document.getElementById(`day_${opcionesSelector.days[i]}_hour_${horario[i][j]}`).classList.add('selected');
        }
    }

}
