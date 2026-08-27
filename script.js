// ======================================================
// CALCULADORA DE INTEGRALES
// ======================================================


// ------------------------------------------------------
// EVALUAR FUNCIÓN
// ------------------------------------------------------

function evaluarFuncion(funcion, x) {

    try {

        return math.evaluate(funcion, {
            x: x
        });

    } catch (error) {

        throw new Error(
            "No se pudo evaluar la función."
        );

    }

}


// ------------------------------------------------------
// INTEGRACIÓN NUMÉRICA - REGLA DE SIMPSON
// ------------------------------------------------------

function simpson(funcion, a, b, n = 1000) {

    // Simpson necesita un número par de intervalos

    if (n % 2 !== 0) {
        n++;
    }

    const h = (b - a) / n;

    let suma = 0;

    for (let i = 0; i <= n; i++) {

        const x = a + i * h;

        const fx = evaluarFuncion(funcion, x);

        if (i === 0 || i === n) {

            suma += fx;

        } else if (i % 2 === 0) {

            suma += 2 * fx;

        } else {

            suma += 4 * fx;

        }

    }

    return (h / 3) * suma;

}


// ------------------------------------------------------
// CALCULAR INTEGRAL
// ------------------------------------------------------

function calcularIntegral() {

    const funcion =
        document.getElementById("funcion").value.trim();

    const a =
        parseFloat(
            document.getElementById("limiteInferior").value
        );

    const b =
        parseFloat(
            document.getElementById("limiteSuperior").value
        );


    // VALIDACIONES

    if (!funcion) {

        mostrarError(
            "Por favor introduce una función."
        );

        return;
    }


    if (isNaN(a) || isNaN(b)) {

        mostrarError(
            "Debes introducir los dos límites."
        );

        return;
    }


    if (a === b) {

        mostrarResultado(
            funcion,
            a,
            b,
            0
        );

        graficarFuncion();

        return;
    }


    try {

        const resultado =
            simpson(funcion, a, b, 2000);


        mostrarResultado(
            funcion,
            a,
            b,
            resultado
        );


        graficarFuncion();

    } catch (error) {

        mostrarError(
            "La función no es válida. Revisa la expresión."
        );

    }

}


// ------------------------------------------------------
// MOSTRAR RESULTADO
// ------------------------------------------------------

function mostrarResultado(
    funcion,
    a,
    b,
    resultado
) {

    const resultadoDiv =
        document.getElementById("resultado");

    const procedimiento =
        document.getElementById("procedimiento");


    resultadoDiv.innerHTML = `

        <div>
            <strong>Integral definida:</strong>
        </div>

        <div style="font-size:28px;margin:15px 0;">
            ∫<sub>${a}</sub><sup>${b}</sup>
            (${funcion}) dx
        </div>

        <div class="numero">
            ${resultado.toFixed(8)}
        </div>

    `;


    procedimiento.innerHTML = `

        <strong>Información del cálculo</strong>

        <br><br>

        Función:

        <strong>
            f(x) = ${funcion}
        </strong>

        <br>

        Límite inferior:

        <strong>
            ${a}
        </strong>

        <br>

        Límite superior:

        <strong>
            ${b}
        </strong>

        <br><br>

        Método utilizado:

        <strong>
            Regla de Simpson
        </strong>

        <br>

        Resultado aproximado:

        <strong>
            ${resultado.toFixed(8)}
        </strong>

    `;

}


// ------------------------------------------------------
// MOSTRAR ERROR
// ------------------------------------------------------

function mostrarError(mensaje) {

    const resultadoDiv =
        document.getElementById("resultado");

    resultadoDiv.innerHTML = `

        <div style="color:#dc2626;font-weight:bold;">
            ⚠️ ${mensaje}
        </div>

    `;

}


// ------------------------------------------------------
// GRAFICAR
// ------------------------------------------------------

