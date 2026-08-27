const SUPABASE_URL = "https://msfsbrexdahbvetwjgtq.supabase.co";
const SUPABASE_KEY = "sb_publishable_yMn4YGZCYDzH0Hnli9HtaQ_CPKsN2MX";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Supabase conectado correctamente");

// ======================================
// FORMULARIO DE CONFIRMACIÓN
// ======================================

const formulario = document.getElementById("formularioAsistencia");

formulario.addEventListener("submit", async (event) => {

    // Evitar que el formulario recargue la página
    event.preventDefault();


    // ======================================
    // OBTENER NOMBRE
    // ======================================

    const nombre = document
        .getElementById("nombre")
        .value
        .trim();

    if (!nombre) {
        alert("Por favor, escribe tu nombre.");
        return;
    }


    // ======================================
    // OBTENER ASISTENCIA
    // ======================================

    const ceremonia = document.querySelector(
        'input[name="asistencia"][value="ceremonia"]'
    ).checked;

    const recepcion = document.querySelector(
        'input[name="asistencia"][value="recepcion"]'
    ).checked;


    // ======================================
    // COMPROBAR ASISTENCIA
    // ======================================

    if (!ceremonia && !recepcion) {

        alert(
            "Por favor, selecciona al menos una opción de asistencia."
        );

        return;
    }


    // ======================================
    // LÍMITES
    // ======================================

    const limites = {

        "marquez orozco": 4,
        "polo orozco": 5,
        "barranco orozco": 4,
        "orozco feria": 3,
        "romero franco": 2,
        "bolivar rodrigue": 2,
        "cantillo jimenez": 1,
        "jimenez ramirez": 1,
        "herrera jimenez": 2,
        "cadrasco arevalo": 2,
        "castro jimenez": 2,
        "jimenez pedrosa": 2,
        "jimenez molina": 2,
        "barranco gonzales": 2,
        "perez barranco": 2,
        "jimenez alonzo": 2,
        "orozco cantillo": 4,
        "serrano jimenez": 2,
        "cantillo rangel": 1,
        "familia aconcha mora": 2,
        "cueto reales": 2,
        "cantillo blanco": 2,
        "redondo cantillo": 2,
        "jesus granado": 1,
        "orozco rebolledo": 2

    };


    // ======================================
    // NORMALIZAR TEXTO
    // ======================================

    function normalizarTexto(texto) {

        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ")
            .trim();

    }


    // ======================================
    // NORMALIZAR NOMBRE
    // ======================================

    const nombreNormalizado = normalizarTexto(nombre);

    const partes = nombreNormalizado.split(" ");


    // ======================================
    // DETECTAR GRUPO
    // ======================================

    let grupo = null;


    /*
     * Algunos grupos no siguen la regla normal
     * de "primer nombre + dos apellidos".
     *
     * Los comprobamos primero.
     */


    // --------------------------------------
    // FAMILIA ACONCHA MORA
    // --------------------------------------

    if (
        nombreNormalizado.includes("familia aconcha mora")
    ) {

        grupo = "familia aconcha mora";

    }


    // --------------------------------------
    // JESUS GRANADO
    // --------------------------------------

    else if (
        nombreNormalizado.includes("jesus granado")
    ) {

        grupo = "jesus granado";

    }


    // --------------------------------------
    // RESTO DE GRUPOS
    // --------------------------------------

    else if (partes.length >= 3) {

        /*
         * Tomamos las últimas dos palabras
         * como apellidos.
         *
         * Ejemplo:
         *
         * Juan Marquez Orozco
         *
         * partes:
         * ["juan", "marquez", "orozco"]
         *
         * grupo:
         * "marquez orozco"
         */

        grupo = partes
            .slice(-2)
            .join(" ");

    }


    console.log("--------------------------------");
    console.log("Nombre escrito:", nombre);
    console.log("Nombre normalizado:", nombreNormalizado);
    console.log("Grupo detectado:", grupo);
    console.log("--------------------------------");


    // ======================================
    // COMPROBAR SI EL GRUPO TIENE LÍMITE
    // ======================================

    if (grupo && limites[grupo] !== undefined) {

        const limite = limites[grupo];


        console.log("Límite permitido:", limite);


        // ======================================
        // CONSULTAR CUÁNTAS PERSONAS HAY
        // ======================================

        const {
            count,
            error: errorConsulta
        } = await supabaseClient

            .from("confirmaciones")

            .select("id", {
                count: "exact",
                head: true
            })

            .ilike(
                "nombre",
                `%${grupo}`
            );


        // ======================================
        // ERROR DE CONSULTA
        // ======================================

        if (errorConsulta) {

            console.error(
                "Error consultando Supabase:",
                errorConsulta
            );

            alert(
                "No se pudo comprobar la disponibilidad de cupos. " +
                "Por favor, inténtalo nuevamente."
            );

            return;
        }


        // ======================================
        // ASEGURAR QUE COUNT SEA UN NÚMERO
        // ======================================

        const cantidadRegistrada = count ?? 0;


        console.log(
            "Personas registradas:",
            cantidadRegistrada
        );

        console.log(
            "Cupos disponibles:",
            limite - cantidadRegistrada
        );


        // ======================================
        // CUPOS LLENOS
        // ======================================

        if (cantidadRegistrada >= limite) {

            alert(
                `¡Cupos llenos!\n\n` +
                `El grupo ${grupo.toUpperCase()} ` +
                `ya alcanzó el máximo de ${limite} persona` +
                `${limite !== 1 ? "s" : ""}.`
            );

            return;
        }


        // ======================================
        // HAY CUPO
        // ======================================

        console.log(
            `Hay ${limite - cantidadRegistrada} cupo(s) disponible(s).`
        );

    }


    // ======================================
    // SI EL GRUPO NO ESTÁ EN LA LISTA
    // ======================================

    else {

        console.log(
            "El nombre no pertenece a un grupo con límite."
        );

    }


    // ======================================
    // GUARDAR EN SUPABASE
    // ======================================

    const {
        data,
        error
    } = await supabaseClient

        .from("confirmaciones")

        .insert([
            {
                nombre: nombre,
                ceremonia: ceremonia,
                recepcion: recepcion
            }
        ])

        .select();


    // ======================================
    // ERROR AL GUARDAR
    // ======================================

    if (error) {

        console.error(
            "Error al guardar:",
            error
        );

        alert(
            "Ha ocurrido un error al guardar tu confirmación. " +
            "Por favor, inténtalo nuevamente."
        );

        return;
    }


    // ======================================
    // CONFIRMACIÓN CORRECTA
    // ======================================

    console.log(
        "Confirmación guardada:",
        data
    );


    alert(
        "¡Gracias por confirmar tu asistencia! ❤️"
    );


    // ======================================
    // LIMPIAR FORMULARIO
    // ======================================

    formulario.reset();

});
