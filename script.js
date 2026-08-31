/* ============================================================
   AYUDAS ACADÉMICAS
   CALCULADORA DE:

   ∫ INTEGRALES
   d/dx DERIVADAS
   lim LÍMITES

   VERSIÓN COMPLETA
============================================================ */


/* ============================================================
   VARIABLE ACTUAL
============================================================ */

let herramientaActual = "integral";


/* ============================================================
   CAMBIAR HERRAMIENTA
============================================================ */

function mostrarHerramienta(tipo) {

    herramientaActual = tipo;


    const panelIntegral =
        document.getElementById("panelIntegral");

    const panelDerivada =
        document.getElementById("panelDerivada");

    const panelLimite =
        document.getElementById("panelLimite");


    const tabIntegral =
        document.getElementById("tabIntegral");

    const tabDerivada =
        document.getElementById("tabDerivada");

    const tabLimite =
        document.getElementById("tabLimite");


    panelIntegral.classList.add("hidden");
    panelDerivada.classList.add("hidden");
    panelLimite.classList.add("hidden");


    tabIntegral.classList.remove("active");
    tabDerivada.classList.remove("active");
    tabLimite.classList.remove("active");


    if (tipo === "integral") {

        panelIntegral.classList.remove("hidden");

        tabIntegral.classList.add("active");

    }


    if (tipo === "derivada") {

        panelDerivada.classList.remove("hidden");

        tabDerivada.classList.add("active");

    }


    if (tipo === "limite") {

        panelLimite.classList.remove("hidden");

        tabLimite.classList.add("active");

    }

}


/* ============================================================
   NORMALIZAR FUNCIÓN
============================================================ */

