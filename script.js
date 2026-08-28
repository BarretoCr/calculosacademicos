/* =====================================================
   AYUDAS ACADÉMICAS
   CALCULADORA MATEMÁTICA

   Funciones:
   - Integrales
   - Integrales definidas
   - Derivadas
   - Derivadas de orden superior
   - Gráficas
===================================================== */


/* =====================================================
   VARIABLES
===================================================== */

let herramientaActual = "integral";


/* =====================================================
   CAMBIAR ENTRE INTEGRAL Y DERIVADA
===================================================== */

function mostrarHerramienta(tipo) {

    herramientaActual = tipo;


    const panelIntegral =
        document.getElementById("panelIntegral");

    const panelDerivada =
        document.getElementById("panelDerivada");

    const tabIntegral =
        document.getElementById("tabIntegral");

    const tabDerivada =
        document.getElementById("tabDerivada");


    if (tipo === "integral") {

        panelIntegral.classList.remove("hidden");

        panelDerivada.classList.add("hidden");

        tabIntegral.classList.add("active");

        tabDerivada.classList.remove("active");

    }

    else {

        panelIntegral.classList.add("hidden");

        panelDerivada.classList.remove("hidden");

        tabIntegral.classList.remove("active");

        tabDerivada.classList.add("active");

    }

}


/* =====================================================
   NORMALIZAR FUNCIÓN
===================================================== */

function normalizarFuncion(funcion) {

    let f = funcion.trim();


    /*
       Cambiar algunos símbolos habituales
       a sintaxis compatible.
    */

    f = f.replace(/π/g, "pi");

    f = f.replace(/√/g, "sqrt");

    f = f.replace(/ln/g, "log");


    /*
       sen -> sin
    */

    f = f.replace(/sen/g, "sin");


    /*
       coseno -> cos
    */

    f = f.replace(/coseno/g, "cos");

    f = f.replace(/seno/g, "sin");


    return f;

}


/* =====================================================
   INTEGRAL DEFINIDA NUMÉRICA
   REGLA DE SIMPSON
===================================================== */

function simpson(funcion, a, b, n = 2000) {

    if (n % 2 !== 0) {

        n++;

    }


    const h = (b - a) / n;

    let suma = 0;


    for (let i = 0; i <= n; i++) {

        const x = a + i * h;

        let fx;


        try {

            fx = math.evaluate(
                funcion,
                { x: x }
            );

        }

        catch {

            throw new Error(
                "No se pudo evaluar la función."
            );

        }


        if (
            typeof fx !== "number" ||
            !isFinite(fx)
        ) {

            throw new Error(
                "La función contiene valores no válidos."
            );

        }


        if (
            i === 0 ||
            i === n
        ) {

            suma += fx;

        }

        else if (i % 2 === 0) {

            suma += 2 * fx;

        }

        else {

            suma += 4 * fx;

        }

    }


    return (h / 3) * suma;

}


/* =====================================================
   CALCULAR INTEGRAL
===================================================== */

