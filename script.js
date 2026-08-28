/* ============================================================
   AYUDAS ACADÉMICAS
   CALCULADORA DE INTEGRALES Y DERIVADAS
   VERSIÓN CORREGIDA
============================================================ */


/* ============================================================
   VARIABLES
============================================================ */

let herramientaActual = "integral";


/* ============================================================
   CAMBIAR ENTRE INTEGRAL Y DERIVADA
============================================================ */

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

    } else {

        panelIntegral.classList.add("hidden");
        panelDerivada.classList.remove("hidden");

        tabIntegral.classList.remove("active");
        tabDerivada.classList.add("active");
    }
}


/* ============================================================
   NORMALIZAR FUNCIÓN
============================================================ */

function normalizarFuncion(funcion) {

    let f = funcion.trim();

    f = f.replace(/π/g, "pi");

    f = f.replace(/√\s*\(/g, "sqrt(");

    f = f.replace(/√/g, "sqrt");

    f = f.replace(/sen/g, "sin");

    f = f.replace(/seno/g, "sin");

    f = f.replace(/coseno/g, "cos");

    f = f.replace(/tg/g, "tan");

    f = f.replace(/tangente/g, "tan");

    /*
       Convertir potencias escritas como x²
    */

    f = f.replace(/x²/g, "x^2");
    f = f.replace(/x³/g, "x^3");
    f = f.replace(/x⁴/g, "x^4");

    return f;
}


/* ============================================================
   ESCAPAR HTML
============================================================ */

function escapeHTML(texto) {

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ============================================================
   FORMATEAR NÚMEROS
============================================================ */

function formatearNumero(numero) {

    if (!isFinite(numero)) {
        return "No definido";
    }

    return Number(numero)
        .toFixed(10)
        .replace(/\.?0+$/, "");
}


/* ============================================================
   FORMATEAR EXPRESIONES
============================================================ */

function formatearExpresion(expr) {

    if (expr === null || expr === undefined) {
        return "";
    }

    let texto = String(expr);

    texto = texto
        .replace(/\*\*/g, "^")
        .replace(/\*/g, " · ")
        .replace(/sqrt\((.*?)\)/g, "√($1)")
        .replace(/sin/g, "sen")
        .replace(/log/g, "ln");

    return texto;
}


/* ============================================================
   EVALUAR FUNCIÓN
============================================================ */

function evaluarFuncion(funcion, x) {

    try {

        const resultado = math.evaluate(
            funcion,
            { x: x }
        );

        if (
            typeof resultado !== "number" ||
            !isFinite(resultado)
        ) {

            return null;
        }

        return resultado;

    } catch {

        return null;
    }
}


/* ============================================================
   MÉTODO DE SIMPSON
============================================================ */

function simpson(funcion, a, b, n = 2000) {

    if (a === b) {
        return 0;
    }

    if (n % 2 !== 0) {
        n++;
    }

    const h = (b - a) / n;

    let suma = 0;

    for (let i = 0; i <= n; i++) {

        const x = a + i * h;

        const fx = evaluarFuncion(funcion, x);

        if (fx === null) {

            throw new Error(
                "La función no puede evaluarse en todo el intervalo."
            );
        }

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


/* ============================================================
   INTEGRAL
============================================================ */

function calcularIntegral() {

    const campoFuncion =
        document.getElementById("integralFuncion");

    const campoA =
        document.getElementById("integralA");

    const campoB =
        document.getElementById("integralB");

    const resultado =
        document.getElementById("resultadoIntegral");

    const procedimiento =
        document.getElementById("procedimientoIntegral");


    const funcionOriginal =
        campoFuncion.value.trim();

    const a =
        parseFloat(campoA.value);

    const b =
        parseFloat(campoB.value);


    /* --------------------------------------------------------
       VALIDACIONES
    -------------------------------------------------------- */

    if (!funcionOriginal) {

        resultado.innerHTML = `
            <div class="error-message">
                ⚠️ Debes introducir una función.
            </div>
        `;

        procedimiento.innerHTML = "";

        return;
    }


    if (isNaN(a) || isNaN(b)) {

        resultado.innerHTML = `
            <div class="error-message">
                ⚠️ Debes introducir los dos límites.
            </div>
        `;

        procedimiento.innerHTML = "";

        return;
    }


    const funcion =
        normalizarFuncion(funcionOriginal);


    try {

        /* ----------------------------------------------------
           VALIDAR FUNCIÓN
        ---------------------------------------------------- */

        const prueba =
            evaluarFuncion(funcion, a);

        /*
           No rechazamos automáticamente si el extremo
           no está definido. La integral puede existir.
        */


        /* ----------------------------------------------------
           CALCULAR INTEGRAL
        ---------------------------------------------------- */

        const valor =
            simpson(
                funcion,
                a,
                b,
                2000
            );


        /* ----------------------------------------------------
           MOSTRAR RESULTADO
        ---------------------------------------------------- */

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


        /* ----------------------------------------------------
           PROCEDIMIENTO
        ---------------------------------------------------- */

        procedimiento.innerHTML =
            generarProcedimientoIntegral(
                funcionOriginal,
                funcion,
                a,
                b,
                valor
            );


        /* ----------------------------------------------------
           GRÁFICA
        ---------------------------------------------------- */

        graficarIntegral(
            funcion,
            a,
            b
        );

    }

    catch (error) {

        console.error(error);

        resultado.innerHTML = `

            <div class="error-message">

                ⚠️ No fue posible calcular la integral.

                <br><br>

                Revisa la función y los límites.

                <br><br>

                Ejemplo:

                <strong>
                    x^2
                </strong>

            </div>

        `;

        procedimiento.innerHTML = "";
    }
}


/* ============================================================
   GENERAR PROCEDIMIENTO DE INTEGRAL
============================================================ */

function generarProcedimientoIntegral(
    funcionOriginal,
    funcion,
    a,
    b,
    valor
) {

    const antiderivada =
        obtenerAntiderivadaComun(funcion);


    let html = `

        <h4>
            📐 Procedimiento de la integral
        </h4>

        <p>
            <strong>Paso 1. Identificar la función:</strong>
        </p>

        <p>
            f(x) =
            ${escapeHTML(funcionOriginal)}
        </p>

    `;


    /* --------------------------------------------------------
       SI ENCONTRAMOS ANTIDERIVADA
    -------------------------------------------------------- */

    if (antiderivada) {

        html += `

            <p>
                <strong>Paso 2. Encontrar la antiderivada:</strong>
            </p>

            <p>

                ∫ ${escapeHTML(funcionOriginal)} dx

                =

                ${escapeHTML(
                    antiderivada
                )}

                + C

            </p>

            <p>
                <strong>Paso 3. Aplicar el teorema
                fundamental del cálculo:</strong>
            </p>

            <p>

                ∫<sub>${a}</sub><sup>${b}</sup>
                f(x) dx

                =

                F(${b}) - F(${a})

            </p>

        `;


        const evaluacion =
            evaluarAntiderivada(
                funcion,
                a,
                b
            );


        if (evaluacion) {

            html += `

                <p>
                    <strong>Paso 4. Sustituir los límites:</strong>
                </p>

                <p>

                    F(${b}) - F(${a})
                    =

                    ${escapeHTML(
                        evaluacion.fb
                    )}

                    -

                    ${escapeHTML(
                        evaluacion.fa
                    )}

                </p>

                <p>

                    <strong>
                        Resultado:
                    </strong>

                    ${formatearNumero(valor)}

                </p>

            `;
        }


    } else {

        /* ----------------------------------------------------
           PROCEDIMIENTO NUMÉRICO
        ---------------------------------------------------- */

        html += `

            <p>
                <strong>Paso 2. Método utilizado:</strong>
            </p>

            <p>
                Debido a que la función no tiene una
                antiderivada común implementada en el
                calculador, se utiliza la
                <strong>Regla de Simpson</strong>.
            </p>

            <p>
                <strong>Paso 3. Fórmula:</strong>
            </p>

            <p>

                ∫<sub>a</sub><sup>b</sup> f(x) dx
                ≈
                h/3 [f(x₀) + 4f(x₁) + 2f(x₂) + ... + f(xₙ)]

            </p>

            <p>

                Con:

                <br>

                h = (b - a) / n

            </p>

            <p>

                En este cálculo se utilizaron
                <strong>2000 subdivisiones</strong>.

            </p>

            <p>

                <strong>
                    Resultado aproximado:
                </strong>

                ${formatearNumero(valor)}

            </p>

        `;
    }


    return html;
}


/* ============================================================
   ANTIDERIVADAS COMUNES
============================================================ */

function obtenerAntiderivadaComun(funcion) {

    const f =
        funcion.replace(/\s+/g, "");


    /* x^n */

    let match =
        f.match(/^x\^(-?\d+(?:\.\d+)?)$/);


    if (match) {

        const n =
            parseFloat(match[1]);

        if (n !== -1) {

            const nuevoExponente =
                n + 1;

            return `
                x^${nuevoExponente}/${nuevoExponente}
            `;
        }

        return "ln(|x|)";
    }


    /* x */

    if (f === "x") {

        return "x^2/2";
    }


    /* constantes */

    if (
        /^-?\d+(?:\.\d+)?$/.test(f)
    ) {

        return `${f}x`;
    }


    /* sin(x) */

    if (f === "sin(x)") {

        return "-cos(x)";
    }


    /* cos(x) */

    if (f === "cos(x)") {

        return "sin(x)";
    }


    /* tan(x) */

    if (f === "tan(x)") {

        return "-ln(|cos(x)|)";
    }


    /* exp(x) */

    if (f === "exp(x)") {

        return "exp(x)";
    }


    /* e^x */

    if (
        f === "e^x" ||
        f === "exp(x)"
    ) {

        return "e^x";
    }


    /* 1/x */

    if (
        f === "1/x"
    ) {

        return "ln(|x|)";
    }


    return null;
}


/* ============================================================
   EVALUAR ANTIDERIVADA COMÚN
============================================================ */

function evaluarAntiderivada(
    funcion,
    a,
    b
) {

    const antiderivada =
        obtenerAntiderivadaComun(
            funcion
        );


    if (!antiderivada) {

        return null;
    }


    let fa;

    let fb;


    try {

        const expresion =
            antiderivada
                .replace(/\|x\|/g, "abs(x)")
                .replace(/ln/g, "log");


        fa =
            math.evaluate(
                expresion,
                { x: a }
            );


        fb =
            math.evaluate(
                expresion,
                { x: b }
            );


        return {

            fa:
                formatearNumero(fa),

            fb:
                formatearNumero(fb)

        };

    }

    catch {

        return null;
    }
}


/* ============================================================
   DERIVADA
============================================================ */

function calcularDerivada() {

    const campoFuncion =
        document.getElementById(
            "derivadaFuncion"
        );

    const campoOrden =
        document.getElementById(
            "ordenDerivada"
        );

    const resultado =
        document.getElementById(
            "resultadoDerivada"
        );

    const procedimiento =
        document.getElementById(
            "procedimientoDerivada"
        );


    const funcionOriginal =
        campoFuncion.value.trim();


    const orden =
        parseInt(
            campoOrden.value
        );


    /* --------------------------------------------------------
       VALIDACIÓN
    -------------------------------------------------------- */

    if (!funcionOriginal) {

        resultado.innerHTML = `

            <div class="error-message">

                ⚠️ Debes introducir una función.

            </div>

        `;

        procedimiento.innerHTML = "";

        return;
    }


    const funcion =
        normalizarFuncion(
            funcionOriginal
        );


    try {

        /* ----------------------------------------------------
           CREAR EXPRESIÓN
        ---------------------------------------------------- */

        let expresion =
            math.parse(funcion);


        /*
           Calcular las derivadas sucesivamente
        */

        const resultados = [];


        for (
            let i = 1;
            i <= orden;
            i++
        ) {

            expresion =
                math.derivative(
                    expresion,
                    "x"
                );


            resultados.push(
                expresion.toString()
            );
        }


        const derivadaFinal =
            resultados[
                resultados.length - 1
            ];


        /* ----------------------------------------------------
           MOSTRAR RESULTADO
        ---------------------------------------------------- */

        resultado.innerHTML = `

            <div>

                <strong>
                    ${obtenerNombreOrden(orden)}
                    derivada
                </strong>

            </div>

            <div class="result-symbolic">

                d<sup>${orden}</sup>f
                / dx<sup>${orden}</sup>

            </div>

            <div class="result-main">

                ${escapeHTML(
                    formatearExpresion(
                        derivadaFinal
                    )
                )}

            </div>

        `;


        /* ----------------------------------------------------
           PROCEDIMIENTO
        ---------------------------------------------------- */

        procedimiento.innerHTML =
            generarProcedimientoDerivada(
                funcionOriginal,
                resultados,
                orden
            );


        /* ----------------------------------------------------
           GRÁFICA
        ---------------------------------------------------- */

        graficarDerivada(
            funcion,
            derivadaFinal,
            orden
        );

    }

    catch (error) {

        console.error(
            "ERROR DERIVADA:",
            error
        );


        resultado.innerHTML = `

            <div class="error-message">

                ⚠️ No fue posible calcular la derivada.

                <br><br>

                Verifica que la función esté escrita
                correctamente.

                <br><br>

                <strong>
                    Ejemplos válidos:
                </strong>

                <br>

                x^3 + 2*x

                <br>

                sin(x)

                <br>

                cos(x)

                <br>

                exp(x)

                <br>

                ln(x)

            </div>

        `;

        procedimiento.innerHTML = "";
    }
}


/* ============================================================
   PROCEDIMIENTO DERIVADA
============================================================ */

function generarProcedimientoDerivada(
    funcionOriginal,
    resultados,
    orden
) {

    let html = `

        <h4>
            📐 Procedimiento de la derivada
        </h4>

        <p>

            <strong>
                Función original:
            </strong>

            f(x) =
            ${escapeHTML(funcionOriginal)}

        </p>

    `;


    for (
        let i = 0;
        i < resultados.length;
        i++
    ) {

        const numero =
            i + 1;


        html += `

            <p>

                <strong>
                    Paso ${numero}:
                </strong>

                ${obtenerNombreOrden(numero)}
                derivada.

            </p>

            <p>

                ${numero === 1
                    ? "f'(x)"
                    : "f^(" + numero + ")(x)"
                }

                =

                ${escapeHTML(
                    formatearExpresion(
                        resultados[i]
                    )
                )}

            </p>

        `;
    }


    html += `

        <p>

            <strong>
                Resultado final:
            </strong>

            Derivada de orden ${orden}:

            ${escapeHTML(
                formatearExpresion(
                    resultados[orden - 1]
                )
            )}

        </p>

    `;


    return html;
}


/* ============================================================
   NOMBRE DE ORDEN
============================================================ */

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


/* ============================================================
   GRÁFICA DE INTEGRAL
============================================================ */

function graficarIntegral(
    funcion,
    a,
    b
) {

    let rango =
        Math.abs(b - a);


    if (
        !isFinite(rango) ||
        rango === 0
    ) {

        rango = 5;
    }


    const margen =
        rango * 0.15;


    const inicio =
        Math.min(a, b) -
        margen;


    const fin =
        Math.max(a, b) +
        margen;


    const cantidad = 600;


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

        y.push(
            evaluarFuncion(
                funcion,
                valor
            )
        );
    }


    /* --------------------------------------------------------
       ÁREA
    -------------------------------------------------------- */

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

        yArea.push(
            evaluarFuncion(
                funcion,
                valor
            )
        );
    }


    const traceArea = {

        x: xArea,

        y: yArea,

        type: "scatter",

        mode: "lines",

        fill: "tozeroy",

        name: "Área",

        opacity: 0.35

    };


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


    const layout = {

        title:
            "Gráfica de la integral y área bajo la curva",

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


/* ============================================================
   GRÁFICA DE DERIVADA
============================================================ */

function graficarDerivada(
    funcion,
    derivada,
    orden
) {

    const inicio = -10;

    const fin = 10;

    const cantidad = 600;


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


        yFuncion.push(
            evaluarFuncion(
                funcion,
                valor
            )
        );


        yDerivada.push(
            evaluarFuncion(
                derivada,
                valor
            )
        );
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

        name:
            `Derivada orden ${orden}`,

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


/* ============================================================
   EJEMPLOS DE INTEGRALES
============================================================ */

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


/* ============================================================
   EJEMPLOS DE DERIVADAS
============================================================ */

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


/* ============================================================
   LIMPIAR INTEGRAL
============================================================ */

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
    ).innerHTML = `

        Introduce una función y presiona
        "Calcular integral".

    `;


    document.getElementById(
        "procedimientoIntegral"
    ).innerHTML = "";


    if (
        document.getElementById(
            "grafica"
        )
    ) {

        Plotly.purge(
            "grafica"
        );
    }


    document.getElementById(
        "graphDescription"
    ).textContent =
        "Esperando cálculo...";
}


/* ============================================================
   LIMPIAR DERIVADA
============================================================ */

function limpiarDerivada() {

    document.getElementById(
        "derivadaFuncion"
    ).value = "";


    document.getElementById(
        "resultadoDerivada"
    ).innerHTML = `

        Introduce una función y presiona
        "Calcular derivada".

    `;


    document.getElementById(
        "procedimientoDerivada"
    ).innerHTML = "";


    if (
        document.getElementById(
            "grafica"
        )
    ) {

        Plotly.purge(
            "grafica"
        );
    }


    document.getElementById(
        "graphDescription"
    ).textContent =
        "Esperando cálculo...";
}


/* ============================================================
   TECLAS ENTER
============================================================ */

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
           Cálculo inicial
        */

        calcularIntegral();

    }
);
