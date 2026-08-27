const calendarDays = document.getElementById("calendar-days");
const currentMonthElement = document.getElementById("current-month");

const previousButton = document.getElementById("prev-month");
const nextButton = document.getElementById("next-month");

const weeksElement = document.getElementById("weeks");
const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");


// ==========================================
// FECHAS IMPORTANTES
// ==========================================

const startDate = new Date(2026, 7, 22);
const endDate = new Date(2026, 10, 14, 18, 0, 0);


// Mes que estamos visualizando
let currentMonth = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    1
);


// ==========================================
// NOMBRES DE LOS MESES
// ==========================================

const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
];


// ==========================================
// GENERAR CALENDARIO
// ==========================================

function generateCalendar() {

    calendarDays.innerHTML = "";

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    currentMonthElement.textContent =
        `${monthNames[month]} ${year}`;


    // Primer día del mes
    const firstDay = new Date(year, month, 1);

    // Último día del mes
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();


    // Día de la semana del primer día
    let startingDay = firstDay.getDay();

    // JS considera domingo = 0.
    // Nosotros queremos lunes = 0.
    startingDay = startingDay === 0 ? 6 : startingDay - 1;


    // ==========================================
    // ESPACIOS ANTES DEL PRIMER DÍA
    // ==========================================

    for (let i = 0; i < startingDay; i++) {

        const emptyDay = document.createElement("div");

        calendarDays.appendChild(emptyDay);
    }


    // ==========================================
    // CREAR DÍAS
    // ==========================================

    for (let day = 1; day <= daysInMonth; day++) {

        const date = new Date(year, month, day);

        const dayButton = document.createElement("button");

        dayButton.type = "button";
        dayButton.textContent = day;


        // --------------------------------------
        // ¿ES UN DÍA PASADO?
        // --------------------------------------

        if (date < startDate) {
            dayButton.classList.add("disabled");
            dayButton.disabled = true;
        }


        // --------------------------------------
        // ¿ES LA FECHA LÍMITE?
        // --------------------------------------

        if (
            date.getFullYear() === endDate.getFullYear() &&
            date.getMonth() === endDate.getMonth() &&
            date.getDate() === endDate.getDate()
        ) {
            dayButton.classList.add("limit");
        }


        // --------------------------------------
        // ¿ESTÁ DESPUÉS DE LA FECHA LÍMITE?
        // --------------------------------------

        if (date > endDate) {
            dayButton.classList.add("disabled");
            dayButton.disabled = true;
        }


        // --------------------------------------
        // ¿ES HOY?
        // --------------------------------------

        const today = new Date();

        if (isSameDay(date, today)) {
            dayButton.classList.add("today");
        }


        calendarDays.appendChild(dayButton);
    }


    // ==========================================
    // CONTROLAR BOTONES DE NAVEGACIÓN
    // ==========================================

    const currentYear = currentMonth.getFullYear();
    const currentMonthNumber = currentMonth.getMonth();

    const startMonth = startDate.getMonth();
    const startYear = startDate.getFullYear();

    const endMonth = endDate.getMonth();
    const endYear = endDate.getFullYear();


    // No permitir ir antes de agosto
    if (
        currentYear === startYear &&
        currentMonthNumber === startMonth
    ) {
        previousButton.disabled = true;
    } else {
        previousButton.disabled = false;
    }


    // No permitir ir después de noviembre
    if (
        currentYear === endYear &&
        currentMonthNumber === endMonth
    ) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
}


// ==========================================
// COMPARAR DOS FECHAS
// ==========================================

function isSameDay(date1, date2) {

    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}


// ==========================================
// MES ANTERIOR
// ==========================================

previousButton.addEventListener("click", () => {

    currentMonth.setMonth(currentMonth.getMonth() - 1);

    generateCalendar();
});


// ==========================================
// MES SIGUIENTE
// ==========================================

nextButton.addEventListener("click", () => {

    currentMonth.setMonth(currentMonth.getMonth() + 1);

    generateCalendar();
});


// ==========================================
// CONTADOR
// ==========================================

function updateCountdown() {

    const now = new Date();

    let difference = endDate - now;


    // Si ya llegamos a la fecha límite
    if (difference <= 0) {

        weeksElement.textContent = "00";
        daysElement.textContent = "00";
        hoursElement.textContent = "00";
        minutesElement.textContent = "00";
        secondsElement.textContent = "00";

        return;
    }


    const totalSeconds = Math.floor(difference / 1000);


    const weeks = Math.floor(
        totalSeconds / (7 * 24 * 60 * 60)
    );

    const remainingAfterWeeks =
        totalSeconds % (7 * 24 * 60 * 60);


    const days = Math.floor(
        remainingAfterWeeks / (24 * 60 * 60)
    );

    const remainingAfterDays =
        remainingAfterWeeks % (24 * 60 * 60);


    const hours = Math.floor(
        remainingAfterDays / (60 * 60)
    );

    const remainingAfterHours =
        remainingAfterDays % (60 * 60);


    const minutes = Math.floor(
        remainingAfterHours / 60
    );

    const seconds =
        remainingAfterHours % 60;


    weeksElement.textContent = formatNumber(weeks);
    daysElement.textContent = formatNumber(days);
    hoursElement.textContent = formatNumber(hours);
    minutesElement.textContent = formatNumber(minutes);
    secondsElement.textContent = formatNumber(seconds);
}


// ==========================================
// AGREGAR UN 0 DELANTE
// ==========================================

function formatNumber(number) {

    return String(number).padStart(2, "0");
}


// ==========================================
// INICIAR
// ==========================================

generateCalendar();
updateCountdown();

setInterval(updateCountdown, 1000);

// ==========================================
// lista de regalo
// ==========================================

const abrirLista = document.getElementById("abrirLista");
const cerrarLista = document.getElementById("cerrarLista");
const modalRegalos = document.getElementById("modalRegalos");


/* Abrir */
abrirLista.addEventListener("click", function () {
    modalRegalos.classList.add("mostrar");
});


/* Cerrar con la X */
cerrarLista.addEventListener("click", function () {
    modalRegalos.classList.remove("mostrar");
});


/* Cerrar haciendo clic fuera de la ventana */
modalRegalos.addEventListener("click", function (evento) {

    if (evento.target === modalRegalos) {
        modalRegalos.classList.remove("mostrar");
    }

});
const abrirEncuesta = document.getElementById("abrirEncuesta");
const cerrarEncuesta = document.getElementById("cerrarEncuesta");
const modalEncuesta = document.getElementById("modalEncuesta");


/* ABRIR MODAL */

abrirEncuesta.addEventListener("click", function () {

    modalEncuesta.classList.add("mostrar");

});


/* CERRAR CON LA X */

cerrarEncuesta.addEventListener("click", function () {

    modalEncuesta.classList.remove("mostrar");

});


/* CERRAR AL HACER CLIC FUERA */

modalEncuesta.addEventListener("click", function (evento) {

    if (evento.target === modalEncuesta) {

        modalEncuesta.classList.remove("mostrar");

    }

});