function normalizarFuncion(funcion) {

    let f = funcion.trim();


    f = f.replace(/π/g, "pi");

    f = f.replace(/sen/g, "sin");

    f = f.replace(/seno/g, "sin");

    f = f.replace(/coseno/g, "cos");

    f = f.replace(/tg/g, "tan");

    f = f.replace(/tangente/g, "tan");

    f = f.replace(/√/g, "sqrt");

    f = f.replace(/ln/g, "log");


    /*
       Potencias Unicode
    */

    f = f.replace(/x²/g, "x^2");

    f = f.replace(/x³/g, "x^3");

    f = f.replace(/x⁴/g, "x^4");

    f = f.replace(/x⁵/g, "x^5");


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
   FORMATEAR NÚMERO
============================================================ */

function formatearNumero(numero) {

    if (!isFinite(numero)) {

        return "No definido";

    }


    if (Math.abs(numero) < 1e-12) {

        return "0";

    }


    return Number(numero)

        .toFixed(10)

        .replace(/\.?0+$/, "");

}


/* ============================================================
   FORMATEAR EXPRESIÓN
============================================================ */

function formatearExpresion(expr) {

    if (
        expr === null ||
        expr === undefined
    ) {

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

function evaluarFuncion(
    funcion,
    x
) {

    try {

        const resultado =
            math.evaluate(
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

    }

    catch {

        return null;

    }

}


/* ============================================================
   INTEGRACIÓN NUMÉRICA
   REGLA DE SIMPSON
============================================================ */

function simpson(
    funcion,
    a,
    b,
    n = 2000
) {

    if (a === b) {

        return 0;

    }


    if (n % 2 !== 0) {

        n++;

    }


    const h =
        (b - a) / n;


    let suma = 0;


    for (
        let i = 0;
        i <= n;
        i++
    ) {

        const x =
            a + i * h;


        const fx =
            evaluarFuncion(
                funcion,
                x
            );


        if (fx === null) {

            throw new Error(
                "La función no puede evaluarse en todo el intervalo."
            );

        }


        if (
            i === 0 ||
            i === n
        ) {

            suma += fx;

        }

        else if (
            i % 2 === 0
        ) {

            suma += 2 * fx;

        }

        else {

            suma += 4 * fx;

        }

    }


    return (
        h / 3
    ) * suma;

}


/* ============================================================
   INTEGRALES
============================================================ */

function calcularIntegral() {

    const funcionInput =
        document.getElementById(
            "integralFuncion"
        );


    const aInput =
        document.getElementById(
            "integralA"
        );


    const bInput =
        document.getElementById(
            "integralB"
        );


    const resultado =
        document.getElementById(
            "resultadoIntegral"
        );


    const procedimiento =
        document.getElementById(
            "procedimientoIntegral"
        );


    const funcionOriginal =
        funcionInput.value.trim();


    const a =
        parseFloat(
            aInput.value
        );


    const b =
        parseFloat(
            bInput.value
        );


    if (!funcionOriginal) {

        mostrarError(
            resultado,
            "Debes introducir una función."
        );

        procedimiento.innerHTML = "";

        return;

    }


    if (
        isNaN(a) ||
        isNaN(b)
    ) {

        mostrarError(
            resultado,
            "Debes introducir los dos límites."
        );

        procedimiento.innerHTML = "";

        return;

    }


    const funcion =
        normalizarFuncion(
            funcionOriginal
        );


    try {

        const valor =
            simpson(
                funcion,
                a,
                b,
                2000
            );


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

            <div class="result-decimal">

                Resultado numérico aproximado.

            </div>

        `;


        procedimiento.innerHTML =
            generarProcedimientoIntegral(
                funcionOriginal,
                funcion,
                a,
                b,
                valor
            );


        graficarIntegral(
            funcion,
            a,
            b
        );


        actualizarMathJax();

    }

    catch (error) {

        console.error(error);

        mostrarError(
            resultado,
            "No fue posible calcular la integral. Revisa la función y los límites."
        );

        procedimiento.innerHTML = "";

    }

}


/* ============================================================
   PROCEDIMIENTO INTEGRAL
============================================================ */

function generarProcedimientoIntegral(
    funcionOriginal,
    funcion,
    a,
    b,
    valor
) {

    const antiderivada =
        obtenerAntiderivadaComun(
            funcion
        );


    let html = `

        <h4>
            📐 Desarrollo de la integral
        </h4>

        <div class="procedure-step">

            <strong>
                Paso 1. Identificar la función
            </strong>

            <div class="math-line">

                $$f(x) =
                ${escapeHTML(funcionOriginal)}$$

            </div>

        </div>

    `;


    if (antiderivada) {

        html += `

            <div class="procedure-step">

                <strong>
                    Paso 2. Encontrar la antiderivada
                </strong>

                <div class="math-line">

                    $$\\int ${escapeHTML(funcionOriginal)}\\,dx
                    =
                    ${escapeHTML(antiderivada)}
                    + C$$

                </div>

            </div>


            <div class="procedure-step">

                <strong>
                    Paso 3. Aplicar el Teorema Fundamental
                    del Cálculo
                </strong>

                <div class="math-line">

                    $$\\int_{${a}}^{${b}} f(x)\\,dx
                    =
                    F(${b})-F(${a})$$

                </div>

            </div>


            <div class="procedure-step">

                <strong>
                    Paso 4. Sustituir los límites
                </strong>

                <div class="math-line">

                    $$F(${b})-F(${a})$$

                </div>

            </div>


            <div class="procedure-step">

                <strong>
                    Paso 5. Resultado
                </strong>

                <div class="math-line">

                    $$\\boxed{
                    ${formatearNumero(valor)}
                    }$$

                </div>

            </div>

        `;

    }

    else {

        html += `

            <div class="procedure-step">

                <strong>
                    Paso 2. Método numérico
                </strong>

                <p>

                    La función se evalúa numéricamente
                    utilizando la Regla de Simpson.

                </p>

            </div>


            <div class="procedure-step">

                <strong>
                    Paso 3. Fórmula
                </strong>

                <div class="math-line">

                    $$\\int_a^b f(x)dx
                    \\approx
                    \\frac{h}{3}
                    [
                    f(x_0)
                    +
                    4f(x_1)
                    +
                    2f(x_2)
                    +\\cdots+
                    f(x_n)
                    ]$$

                </div>

            </div>


            <div class="procedure-step">

                <strong>
                    Paso 4. Resultado
                </strong>

                <div class="math-line">

                    $$\\boxed{
                    ${formatearNumero(valor)}
                    }$$

                </div>

            </div>

        `;

    }


    return html;
}


/* ============================================================
   ANTIDERIVADAS COMUNES
============================================================ */

function obtenerAntiderivadaComun(
    funcion
) {

    const f =
        funcion.replace(
            /\s+/g,
            ""
        );


    let match =
        f.match(
            /^x\^(-?\d+(?:\.\d+)?)$/
        );


    if (match) {

        const n =
            parseFloat(
                match[1]
            );


        if (n !== -1) {

            const nuevo =
                n + 1;


            return `x^${nuevo}/${nuevo}`;

        }


        return "ln(|x|)";

    }


    if (f === "x") {

        return "x^2/2";

    }


    if (
        /^-?\d+(?:\.\d+)?$/.test(f)
    ) {

        return `${f}x`;

    }


    if (f === "sin(x)") {

        return "-cos(x)";

    }


    if (f === "cos(x)") {

        return "sin(x)";

    }


    if (f === "tan(x)") {

        return "-ln(|cos(x)|)";

    }


    if (f === "exp(x)") {

        return "exp(x)";

    }


    if (f === "1/x") {

        return "ln(|x|)";

    }


    return null;

}


/* ============================================================
   DERIVADAS
============================================================ */

function calcularDerivada() {

    const funcionInput =
        document.getElementById(
            "derivadaFuncion"
        );


    const ordenInput =
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
        funcionInput.value.trim();


    const orden =
        parseInt(
            ordenInput.value
        );


    if (!funcionOriginal) {

        mostrarError(
            resultado,
            "Debes introducir una función."
        );

        procedimiento.innerHTML = "";

        return;

    }


    const funcion =
        normalizarFuncion(
            funcionOriginal
        );


    try {

        let expresion =
            math.parse(
                funcion
            );


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


        procedimiento.innerHTML =
            generarProcedimientoDerivada(
                funcionOriginal,
                resultados,
                orden
            );


        graficarDerivada(
            funcion,
            derivadaFinal,
            orden
        );


        actualizarMathJax();

    }

    catch (error) {

        console.error(
            "Error derivada:",
            error
        );


        mostrarError(
            resultado,
            "No fue posible calcular la derivada. Revisa la función."
        );


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
            📐 Desarrollo de la derivada
        </h4>


        <div class="procedure-step">

            <strong>
                Paso 1. Función original
            </strong>

            <div class="math-line">

                $$f(x)=
                ${escapeHTML(funcionOriginal)}$$

            </div>

        </div>

    `;


    resultados.forEach(
        function(
            derivada,
            index
        ) {

            const numero =
                index + 1;


            html += `

                <div class="procedure-step">

                    <strong>
                        Paso ${numero + 1}.
                        ${obtenerNombreOrden(numero)}
                        derivada
                    </strong>

                    <div class="math-line">

                        $$f^{(${numero})}(x)
                        =
                        ${escapeHTML(
                            formatearExpresion(
                                derivada
                            )
                        )}$$

                    </div>

                </div>

            `;

        }
    );


    html += `

        <div class="procedure-step">

            <strong>
                Resultado final
            </strong>

            <div class="math-line">

                $$\\boxed{
                f^{(${orden})}(x)
                =
                ${escapeHTML(
                    formatearExpresion(
                        resultados[orden - 1]
                    )
                )}
                }$$

            </div>

        </div>

    `;


    return html;

}


/* ============================================================
   LÍMITES
============================================================ */

function calcularLimite() {

    const funcionInput =
        document.getElementById(
            "limiteFuncion"
        );


    const puntoInput =
        document.getElementById(
            "limitePunto"
        );


    const tipoInput =
        document.getElementById(
            "tipoLimite"
        );


    const resultado =
        document.getElementById(
            "resultadoLimite"
        );


    const procedimiento =
        document.getElementById(
            "procedimientoLimite"
        );


    const funcionOriginal =
        funcionInput.value.trim();


    const puntoTexto =
        puntoInput.value.trim();


    const tipo =
        tipoInput.value;


    if (!funcionOriginal) {

        mostrarError(
            resultado,
            "Debes introducir una función."
        );

        procedimiento.innerHTML = "";

        return;

    }


    if (!puntoTexto) {

        mostrarError(
            resultado,
            "Debes introducir el punto al que x se aproxima."
        );

        procedimiento.innerHTML = "";

        return;

    }


    const funcion =
        normalizarFuncion(
            funcionOriginal
        );


    let punto;


    /*
       Reconocer infinito
    */

    if (
        puntoTexto === "∞" ||
        puntoTexto.toLowerCase() === "inf" ||
        puntoTexto.toLowerCase() === "+inf"
    ) {

        punto = Infinity;

    }

    else if (
        puntoTexto === "-∞" ||
        puntoTexto.toLowerCase() === "-inf"
    ) {

        punto = -Infinity;

    }

    else {

        punto =
            parseFloat(
                puntoTexto
            );

    }


    if (
        Number.isNaN(punto)
    ) {

        mostrarError(
            resultado,
            "El punto del límite no es válido."
        );

        procedimiento.innerHTML = "";

        return;

    }


    try {

        const analisis =
            analizarLimite(
                funcion,
                punto,
                tipo
            );


        mostrarResultadoLimite(
            resultado,
            funcionOriginal,
            puntoTexto,
            tipo,
            analisis
        );


        procedimiento.innerHTML =
            generarProcedimientoLimite(
                funcionOriginal,
                funcion,
                punto,
                puntoTexto,
                tipo,
                analisis
            );


        graficarLimite(
            funcion,
            punto
        );


        actualizarMathJax();

    }

    catch (error) {

        console.error(
            "Error límite:",
            error
        );


        mostrarError(
            resultado,
            "No fue posible calcular el límite. Revisa la función."
        );


        procedimiento.innerHTML = "";

    }

}


/* ============================================================
   ANALIZAR LÍMITE
============================================================ */

function analizarLimite(
    funcion,
    punto,
    tipo
) {

    /*
       Límite al infinito
    */

    if (
        punto === Infinity ||
        punto === -Infinity
    ) {

        return calcularLimiteInfinito(
            funcion,
            punto
        );

    }


    /*
       Sustitución directa
    */

    const sustitucion =
        evaluarFuncion(
            funcion,
            punto
        );


    /*
       Si la función está definida,
       ese puede ser directamente el límite.
    */

    if (
        sustitucion !== null &&
        isFinite(sustitucion)
    ) {

        return {

            tipoResultado:
                "directo",

            sustitucion:
                sustitucion,

            valor:
                sustitucion,

            izquierda:
                sustitucion,

            derecha:
                sustitucion

        };

    }


    /*
       Aproximación numérica
    */

    const izquierda =
        aproximarLimiteLado(
            funcion,
            punto,
            "izquierda"
        );


    const derecha =
        aproximarLimiteLado(
            funcion,
            punto,
            "derecha"
        );


    let valor = null;


    if (
        tipo === "izquierda"
    ) {

        valor = izquierda;

    }

    else if (
        tipo === "derecha"
    ) {

        valor = derecha;

    }

    else {

        /*
           Límite bilateral:
           ambos lados deben coincidir.
        */

        if (
            sonIguales(
                izquierda,
                derecha
            )
        ) {

            valor =
                promedioValores(
                    izquierda,
                    derecha
                );

        }

    }


    return {

        tipoResultado:
            "aproximado",

        sustitucion:
            null,

        valor:
            valor,

        izquierda:
            izquierda,

        derecha:
            derecha

    };

}


/* ============================================================
   APROXIMAR LÍMITE
============================================================ */

function aproximarLimiteLado(
    funcion,
    punto,
    lado
) {

    /*
       Distancias progresivamente pequeñas
    */

    const distancias = [

        1e-1,
        1e-2,
        1e-3,
        1e-4,
        1e-5,
        1e-6,
        1e-7,
        1e-8

    ];


    const valores = [];


    for (
        let i = 0;
        i < distancias.length;
        i++
    ) {

        let x;


        if (
            lado === "izquierda"
        ) {

            x =
                punto -
                distancias[i];

        }

        else {

            x =
                punto +
                distancias[i];

        }


        const y =
            evaluarFuncion(
                funcion,
                x
            );


        valores.push({
            x: x,
            y: y
        });

    }


    /*
       Tomar los últimos valores válidos
    */

    const validos =
        valores.filter(
            item =>
                item.y !== null &&
                isFinite(item.y)
        );


    if (
        validos.length === 0
    ) {

        /*
           Puede ser infinito.
        */

        const ultimo =
            valores[
                valores.length - 1
            ];


        if (
            ultimo.y !== null
        ) {

            if (
                ultimo.y > 1e10
            ) {

                return Infinity;

            }


            if (
                ultimo.y < -1e10
            ) {

                return -Infinity;

            }

        }


        return null;

    }


    /*
       Promediar los últimos tres valores
    */

    const ultimos =
        validos.slice(-3);


    const suma =
        ultimos.reduce(
            (
                acumulado,
                item
            ) =>
                acumulado + item.y,
            0
        );


    const promedio =
        suma /
        ultimos.length;


    /*
       Detectar divergencia positiva
    */

    if (
        promedio > 1e10
    ) {

        return Infinity;

    }


    /*
       Detectar divergencia negativa
    */

    if (
        promedio < -1e10
    ) {

        return -Infinity;

    }


    return promedio;

}


/* ============================================================
   COMPARAR VALORES
============================================================ */

function sonIguales(
    a,
    b
) {

    if (
        a === null ||
        b === null
    ) {

        return false;

    }


    if (
        a === Infinity &&
        b === Infinity
    ) {

        return true;

    }


    if (
        a === -Infinity &&
        b === -Infinity
    ) {

        return true;

    }


    if (
        !isFinite(a) ||
        !isFinite(b)
    ) {

        return false;

    }


    const tolerancia =
        1e-4 *
        Math.max(
            1,
            Math.abs(a),
            Math.abs(b)
        );


    return (
        Math.abs(a - b)
        < tolerancia
    );

}


/* ============================================================
   PROMEDIO
============================================================ */

function promedioValores(
    a,
    b
) {

    if (
        a === Infinity &&
        b === Infinity
    ) {

        return Infinity;

    }


    if (
        a === -Infinity &&
        b === -Infinity
    ) {

        return -Infinity;

    }


    return (
        a + b
    ) / 2;

}


/* ============================================================
   LÍMITES AL INFINITO
============================================================ */

function calcularLimiteInfinito(
    funcion,
    punto
) {

    const valoresX = [

        10,
        100,
        1000,
        10000,
        100000

    ];


    const signo =
        punto === Infinity
            ? 1
            : -1;


    const valores = [];


    valoresX.forEach(
        function(
            magnitud
        ) {

            const x =
                signo *
                magnitud;


            const y =
                evaluarFuncion(
                    funcion,
                    x
                );


            if (
                y !== null &&
                isFinite(y)
            ) {

                valores.push(y);

            }

        }
    );


    if (
        valores.length === 0
    ) {

        return {

            tipoResultado:
                "infinito",

            valor:
                null

        };

    }


    const ultimos =
        valores.slice(-3);


    const valor =
        ultimos.reduce(
            (
                suma,
                item
            ) =>
                suma + item,
            0
        ) /
        ultimos.length;


    /*
       Detectar crecimiento sin límite
    */

    if (
        Math.abs(valor) > 1e10
    ) {

        return {

            tipoResultado:
                "infinito",

            valor:
                valor > 0
                    ? Infinity
                    : -Infinity

        };

    }


    return {

        tipoResultado:
            "infinito",

        valor:
            valor

    };

}


/* ============================================================
   MOSTRAR RESULTADO DEL LÍMITE
============================================================ */

function mostrarResultadoLimite(
    resultado,
    funcionOriginal,
    puntoTexto,
    tipo,
    analisis
) {

    let valorTexto;


    if (
        analisis.valor === Infinity
    ) {

        valorTexto = "+∞";

    }

    else if (
        analisis.valor === -Infinity
    ) {

        valorTexto = "-∞";

    }

    else if (
        analisis.valor === null
    ) {

        valorTexto =
            "No existe";

    }

    else {

        valorTexto =
            formatearNumero(
                analisis.valor
            );

    }


    let tipoTexto;


    if (
        tipo === "izquierda"
    ) {

        tipoTexto =
            "por la izquierda";

    }

    else if (
        tipo === "derecha"
    ) {

        tipoTexto =
            "por la derecha";

    }

    else {

        tipoTexto =
            "bilateral";

    }


    resultado.innerHTML = `

        <div>

            <strong>
                Resultado del límite
            </strong>

        </div>


        <div class="result-symbolic">

            lim
            <sub>
                x → ${escapeHTML(puntoTexto)}
            </sub>

            ${escapeHTML(funcionOriginal)}

        </div>


        <div class="result-main">

            ${valorTexto}

        </div>


        <div class="result-decimal">

            Tipo: ${tipoTexto}

        </div>

    `;

}


/* ============================================================
   PROCEDIMIENTO DEL LÍMITE
============================================================ */

function generarProcedimientoLimite(
    funcionOriginal,
    funcion,
    punto,
    puntoTexto,
    tipo,
    analisis
) {

    let html = `

        <h4>
            📐 Desarrollo del límite
        </h4>


        <div class="procedure-step">

            <strong>
                Paso 1. Identificar la función
            </strong>

            <div class="math-line">

                $$f(x)=
                ${escapeHTML(funcionOriginal)}$$

            </div>

        </div>


        <div class="procedure-step">

            <strong>
                Paso 2. Identificar el punto
            </strong>

            <div class="math-line">

                $$x\\rightarrow
                ${escapeHTML(puntoTexto)}$$

            </div>

        </div>

    `;


    /*
       Límite al infinito
    */

    if (
        punto === Infinity ||
        punto === -Infinity
    ) {

        html += `

            <div class="procedure-step">

                <strong>
                    Paso 3. Analizar el comportamiento
                    cuando x tiende al infinito
                </strong>

                <p>

                    Se evalúa la función para valores
                    cada vez mayores de x.

                </p>

                <div class="math-line">

                    $$x=10,100,1000,10000,100000$$

                </div>

            </div>


            <div class="procedure-step">

                <strong>
                    Paso 4. Resultado
                </strong>

                <div class="math-line">

                    $$\\boxed{
                    ${textoResultado(
                        analisis.valor
                    )
                    }}$$

                </div>

            </div>

        `;


        return html;

    }


    /*
       Sustitución directa
    */

    if (
        analisis.tipoResultado ===
        "directo"
    ) {

        html += `

            <div class="procedure-step">

                <strong>
                    Paso 3. Sustitución directa
                </strong>

                <div class="math-line">

                    $$f(${puntoTexto})
                    =
                    ${formatearNumero(
                        analisis.sustitucion
                    )}$$

                </div>

            </div>


            <div class="procedure-step">

                <strong>
                    Paso 4. Resultado
                </strong>

                <div class="math-line">

                    $$\\boxed{
                    ${formatearNumero(
                        analisis.valor
                    )}
                    }$$

                </div>

            </div>

        `;


        return html;

    }


    /*
       Caso indeterminado / discontinuidad
    */

    html += `

        <div class="procedure-step">

            <strong>
                Paso 3. Sustitución directa
            </strong>

            <p>

                Al sustituir directamente el valor
                se obtiene una expresión no definida
                o una forma indeterminada.

            </p>

        </div>


        <div class="procedure-step">

            <strong>
                Paso 4. Analizar los límites laterales
            </strong>

            <div class="math-line">

                $$\\lim_{x\\rightarrow
                ${puntoTexto}^{-}}f(x)
                \\approx
                ${textoResultado(
                    analisis.izquierda
                )}$$

                <br>

                $$\\lim_{x\\rightarrow
                ${puntoTexto}^{+}}f(x)
                \\approx
                ${textoResultado(
                    analisis.derecha
                )}$$

            </div>

        </div>

    `;


    if (
        tipo === "bilateral"
    ) {

        if (
            sonIguales(
                analisis.izquierda,
                analisis.derecha
            )
        ) {

            html += `

                <div class="procedure-step">

                    <strong>
                        Paso 5. Comparar los límites laterales
                    </strong>

                    <p>

                        Como los límites laterales
                        coinciden, existe el límite bilateral.

                    </p>

                </div>


                <div class="procedure-step">

                    <strong>
                        Resultado
                    </strong>

                    <div class="math-line">

                        $$\\boxed{
                        ${textoResultado(
                            analisis.valor
                        )
                        }}$$

                    </div>

                </div>

            `;

        }

        else {

            html += `

                <div class="procedure-step">

                    <strong>
                        Resultado
                    </strong>

                    <p>

                        Los límites laterales no coinciden.
                        Por lo tanto, el límite bilateral
                        no existe.

                    </p>

                    <div class="math-line">

                        $$\\boxed{
                        \\text{No existe}
                        }$$

                    </div>

                </div>

            `;

        }

    }


    if (
        tipo === "izquierda"
    ) {

        html += `

            <div class="procedure-step">

                <strong>
                    Resultado por la izquierda
                </strong>

                <div class="math-line">

                    $$\\boxed{
                    ${textoResultado(
                        analisis.izquierda
                    )
                    }}$$

                </div>

            </div>

        `;

    }


    if (
        tipo === "derecha"
    ) {

        html += `

            <div class="procedure-step">

                <strong>
                    Resultado por la derecha
                </strong>

                <div class="math-line">

                    $$\\boxed{
                    ${textoResultado(
                        analisis.derecha
                    )
                    }}$$

                </div>

            </div>

        `;

    }


    return html;

}


/* ============================================================
   TEXTO RESULTADO
============================================================ */

function textoResultado(
    valor
) {

    if (
        valor === Infinity
    ) {

        return "+\\infty";

    }


    if (
        valor === -Infinity
    ) {

        return "-\\infty";

    }


    if (
        valor === null
    ) {

        return "\\text{No existe}";

    }


    return formatearNumero(
        valor
    );

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
        rango * .15;


    const inicio =
        Math.min(a,b) -
        margen;


    const fin =
        Math.max(a,b) +
        margen;


    const cantidad =
        600;


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


    const xArea = [];

    const yArea = [];


    for (
        let i = 0;
        i <= 300;
        i++
    ) {

        const valor =
            a +
            (b-a) *
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

        opacity: .35

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
            "Gráfica de la integral",

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
        "Función y área bajo la curva";

}


/* ============================================================
   GRÁFICA DERIVADA
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
            (fin-inicio) *
            i /
            (cantidad-1);


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
   GRÁFICA DE LÍMITE
============================================================ */

function graficarLimite(
    funcion,
    punto
) {

    /*
       Para límites al infinito
       usamos un rango más amplio.
    */

    let inicio;

    let fin;


    if (
        punto === Infinity
    ) {

        inicio = 0;

        fin = 20;

    }

    else if (
        punto === -Infinity
    ) {

        inicio = -20;

        fin = 0;

    }

    else {

        let rango = 5;


        if (
            Math.abs(punto) > 5
        ) {

            rango =
                Math.abs(punto) *
                .5;

        }


        inicio =
            punto - rango;

        fin =
            punto + rango;

    }


    const cantidad =
        700;


    const x = [];

    const y = [];


    for (
        let i = 0;
        i < cantidad;
        i++
    ) {

        const valor =
            inicio +
            (fin-inicio) *
            i /
            (cantidad-1);


        x.push(valor);


        y.push(
            evaluarFuncion(
                funcion,
                valor
            )
        );

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


    const traces = [
        traceFuncion
    ];


    /*
       Línea vertical para x = punto
    */

    if (
        isFinite(punto)
    ) {

        traces.push({

            x: [
                punto,
                punto
            ],

            y: [
                0,
                1
            ],

            type: "scatter",

            mode: "lines",

            name:
                `x = ${punto}`,

            line: {

                dash: "dot",

                width: 2

            }

        });

    }


    const layout = {

        title:
            "Gráfica del límite",

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
        traces,
        layout,
        {
            responsive: true,
            displaylogo: false
        }
    );


    document.getElementById(
        "graphDescription"
    ).textContent =
        "Comportamiento de la función alrededor del punto";

}


/* ============================================================
   EJEMPLOS
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
    ).value =
        funcion;


    document.getElementById(
        "integralA"
    ).value =
        a;


    document.getElementById(
        "integralB"
    ).value =
        b;


    calcularIntegral();

}


/* ============================================================
   EJEMPLO DERIVADA
============================================================ */

function ejemploDerivada(
    funcion
) {

    mostrarHerramienta(
        "derivada"
    );


    document.getElementById(
        "derivadaFuncion"
    ).value =
        funcion;


    document.getElementById(
        "ordenDerivada"
    ).value =
        1;


    calcularDerivada();

}


/* ============================================================
   EJEMPLO LÍMITE
============================================================ */

function ejemploLimite(
    funcion,
    punto
) {

    mostrarHerramienta(
        "limite"
    );


    document.getElementById(
        "limiteFuncion"
    ).value =
        funcion;


    document.getElementById(
        "limitePunto"
    ).value =
        punto;


    document.getElementById(
        "tipoLimite"
    ).value =
        "bilateral";


    calcularLimite();

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
    ).innerHTML =
        "Introduce una función y presiona \"Calcular integral\".";


    document.getElementById(
        "procedimientoIntegral"
    ).innerHTML = "";


    limpiarGrafica();

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
    ).innerHTML =
        "Introduce una función y presiona \"Calcular derivada\".";


    document.getElementById(
        "procedimientoDerivada"
    ).innerHTML = "";


    limpiarGrafica();

}


/* ============================================================
   LIMPIAR LÍMITE
============================================================ */

function limpiarLimite() {

    document.getElementById(
        "limiteFuncion"
    ).value = "";


    document.getElementById(
        "limitePunto"
    ).value = "";


    document.getElementById(
        "resultadoLimite"
    ).innerHTML =
        "Introduce una función y el punto al que x se aproxima.";


    document.getElementById(
        "procedimientoLimite"
    ).innerHTML = "";


    limpiarGrafica();

}


/* ============================================================
   LIMPIAR GRÁFICA
============================================================ */

function limpiarGrafica() {

    try {

        Plotly.purge(
            "grafica"
        );

    }

    catch {

    }


    document.getElementById(
        "graphDescription"
    ).textContent =
        "Esperando cálculo...";

}


/* ============================================================
   MOSTRAR ERROR
============================================================ */

function mostrarError(
    elemento,
    mensaje
) {

    elemento.innerHTML = `

        <div class="error-message">

            ⚠️ ${escapeHTML(mensaje)}

        </div>

    `;

}


/* ============================================================
   NOMBRE DEL ORDEN
============================================================ */

function obtenerNombreOrden(
    orden
) {

    const nombres = {

        1: "Primera",

        2: "Segunda",

        3: "Tercera",

        4: "Cuarta"

    };


    return (
        nombres[orden] ||
        `${orden}ª`
    );

}


/* ============================================================
   MATHJAX
============================================================ */

function actualizarMathJax() {

    if (
        window.MathJax &&
        MathJax.typesetPromise
    ) {

        MathJax.typesetPromise();

    }

}


/* ============================================================
   ENTER EN LOS CAMPOS
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


        const limiteInput =
            document.getElementById(
                "limiteFuncion"
            );


        if (integralInput) {

            integralInput.addEventListener(
                "keydown",
                function(event) {

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
                function(event) {

                    if (
                        event.key === "Enter"
                    ) {

                        calcularDerivada();

                    }

                }
            );

        }


        if (limiteInput) {

            limiteInput.addEventListener(
                "keydown",
                function(event) {

                    if (
                        event.key === "Enter"
                    ) {

                        calcularLimite();

                    }

                }
            );

        }


        /*
           Ejemplo inicial
        */

        calcularIntegral();

    }
);
