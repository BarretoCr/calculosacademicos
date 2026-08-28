/* =====================================================
   AYUDAS ACADÉMICAS
   CALCULADORA DE INTEGRALES Y DERIVADAS
===================================================== */


/* =====================================================
   UTILIDADES
===================================================== */

function evaluarFuncion(funcion, x) {

    return math.evaluate(funcion, { x: x });

}


/* =====================================================
   FORMATEAR EXPRESIONES
===================================================== */

function limpiarExpresion(expr) {

    return String(expr)
        .replace(/\*\*/g, "^")
        .replace(/\*/g, "·")
        .replace(/sqrt/g, "√")
        .replace(/exp/g, "e^");

}


/* =====================================================
   CONVERTIR A FORMATO MATEMÁTICO
===================================================== */

function formatoMatematico(expr) {

    let texto = String(expr);

    texto = texto
        .replace(/\*\*/g, "^")
        .replace(/\*/g, " · ")
        .replace(/sqrt\((.*?)\)/g, "√($1)")
        .replace(/pi/g, "π");

    return texto;

}


/* =====================================================
   SELECTOR DE HERRAMIENTAS
===================================================== */

function mostrarHerramienta(tipo, boton) {

    document.querySelectorAll(".math-tool")
        .forEach(elemento => {

            elemento.classList.remove("active");

        });


    document.querySelectorAll(".math-tab")
        .forEach(elemento => {

            elemento.classList.remove("active");

        });


    document
        .getElementById(
            "herramienta-" + tipo
        )
        .classList.add("active");


    boton.classList.add("active");

}


/* =====================================================
   INTEGRAL NUMÉRICA - SIMPSON
===================================================== */