function calcularIntegral() {

    const campoFuncion =
        document.getElementById(
            "integralFuncion"
        );

    const campoA =
        document.getElementById(
            "integralA"
        );

    const campoB =
        document.getElementById(
            "integralB"
        );


    const funcionOriginal =
        campoFuncion.value.trim();


    const a =
        parseFloat(campoA.value);


    const b =
        parseFloat(campoB.value);


    const resultado =
        document.getElementById(
            "resultadoIntegral"
        );


    const procedimiento =
        document.getElementById(
            "procedimientoIntegral"
        );


    if (!funcionOriginal) {

        resultado.innerHTML = `
            <div class="error-message">
                ⚠️ Introduce una función.
            </div>
        `;

        return;

    }


    if (
        isNaN(a) ||
        isNaN(b)
    ) {

        resultado.innerHTML = `
            <div class="error-message">
                ⚠️ Introduce los límites.
            </div>
        `;

        return;

    }


    const funcion =
        normalizarFuncion(
            funcionOriginal
        );


    try {


        /* ==========================================
           INTEGRACIÓN SIMBÓLICA
        ========================================== */

        let antiderivada = "";


        try {

            antiderivada =
                nerdamer(
                    `integrate(${funcion},x)`
                ).toString();

        }

        catch {

            antiderivada =
                "No disponible simbólicamente";

        }


        /* ==========================================
           INTEGRACIÓN NUMÉRICA
        ========================================== */

        const valor =
            simpson(
                funcion,
                a,
                b,
                2000
            );


        /* ==========================================
           MOSTRAR RESULTADO
        ========================================== */

        resultado.innerHTML = `

            <div>
                <strong>
                    Integral definida
                </strong>
            </div>

            <div class="result-symbolic">

                ∫<sub>${a}</sub><sup>${b}</sup>
                ${escapeHTML(funcionOriginal)} dx

            </div>

            <div class="result-main">

                ${formatearNumero(valor)}

            </div>

        `;


        /* ==========================================
           PROCEDIMIENTO
        ========================================== */

        procedimiento.innerHTML = `

            <h4>
                📐 Información del cálculo
            </h4>

            <p>
                <strong>Función:</strong>
                f(x) = ${escapeHTML(funcionOriginal)}
            </p>

            <p>
                <strong>Límite inferior:</strong>
                ${a}
            </p>

            <p>
                <strong>Límite superior:</strong>
                ${b}
            </p>

            <p>
                <strong>Antiderivada:</strong>
                ${escapeHTML(
                    convertirSalida(antiderivada)
                )}
                + C
            </p>

            <p>
                <strong>Método numérico:</strong>
                Regla de Simpson
            </p>

            <p>
                <strong>Resultado:</strong>
                ${formatearNumero(valor)}
            </p>

        `;


        /* ==========================================
           GRÁFICA
        ========================================== */

        graficarIntegral(
            funcion,
            a,
            b
        );

    }

    catch (error) {

        resultado.innerHTML = `

            <div class="error-message">

                ⚠️ No fue posible calcular la integral.

                <br><br>

                Verifica que la función esté escrita
                correctamente.

            </div>

        `;

        procedimiento.innerHTML = "";

    }

}


/* =====================================================
   CALCULAR DERIVADA
===================================================== */

function calcularDerivada() {

    const campoFuncion =
        document.getElementById(
            "derivadaFuncion"
        );


    const campoOrden =
        document.getElementById(
            "ordenDerivada"
        );


    const funcionOriginal =
        campoFuncion.value.trim();


    const orden =
        parseInt(
            campoOrden.value
        );


    const resultado =
        document.getElementById(
            "resultadoDerivada"
        );


    const procedimiento =
        document.getElementById(
            "procedimientoDerivada"
        );


    if (!funcionOriginal) {

        resultado.innerHTML = `

            <div class="error-message">

                ⚠️ Introduce una función.

            </div>

        `;

        return;

    }


    const funcion =
        normalizarFuncion(
            funcionOriginal
        );


    try {


        /* ==========================================
           PRIMERA DERIVADA
        ========================================== */

        let derivada =
            nerdamer(
                `diff(${funcion},x)`
            );


        let derivadaTexto =
            derivada.toString();


        /* ==========================================
           DERIVADAS DE ORDEN SUPERIOR
        ========================================== */

        for (
            let i = 1;
            i < orden;
            i++
        ) {

            derivada =
                nerdamer(
                    `diff(${derivadaTexto},x)`
                );


            derivadaTexto =
                derivada.toString();

        }


        /* ==========================================
           RESULTADO
        ========================================== */

        const nombreOrden =
            obtenerNombreOrden(
                orden
            );


        resultado.innerHTML = `

            <div>

                <strong>
                    ${nombreOrden} derivada
                </strong>

            </div>


            <div class="result-symbolic">

                d<sup>${orden}</sup>f
                / dx<sup>${orden}</sup>

            </div>


            <div class="result-main">

                ${escapeHTML(
                    convertirSalida(
                        derivadaTexto
                    )
                )}

            </div>

        `;


        /* ==========================================
           PROCEDIMIENTO
        ========================================== */

        procedimiento.innerHTML = `

            <h4>
                📐 Procedimiento
            </h4>


            <p>

                <strong>
                    Función original:
                </strong>

                f(x) =
                ${escapeHTML(funcionOriginal)}

            </p>


            <p>

                <strong>
                    Orden:
                </strong>

                ${orden}

            </p>


            <p>

                <strong>
                    Operación realizada:
                </strong>

                ${obtenerDescripcionDerivada(orden)}

            </p>


            <p>

                <strong>
                    Resultado:
                </strong>

                ${escapeHTML(
                    convertirSalida(
                        derivadaTexto
                    )
                )}

            </p>

        `;


        /* ==========================================
           GRÁFICA
        ========================================== */

        graficarDerivada(
            funcion,
            derivadaTexto,
            orden
        );

    }

    catch (error) {

        console.error(error);


        resultado.innerHTML = `

            <div class="error-message">

                ⚠️ No fue posible calcular la derivada.

                <br><br>

                Revisa que la función esté escrita
                correctamente.

                <br><br>

                Ejemplo:

                <strong>
                    x^3 + 2*x^2 - 5*x + 1
                </strong>

            </div>

        `;


        procedimiento.innerHTML = "";

    }

}