function graficarFuncion() {

    const funcion =
        document.getElementById("funcion").value.trim();

    const a =
        parseFloat(
            document.getElementById("limiteInferior").value
        );

    const b =
        parseFloat(
            document.getElementById("limiteSuperior").value
        );


    if (!funcion || isNaN(a) || isNaN(b)) {

        mostrarError(
            "Introduce una función y límites válidos."
        );

        return;
    }


    try {

        // ------------------------------------------------
        // RANGO DE VISUALIZACIÓN
        // ------------------------------------------------

        const margen =
            Math.abs(b - a) * 0.15 || 1;

        const inicio =
            Math.min(a, b) - margen;

        const fin =
            Math.max(a, b) + margen;


        const cantidad = 500;

        const x = [];

        const y = [];


        for (let i = 0; i < cantidad; i++) {

            const valor =
                inicio +
                (fin - inicio) *
                i /
                (cantidad - 1);

            x.push(valor);

            try {

                const resultado =
                    evaluarFuncion(funcion, valor);

                if (
                    typeof resultado === "number" &&
                    isFinite(resultado)
                ) {

                    y.push(resultado);

                } else {

                    y.push(null);

                }

            } catch {

                y.push(null);

            }

        }


        // ------------------------------------------------
        // ÁREA BAJO LA CURVA
        // ------------------------------------------------

        const xArea = [];
        const yArea = [];


        const pasosArea = 300;

        for (let i = 0; i <= pasosArea; i++) {

            const valor =
                a +
                (b - a) *
                i /
                pasosArea;

            xArea.push(valor);

            try {

                yArea.push(
                    evaluarFuncion(funcion, valor)
                );

            } catch {

                yArea.push(null);

            }

        }


        // ------------------------------------------------
        // TRAZA DE LA FUNCIÓN
        // ------------------------------------------------

        const funcionTrace = {

            x: x,

            y: y,

            mode: "lines",

            name: "f(x) = " + funcion,

            line: {
                width: 3
            }

        };


        // ------------------------------------------------
        // ÁREA
        // ------------------------------------------------

        const areaTrace = {

            x: xArea,

            y: yArea,

            fill: "tozeroy",

            mode: "lines",

            name: "Área de integración",

            opacity: 0.35

        };


        // ------------------------------------------------
        // LÍNEA EJE X
        // ------------------------------------------------

        const ejeX = {

            x: [inicio, fin],

            y: [0, 0],

            mode: "lines",

            name: "Eje X",

            line: {
                width: 1
            }

        };


        // ------------------------------------------------
        // CONFIGURACIÓN
        // ------------------------------------------------

        const layout = {

            title: {
                text:
                    "Gráfica de f(x) = " + funcion
            },

            xaxis: {
                title: "x",
                zeroline: true
            },

            yaxis: {
                title: "f(x)",
                zeroline: true
            },

            hovermode: "x unified",

            legend: {
                orientation: "h"
            },

            margin: {
                l: 60,
                r: 30,
                t: 70,
                b: 60
            }

        };


        const config = {

            responsive: true,

            displaylogo: false,

            modeBarButtonsToRemove: [
                "lasso2d",
                "select2d"
            ]

        };


        Plotly.newPlot(

            "grafica",

            [
                areaTrace,
                funcionTrace,
                ejeX
            ],

            layout,

            config

        );

    } catch (error) {

        mostrarError(
            "No fue posible generar la gráfica."
        );

    }

}


// ------------------------------------------------------
// CARGAR EJEMPLO
// ------------------------------------------------------

function cargarEjemplo(
    funcion,
    a,
    b
) {

    document.getElementById(
        "funcion"
    ).value = funcion;


    document.getElementById(
        "limiteInferior"
    ).value = a;


    document.getElementById(
        "limiteSuperior"
    ).value = b;


    calcularIntegral();

}


// ------------------------------------------------------
// LIMPIAR
// ------------------------------------------------------

function limpiarTodo() {

    document.getElementById(
        "funcion"
    ).value = "";


    document.getElementById(
        "limiteInferior"
    ).value = "";


    document.getElementById(
        "limiteSuperior"
    ).value = "";


    document.getElementById(
        "resultado"
    ).innerHTML =

        "Introduce una función y los límites para comenzar.";


    document.getElementById(
        "procedimiento"
    ).innerHTML = "";


    Plotly.purge("grafica");

}