function simpson(funcion, a, b, n = 2000) {

    if (n % 2 !== 0) {
        n++;
    }


    const h = (b - a) / n;

    let suma = 0;


    for (let i = 0; i <= n; i++) {

        const x = a + i * h;

        const fx =
            evaluarFuncion(
                funcion,
                x
            );


        if (i === 0 || i === n) {

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
   INTEGRAL SIMBÓLICA CON ALGEBRITE
===================================================== */

function obtenerAntiderivada(funcion) {

    try {

        const resultado =
            Algebrite.integral(funcion);

        return resultado.toString();

    }

    catch (error) {

        return null;

    }

}


/* =====================================================
   CALCULAR INTEGRAL
===================================================== */

function calcularIntegral() {

    const funcion =
        document
            .getElementById("funcion")
            .value
            .trim();


    const a =
        parseFloat(
            document
                .getElementById("limiteInferior")
                .value
        );


    const b =
        parseFloat(
            document
                .getElementById("limiteSuperior")
                .value
        );


    if (!funcion) {

        mostrarErrorIntegral(
            "Introduce una función."
        );

        return;

    }


    if (isNaN(a) || isNaN(b)) {

        mostrarErrorIntegral(
            "Introduce los límites de integración."
        );

        return;

    }


    try {

        /* =========================================
           RESULTADO NUMÉRICO
        ========================================= */

        const resultadoNumerico =
            simpson(
                funcion,
                a,
                b
            );


        /* =========================================
           ANTIDERIVADA
        ========================================= */

        const antiderivada =
            obtenerAntiderivada(
                funcion
            );


        /* =========================================
           RESULTADO SIMBÓLICO
        ========================================= */

        let valorExacto = null;


        if (antiderivada) {

            try {

                const fa =
                    Algebrite
                        .run(
                            `subst(${a},x,${antiderivada})`
                        );


                const fb =
                    Algebrite
                        .run(
                            `subst(${b},x,${antiderivada})`
                        );


                valorExacto =
                    Algebrite
                        .run(
                            `(${fb})-(${fa})`
                        );

            }

            catch {

                valorExacto = null;

            }

        }


        /* =========================================
           RESULTADO
        ========================================= */

        mostrarResultadoIntegral(

            funcion,

            a,

            b,

            antiderivada,

            valorExacto,

            resultadoNumerico

        );


        /* =========================================
           PROCEDIMIENTO
        ========================================= */

        generarProcedimientoIntegral(

            funcion,

            a,

            b,

            antiderivada,

            valorExacto,

            resultadoNumerico

        );


        /* =========================================
           GRÁFICA
        ========================================= */

        graficarIntegral();

    }

    catch (error) {

        mostrarErrorIntegral(
            "No se pudo resolver la integral. Revisa la función."
        );

    }

}


/* =====================================================
   RESULTADO DE INTEGRAL
===================================================== */

function mostrarResultadoIntegral(

    funcion,
    a,
    b,
    antiderivada,
    exacto,
    numerico

) {

    const div =
        document.getElementById(
            "resultadoIntegral"
        );


    div.innerHTML = `

        <div class="math-result">

            <div>

                <strong>
                    Integral definida
                </strong>

            </div>


            <div class="formula">

                ∫<sub>${a}</sub><sup>${b}</sup>
                ${formatoMatematico(funcion)} dx

            </div>


            ${
                exacto
                ?
                `
                <div class="exact-result">

                    Resultado exacto:

                    ${formatoMatematico(exacto)}

                </div>
                `
                :
                ""
            }


            <div class="result-number">

                ${numerico.toFixed(8)}

            </div>


            <div>

                Resultado aproximado

            </div>

        </div>

    `;

}


/* =====================================================
   PROCEDIMIENTO DE INTEGRAL
===================================================== */

function generarProcedimientoIntegral(

    funcion,
    a,
    b,
    antiderivada,
    exacto,
    numerico

) {

    const contenedor =
        document.getElementById(
            "procedimientoIntegral"
        );


    let pasos = "";


    /* PASO 1 */

    pasos += `

        <div class="step">

            <div class="step-number">
                1
            </div>

            <h4>
                Identificar la integral
            </h4>

            <div class="step-content">

                Se desea calcular:

                <br><br>

                <strong>

                    ∫<sub>${a}</sub><sup>${b}</sup>
                    ${formatoMatematico(funcion)} dx

                </strong>

            </div>

        </div>

    `;


    /* PASO 2 */

    pasos += `

        <div class="step">

            <div class="step-number">
                2
            </div>

            <h4>
                Encontrar la antiderivada
            </h4>

            <div class="step-content">

                Buscamos una función
                F(x) cuya derivada sea f(x).

                <br><br>

                ${
                    antiderivada
                    ?
                    `
                    <strong>
                        F(x) =
                        ${formatoMatematico(antiderivada)}
                    </strong>
                    `
                    :
                    `
                    <span>
                        No fue posible obtener
                        una forma simbólica.
                    </span>
                    `
                }

            </div>

        </div>

    `;


    /* PASO 3 */

    if (antiderivada) {

        pasos += `

            <div class="step">

                <div class="step-number">
                    3
                </div>

                <h4>
                    Aplicar el Teorema Fundamental del Cálculo
                </h4>

                <div class="step-content">

                    Si F'(x) = f(x), entonces:

                    <br><br>

                    <strong>

                        ∫<sub>${a}</sub><sup>${b}</sup>
                        f(x) dx
                        =
                        F(${b}) − F(${a})

                    </strong>

                </div>

            </div>

        `;


        /* PASO 4 */

        pasos += `

            <div class="step">

                <div class="step-number">
                    4
                </div>

                <h4>
                    Evaluar los límites
                </h4>

                <div class="step-content">

                    <strong>

                        F(${b}) − F(${a})

                    </strong>

                    <br><br>

                    Se evalúa la antiderivada
                    en el límite superior y
                    posteriormente en el límite inferior.

                    ${
                        exacto
                        ?
                        `
                        <br><br>

                        Resultado exacto:

                        <strong>
                            ${formatoMatematico(exacto)}
                        </strong>
                        `
                        :
                        ""
                    }

                </div>

            </div>

        `;

    }


    /* PASO FINAL */

    pasos += `

        <div class="step final">

            <div class="step-number">
                ✓
            </div>

            <h4>
                Resultado final
            </h4>

            <div class="step-content">

                <strong>

                    ∫<sub>${a}</sub><sup>${b}</sup>
                    ${formatoMatematico(funcion)} dx

                    =

                    ${numerico.toFixed(8)}

                </strong>

            </div>

        </div>

    `;


    contenedor.innerHTML = pasos;

}


/* =====================================================
   ERROR INTEGRAL
===================================================== */

function mostrarErrorIntegral(mensaje) {

    document.getElementById(
        "resultadoIntegral"
    ).innerHTML = `

        <div style="
            color:#dc2626;
            font-weight:bold;
        ">

            ⚠️ ${mensaje}

        </div>

    `;


    document.getElementById(
        "procedimientoIntegral"
    ).innerHTML = "";

}


/* =====================================================
   GRÁFICA INTEGRAL
===================================================== */

function graficarIntegral() {

    const funcion =
        document
            .getElementById("funcion")
            .value
            .trim();


    const a =
        parseFloat(
            document
                .getElementById("limiteInferior")
                .value
        );


    const b =
        parseFloat(
            document
                .getElementById("limiteSuperior")
                .value
        );


    if (
        !funcion ||
        isNaN(a) ||
        isNaN(b)
    ) {

        return;

    }


    const margen =
        Math.abs(b - a) * 0.15 || 1;


    const inicio =
        Math.min(a, b) - margen;


    const fin =
        Math.max(a, b) + margen;


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
            (
                (fin - inicio) *
                i /
                (cantidad - 1)
            );


        x.push(valor);


        try {

            const resultado =
                evaluarFuncion(
                    funcion,
                    valor
                );


            y.push(
                typeof resultado === "number" &&
                isFinite(resultado)
                    ? resultado
                    : null
            );

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
            (
                (b - a) *
                i /
                300
            );


        xArea.push(valor);


        try {

            yArea.push(
                evaluarFuncion(
                    funcion,
                    valor
                )
            );

        }

        catch {

            yArea.push(null);

        }

    }


    const areaTrace = {

        x: xArea,

        y: yArea,

        fill: "tozeroy",

        mode: "lines",

        name: "Área de integración",

        opacity: 0.35

    };


    const functionTrace = {

        x: x,

        y: y,

        mode: "lines",

        name:
            "f(x) = " +
            funcion,

        line: {

            width: 3

        }

    };


    Plotly.newPlot(

        "graficaIntegral",

        [
            areaTrace,
            functionTrace
        ],

        {

            title:
                "Representación de la integral",

            xaxis: {
                title: "x"
            },

            yaxis: {
                title: "f(x)"
            },

            hovermode:
                "x unified",

            margin: {
                l: 60,
                r: 30,
                t: 70,
                b: 60
            }

        },

        {
            responsive: true,
            displaylogo: false
        }

    );

}


/* =====================================================
   CARGAR EJEMPLO DE INTEGRAL
===================================================== */

function cargarIntegral(
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


/* =====================================================
   LIMPIAR INTEGRAL
===================================================== */

function limpiarIntegral() {

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
        "resultadoIntegral"
    ).innerHTML =
        "Introduce una función para comenzar.";


    document.getElementById(
        "procedimientoIntegral"
    ).innerHTML = "";


    Plotly.purge(
        "graficaIntegral"
    );

}


/* =====================================================
   DERIVADA SIMBÓLICA
===================================================== */

function obtenerDerivada(funcion) {

    try {

        return Algebrite
            .diff(funcion, "x")
            .toString();

    }

    catch {

        return null;

    }

}


/* =====================================================
   CALCULAR DERIVADA
===================================================== */

function calcularDerivada() {

    const funcion =
        document
            .getElementById(
                "funcionDerivada"
            )
            .value
            .trim();


    if (!funcion) {

        mostrarErrorDerivada(
            "Introduce una función."
        );

        return;

    }


    try {

        const derivada =
            obtenerDerivada(
                funcion
            );


        if (!derivada) {

            throw new Error();

        }


        mostrarResultadoDerivada(
            funcion,
            derivada
        );


        generarProcedimientoDerivada(
            funcion,
            derivada
        );


        graficarDerivada();

    }

    catch {

        mostrarErrorDerivada(
            "No fue posible calcular la derivada."
        );

    }

}


/* =====================================================
   RESULTADO DERIVADA
===================================================== */

function mostrarResultadoDerivada(

    funcion,
    derivada

) {

    document.getElementById(
        "resultadoDerivada"
    ).innerHTML = `

        <div class="math-result">

            <div>

                <strong>
                    Función original
                </strong>

            </div>

            <div class="formula">

                f(x) =
                ${formatoMatematico(funcion)}

            </div>


            <div>

                <strong>
                    Derivada
                </strong>

            </div>


            <div class="result-number">

                f'(x) =
                ${formatoMatematico(derivada)}

            </div>

        </div>

    `;

}


/* =====================================================
   PROCEDIMIENTO DERIVADA
===================================================== */

function generarProcedimientoDerivada(

    funcion,
    derivada

) {

    const contenedor =
        document.getElementById(
            "procedimientoDerivada"
        );


    let pasos = "";


    /* PASO 1 */

    pasos += `

        <div class="step">

            <div class="step-number">
                1
            </div>

            <h4>
                Identificar la función
            </h4>

            <div class="step-content">

                <strong>

                    f(x) =
                    ${formatoMatematico(funcion)}

                </strong>

            </div>

        </div>

    `;


    /* PASO 2 */

    pasos += `

        <div class="step">

            <div class="step-number">
                2
            </div>

            <h4>
                Aplicar las reglas de derivación
            </h4>

            <div class="step-content">

                Se deriva cada término respecto
                a la variable x.

                <br><br>

                Algunas reglas utilizadas son:

                <br><br>

                <strong>
                    d/dx (xⁿ) = n·xⁿ⁻¹
                </strong>

                <br>

                <strong>
                    d/dx (sen x) = cos x
                </strong>

                <br>

                <strong>
                    d/dx (cos x) = −sen x
                </strong>

                <br>

                <strong>
                    d/dx (eˣ) = eˣ
                </strong>

            </div>

        </div>

    `;


    /* PASO 3 */

    pasos += `

        <div class="step">

            <div class="step-number">
                3
            </div>

            <h4>
                Simplificar
            </h4>

            <div class="step-content">

                Después de aplicar las reglas
                correspondientes:

                <br><br>

                <strong>

                    f'(x) =
                    ${formatoMatematico(derivada)}

                </strong>

            </div>

        </div>

    `;


    /* RESULTADO */

    pasos += `

        <div class="step final">

            <div class="step-number">
                ✓
            </div>

            <h4>
                Resultado final
            </h4>

            <div class="step-content">

                <strong>

                    f'(x) =
                    ${formatoMatematico(derivada)}

                </strong>

            </div>

        </div>

    `;


    contenedor.innerHTML = pasos;

}


/* =====================================================
   ERROR DERIVADA
===================================================== */

function mostrarErrorDerivada(mensaje) {

    document.getElementById(
        "resultadoDerivada"
    ).innerHTML = `

        <div style="
            color:#dc2626;
            font-weight:bold;
        ">

            ⚠️ ${mensaje}

        </div>

    `;


    document.getElementById(
        "procedimientoDerivada"
    ).innerHTML = "";

}


/* =====================================================
   GRÁFICA DE DERIVADA
===================================================== */

function graficarDerivada() {

    const funcion =
        document
            .getElementById(
                "funcionDerivada"
            )
            .value
            .trim();


    if (!funcion) {
        return;
    }


    const derivada =
        obtenerDerivada(
            funcion
        );


    if (!derivada) {
        return;
    }


    const x = [];

    const yFuncion = [];

    const yDerivada = [];


    const inicio = -10;

    const fin = 10;

    const cantidad = 500;


    for (
        let i = 0;
        i < cantidad;
        i++
    ) {

        const valor =
            inicio +
            (
                (fin - inicio) *
                i /
                (cantidad - 1)
            );


        x.push(valor);


        try {

            const yf =
                evaluarFuncion(
                    funcion,
                    valor
                );


            const yd =
                evaluarFuncion(
                    derivada,
                    valor
                );


            yFuncion.push(
                isFinite(yf)
                    ? yf
                    : null
            );


            yDerivada.push(
                isFinite(yd)
                    ? yd
                    : null
            );

        }

        catch {

            yFuncion.push(null);

            yDerivada.push(null);

        }

    }


    const functionTrace = {

        x: x,

        y: yFuncion,

        mode: "lines",

        name:
            "f(x) = " +
            funcion,

        line: {
            width: 3
        }

    };


    const derivativeTrace = {

        x: x,

        y: yDerivada,

        mode: "lines",

        name:
            "f'(x) = " +
            derivada,

        line: {
            width: 3,
            dash: "dash"
        }

    };


    Plotly.newPlot(

        "graficaDerivada",

        [
            functionTrace,
            derivativeTrace
        ],

        {

            title:
                "Función y su derivada",

            xaxis: {
                title: "x"
            },

            yaxis: {
                title: "y"
            },

            hovermode:
                "x unified",

            margin: {
                l: 60,
                r: 30,
                t: 70,
                b: 60
            }

        },

        {
            responsive: true,
            displaylogo: false
        }

    );

}


/* =====================================================
   CARGAR EJEMPLO DERIVADA
===================================================== */

function cargarDerivada(
    funcion
) {

    document.getElementById(
        "funcionDerivada"
    ).value = funcion;


    calcularDerivada();

}


/* =====================================================
   LIMPIAR DERIVADA
===================================================== */

function limpiarDerivada() {

    document.getElementById(
        "funcionDerivada"
    ).value = "";


    document.getElementById(
        "resultadoDerivada"
    ).innerHTML =
        "Introduce una función para comenzar.";


    document.getElementById(
        "procedimientoDerivada"
    ).innerHTML = "";


    Plotly.purge(
        "graficaDerivada"
    );

}


/* =====================================================
   INICIAR
===================================================== */

window.addEventListener(
    "load",
    function () {

        calcularIntegral();

        calcularDerivada();

    }
);