/* =====================================================
   NOMBRE DEL ORDEN
===================================================== */

function obtenerNombreOrden(orden) {

    const nombres = {

        1: "Primera",

        2: "Segunda",

        3: "Tercera",

        4: "Cuarta"

    };


    return nombres[orden] ||
           `${orden}ª`;

}


/* =====================================================
   DESCRIPCIÓN DE DERIVADA
===================================================== */

function obtenerDescripcionDerivada(orden) {

    if (orden === 1) {

        return `
            Se calculó la primera derivada
            respecto a x.
        `;

    }


    return `
        Se calcularon ${orden}
        derivaciones sucesivas respecto a x.
    `;

}


/* =====================================================
   GRÁFICA DE INTEGRAL
===================================================== */

function graficarIntegral(
    funcion,
    a,
    b
) {

    const inicio =
        Math.min(a, b) -
        Math.abs(b - a) * 0.15 -
        0.01;


    const fin =
        Math.max(a, b) +
        Math.abs(b - a) * 0.15 +
        0.01;


    const cantidad = 500;


    const x = [];

    const y = [];


    for (
        let i = 0;
        i < cantidad;
        i++
    ) {

        const valor =
            inicio +
            (fin - inicio) *
            i /
            (cantidad - 1);


        x.push(valor);


        try {

            const resultado =
                math.evaluate(
                    funcion,
                    { x: valor }
                );


            if (
                typeof resultado === "number" &&
                isFinite(resultado)
            ) {

                y.push(resultado);

            }

            else {

                y.push(null);

            }

        }

        catch {

            y.push(null);

        }

    }


    /* ÁREA */

    const xArea = [];

    const yArea = [];


    for (
        let i = 0;
        i <= 300;
        i++
    ) {

        const valor =
            a +
            (b - a) *
            i /
            300;


        xArea.push(valor);


        try {

            yArea.push(
                math.evaluate(
                    funcion,
                    { x: valor }
                )
            );

        }

        catch {

            yArea.push(null);

        }

    }


    const traceFuncion = {

        x: x,

        y: y,

        type: "scatter",

        mode: "lines",

        name: "f(x)",

        line: {

            width: 3

        }

    };


    const traceArea = {

        x: xArea,

        y: yArea,

        type: "scatter",

        mode: "lines",

        fill: "tozeroy",

        name: "Área",

        opacity: 0.35

    };


    const layout = {

        title:
            "Integral y área bajo la curva",

        xaxis: {

            title: "x",

            zeroline: true

        },

        yaxis: {

            title: "f(x)",

            zeroline: true

        },

        hovermode:
            "x unified",

        margin: {

            l: 60,

            r: 30,

            t: 60,

            b: 60

        }

    };


    Plotly.newPlot(

        "grafica",

        [
            traceArea,
            traceFuncion
        ],

        layout,

        {
            responsive: true,
            displaylogo: false
        }

    );


    document.getElementById(
        "graphDescription"
    ).textContent =
        "Función y área de integración";

}


/* =====================================================
   GRÁFICA DE DERIVADA
===================================================== */

function graficarDerivada(
    funcion,
    derivada,
    orden
) {

    const inicio = -10;

    const fin = 10;

    const cantidad = 500;


    const x = [];

    const yFuncion = [];

    const yDerivada = [];


    for (
        let i = 0;
        i < cantidad;
        i++
    ) {

        const valor =
            inicio +
            (fin - inicio) *
            i /
            (cantidad - 1);


        x.push(valor);


        try {

            const f =
                math.evaluate(
                    funcion,
                    { x: valor }
                );


            if (
                typeof f === "number" &&
                isFinite(f)
            ) {

                yFuncion.push(f);

            }

            else {

                yFuncion.push(null);

            }

        }

        catch {

            yFuncion.push(null);

        }


        try {

            const d =
                math.evaluate(
                    derivada,
                    { x: valor }
                );


            if (
                typeof d === "number" &&
                isFinite(d)
            ) {

                yDerivada.push(d);

            }

            else {

                yDerivada.push(null);

            }

        }

        catch {

            yDerivada.push(null);

        }

    }


    const traceFuncion = {

        x: x,

        y: yFuncion,

        type: "scatter",

        mode: "lines",

        name: "f(x)",

        line: {

            width: 3

        }

    };


    const traceDerivada = {

        x: x,

        y: yDerivada,

        type: "scatter",

        mode: "lines",

        name: `Derivada orden ${orden}`,

        line: {

            width: 3,

            dash: "dash"

        }

    };


    const layout = {

        title:
            `Función y derivada de orden ${orden}`,

        xaxis: {

            title: "x",

            zeroline: true

        },

        yaxis: {

            title: "y",

            zeroline: true

        },

        hovermode:
            "x unified",

        margin: {

            l: 60,

            r: 30,

            t: 60,

            b: 60

        }

    };


    Plotly.newPlot(

        "grafica",

        [
            traceFuncion,
            traceDerivada
        ],

        layout,

        {
            responsive: true,
            displaylogo: false
        }

    );


    document.getElementById(
        "graphDescription"
    ).textContent =
        "Función original y derivada";

}


/* =====================================================
   EJEMPLO INTEGRAL
===================================================== */

function ejemploIntegral(
    funcion,
    a,
    b
) {

    mostrarHerramienta(
        "integral"
    );


    document.getElementById(
        "integralFuncion"
    ).value = funcion;


    document.getElementById(
        "integralA"
    ).value = a;


    document.getElementById(
        "integralB"
    ).value = b;


    calcularIntegral();

}


/* =====================================================
   EJEMPLO DERIVADA
===================================================== */

function ejemploDerivada(
    funcion
) {

    mostrarHerramienta(
        "derivada"
    );


    document.getElementById(
        "derivadaFuncion"
    ).value = funcion;


    document.getElementById(
        "ordenDerivada"
    ).value = 1;


    calcularDerivada();

}


/* =====================================================
   LIMPIAR INTEGRAL
===================================================== */

function limpiarIntegral() {

    document.getElementById(
        "integralFuncion"
    ).value = "";


    document.getElementById(
        "integralA"
    ).value = "";


    document.getElementById(
        "integralB"
    ).value = "";


    document.getElementById(
        "resultadoIntegral"
    ).innerHTML =
        "Introduce una función y presiona \"Calcular integral\".";


    document.getElementById(
        "procedimientoIntegral"
    ).innerHTML = "";


    Plotly.purge(
        "grafica"
    );


    document.getElementById(
        "graphDescription"
    ).textContent =
        "Esperando cálculo...";

}


/* =====================================================
   LIMPIAR DERIVADA
===================================================== */

function limpiarDerivada() {

    document.getElementById(
        "derivadaFuncion"
    ).value = "";


    document.getElementById(
        "resultadoDerivada"
    ).innerHTML =
        "Introduce una función y presiona \"Calcular derivada\".";


    document.getElementById(
        "procedimientoDerivada"
    ).innerHTML = "";


    Plotly.purge(
        "grafica"
    );


    document.getElementById(
        "graphDescription"
    ).textContent =
        "Esperando cálculo...";

}


/* =====================================================
   FORMATEAR NÚMERO
===================================================== */

function formatearNumero(numero) {

    if (!isFinite(numero)) {

        return "No definido";

    }


    return Number(numero)
        .toFixed(10)
        .replace(/\.?0+$/, "");

}


/* =====================================================
   CONVERTIR SALIDA NERDAMER
===================================================== */

function convertirSalida(
    texto
) {

    return texto
        .replace(/\*\*/g, "^")
        .replace(/\*/g, " · ")
        .replace(/log/g, "ln");

}


/* =====================================================
   SEGURIDAD HTML
===================================================== */

function escapeHTML(
    texto
) {

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================================
   ENTER PARA CALCULAR
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        const integralInput =
            document.getElementById(
                "integralFuncion"
            );


        const derivadaInput =
            document.getElementById(
                "derivadaFuncion"
            );


        if (integralInput) {

            integralInput.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        calcularIntegral();

                    }

                }
            );

        }


        if (derivadaInput) {

            derivadaInput.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        calcularDerivada();

                    }

                }
            );

        }


        /*
           Ejecutar ejemplo inicial
        */

        calcularIntegral();

    }
);
