/* =========================================================
   CLOUDBOX
   COMPONENTS.JS
   =========================================================

   RESPONSABILIDADES:

   1. Cargar componentes HTML
      - Header
      - Sidebar
      - Footer

   2. Inicializar AdminLTE 4

   3. Tema claro / oscuro

   4. Cerrar sesión

   5. Interfaz de autenticación
      - Login
      - Register
      - Verify
      - Forgot password
      - New password

   6. Alertas

   7. Validaciones

   8. Mostrar / ocultar contraseña

   9. Fortaleza de contraseña

   10. Código de verificación

========================================================= */


/* =========================================================
   CARGAR COMPONENTE
========================================================= */

async function loadComponent(file) {

    try {

        const response = await fetch(file);

        if (!response.ok) {

            throw new Error(
                `No se pudo cargar ${file}`
            );

        }

        return await response.text();

    }

    catch (error) {

        console.error(
            `Error cargando ${file}:`,
            error
        );

        return "";

    }

}


/* =========================================================
   CARGAR COMPONENTES
========================================================= */

async function loadComponents() {

    const appWrapper =
        document.querySelector(".app-wrapper");

    const appMain =
        document.querySelector(".app-main");


    /*
     * Si estamos en Login,
     * no necesitamos cargar Header,
     * Sidebar ni Footer.
     */

    if (!appWrapper || !appMain) {

        initializeAuthComponents();

        return;

    }


    /* =====================================================
       CARGAR HTML
    ===================================================== */

    const [
        headerHTML,
        sidebarHTML,
        footerHTML
    ] = await Promise.all([

        loadComponent(
            "components/header.html"
        ),

        loadComponent(
            "components/sidebar.html"
        ),

        loadComponent(
            "components/footer.html"
        )

    ]);


    /* =====================================================
       INSERTAR HEADER
    ===================================================== */

    appWrapper.insertAdjacentHTML(
        "afterbegin",
        headerHTML
    );


    /* =====================================================
       INSERTAR SIDEBAR
    ===================================================== */

    const header =
        appWrapper.querySelector(".app-header");


    if (header) {

        header.insertAdjacentHTML(
            "afterend",
            sidebarHTML
        );

    }


    /* =====================================================
       INSERTAR FOOTER
    ===================================================== */

    appMain.insertAdjacentHTML(
        "afterend",
        footerHTML
    );


    /* =====================================================
       INICIALIZAR COMPONENTES
    ===================================================== */

    initializeComponents();


    /* =====================================================
       INICIALIZAR ADMINLTE
    ===================================================== */

    initializeAdminLTE();

}


/* =========================================================
   INICIALIZAR COMPONENTES CLOUDBOX
========================================================= */

function initializeComponents() {

    initializeTheme();

    initializeLogout();

}


/* =========================================================
   INICIALIZAR COMPONENTES DE AUTENTICACIÓN
========================================================= */

function initializeAuthComponents() {

    initializeTheme();

}


/* =========================================================
   ADMINLTE 4
========================================================= */

function initializeAdminLTE() {

    /*
     * Los componentes se cargan dinámicamente.
     *
     * AdminLTE 4 ya está cargado mediante:
     *
     * adminlte.min.js
     */

    if (
        window.adminlte &&
        typeof window.adminlte.initialize === "function"
    ) {

        window.adminlte.initialize();

        console.log(
            "AdminLTE 4 inicializado correctamente."
        );

    }

    else {

        console.warn(
            "AdminLTE 4 no expone adminlte.initialize()."
        );

    }

}


/* =========================================================
   TEMA
========================================================= */

function initializeTheme() {

    const themeToggle =
        document.getElementById("themeToggle");


    const themeIcon =
        document.getElementById("themeIcon");


    /*
     * Compatibilidad con Login
     * que puede utilizar themeBtn.
     */

    const themeButton =
        themeToggle ||
        document.getElementById("themeBtn");


    const icon =
        themeIcon ||
        document.getElementById("themeIcon");


    if (!themeButton || !icon) {

        return;

    }


    /* =====================================================
       TEMA GUARDADO
    ===================================================== */

    const savedTheme =
        localStorage.getItem(
            "cloudbox-theme"
        ) || "light";


    document.documentElement.setAttribute(
        "data-bs-theme",
        savedTheme
    );


    updateThemeIcon(
        savedTheme,
        icon,
        themeButton
    );


    /* =====================================================
       EVITAR EVENTOS DUPLICADOS
    ===================================================== */

    if (
        themeButton.dataset.themeInitialized === "true"
    ) {

        return;

    }


    themeButton.dataset.themeInitialized = "true";


    /* =====================================================
       CAMBIAR TEMA
    ===================================================== */

    themeButton.addEventListener(
        "click",
        function () {

            const currentTheme =
                document.documentElement.getAttribute(
                    "data-bs-theme"
                );


            const newTheme =
                currentTheme === "dark"
                    ? "light"
                    : "dark";


            document.documentElement.setAttribute(
                "data-bs-theme",
                newTheme
            );


            localStorage.setItem(
                "cloudbox-theme",
                newTheme
            );


            updateThemeIcon(
                newTheme,
                icon,
                themeButton
            );

        }
    );

}


/* =========================================================
   ICONO DEL TEMA
========================================================= */

function updateThemeIcon(
    theme,
    themeIcon,
    themeToggle
) {

    if (!themeIcon || !themeToggle) {

        return;

    }


    if (theme === "dark") {

        themeIcon.className =
            "bi bi-sun";


        themeToggle.title =
            "Cambiar a modo claro";

    }

    else {

        themeIcon.className =
            "bi bi-moon";


        themeToggle.title =
            "Cambiar a modo oscuro";

    }

}


/* =========================================================
   CERRAR SESIÓN
========================================================= */

function initializeLogout() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (!logoutButton) {

        return;

    }


    /*
     * Evitar registrar el evento
     * más de una vez.
     */

    if (
        logoutButton.dataset.logoutInitialized === "true"
    ) {

        return;

    }


    logoutButton.dataset.logoutInitialized = "true";


    logoutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            /* =============================================
               LOCAL STORAGE
            ============================================= */

            localStorage.removeItem(
                "cb_access"
            );

            localStorage.removeItem(
                "cb_exp"
            );


            /* =============================================
               SESSION STORAGE
            ============================================= */

            sessionStorage.removeItem(
                "cb_access"
            );

            sessionStorage.removeItem(
                "cb_exp"
            );


            /* =============================================
               REDIRECCIÓN
            ============================================= */

            window.location.replace(
                "login.html"
            );

        }
    );

}


/* =========================================================
   VISTAS DE AUTENTICACIÓN
========================================================= */

const VIEWS = [

    "login",
    "register",
    "verify",
    "forgot",
    "newPass"

];


/* =========================================================
   OBTENER ELEMENTO DE VISTA
========================================================= */

function getViewElement(name) {

    const id =
        "view" +
        name.charAt(0).toUpperCase() +
        name.slice(1);


    return document.getElementById(id);

}


/* =========================================================
   MOSTRAR VISTA
========================================================= */

function showView(name) {

    hideAlert();


    VIEWS.forEach(
        function (view) {

            const element =
                getViewElement(view);


            if (!element) {

                return;

            }


            element.style.display =
                view === name
                    ? "block"
                    : "none";

        }
    );

}


/* =========================================================
   ALERTAS
========================================================= */

function showAlert(
    message,
    type = "info"
) {

    const alert =
        document.getElementById("alert");


    const icon =
        document.getElementById("alertIcon");


    const messageElement =
        document.getElementById("alertMsg");


    if (!alert) {

        return;

    }


    alert.className =
        "cb-alert show " + type;


    const icons = {

        error:
            "bi bi-exclamation-circle-fill",

        success:
            "bi bi-check-circle-fill",

        info:
            "bi bi-info-circle-fill"

    };


    if (icon) {

        icon.className =
            icons[type] || icons.info;

    }


    if (messageElement) {

        messageElement.textContent =
            message;

    }


    alert.scrollIntoView({

        behavior: "smooth",

        block: "nearest"

    });

}


/* =========================================================
   OCULTAR ALERTA
========================================================= */

function hideAlert() {

    const alert =
        document.getElementById("alert");


    if (!alert) {

        return;

    }


    alert.className =
        "cb-alert";

}


/* =========================================================
   ERRORES POR CAMPO
========================================================= */

function fieldErr(
    groupId,
    errorId,
    show,
    message
) {

    const group =
        document.getElementById(groupId);


    const error =
        document.getElementById(errorId);


    if (group) {

        group.classList.toggle(
            "error",
            show
        );

    }


    if (error) {

        if (message) {

            error.textContent =
                message;

        }


        error.classList.toggle(
            "show",
            show
        );

    }

}


/* =========================================================
   LIMPIAR ERRORES
========================================================= */

function clearFields(...pairs) {

    pairs.forEach(
        function ([groupId, errorId]) {

            fieldErr(
                groupId,
                errorId,
                false
            );

        }
    );

}


/* =========================================================
   MOSTRAR / OCULTAR PASSWORD
========================================================= */

function togglePass(
    inputId,
    iconId
) {

    const input =
        document.getElementById(inputId);


    const icon =
        document.getElementById(iconId);


    if (!input || !icon) {

        return;

    }


    const shouldShow =
        input.type === "password";


    input.type =
        shouldShow
            ? "text"
            : "password";


    icon.className =
        shouldShow
            ? "bi bi-eye-slash"
            : "bi bi-eye";

}


/* =========================================================
   PASSWORD STRENGTH
========================================================= */

const S_COLORS = [

    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e"

];


const S_LABELS = [

    "Muy débil",
    "Débil",
    "Regular",
    "Segura ✓"

];


/* =========================================================
   ACTUALIZAR SEGMENTO DE FORTALEZA
========================================================= */

function updateStrengthSegment(
    id,
    score
) {

    const element =
        document.getElementById(id);


    if (!element) {

        return;

    }


    element.style.background =
        score > 0
            ? S_COLORS[score - 1]
            : "var(--cb-border)";

}


/* =========================================================
   COMPROBAR FORTALEZA
========================================================= */

function checkStrength(value) {

    let score = 0;


    /*
     * Mínimo 8 caracteres
     */

    if (value.length >= 8) {

        score++;

    }


    /*
     * Mayúscula
     */

    if (/[A-Z]/.test(value)) {

        score++;

    }


    /*
     * Número
     */

    if (/[0-9]/.test(value)) {

        score++;

    }


    /*
     * Carácter especial
     */

    if (/[^A-Za-z0-9]/.test(value)) {

        score++;

    }


    /* =====================================================
       PASSWORD NORMAL
    ===================================================== */

    [
        "s1",
        "s2",
        "s3",
        "s4"

    ].forEach(
        function (id, index) {

            const element =
                document.getElementById(id);


            if (!element) {

                return;

            }


            element.style.background =
                index < score
                    ? S_COLORS[score - 1]
                    : "var(--cb-border)";

        }
    );


    /* =====================================================
       NUEVA PASSWORD
    ===================================================== */

    [
        "ns1",
        "ns2",
        "ns3",
        "ns4"

    ].forEach(
        function (id, index) {

            const element =
                document.getElementById(id);


            if (!element) {

                return;

            }


            element.style.background =
                index < score
                    ? S_COLORS[score - 1]
                    : "var(--cb-border)";

        }
    );


    /* =====================================================
       LABELS
    ===================================================== */

    const label =
        document.getElementById("sLbl");


    const newPasswordLabel =
        document.getElementById("nsLbl");


    /*
     * Password vacía
     */

    if (value.length === 0) {

        if (label) {

            label.textContent = "";

            label.style.color = "";

        }


        if (newPasswordLabel) {

            newPasswordLabel.textContent = "";

            newPasswordLabel.style.color = "";

        }


        return;

    }


    const text =
        S_LABELS[score - 1] ||
        S_LABELS[0];


    const color =
        S_COLORS[score - 1] ||
        S_COLORS[0];


    if (label) {

        label.textContent =
            text;

        label.style.color =
            color;

    }


    if (newPasswordLabel) {

        newPasswordLabel.textContent =
            text;

        newPasswordLabel.style.color =
            color;

    }

}


/* =========================================================
   VALIDAR EMAIL
========================================================= */

function isEmail(value) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        value
    );

}


/* =========================================================
   VALIDAR PASSWORD
========================================================= */

function isStrongPass(value) {

    return (

        value.length >= 8 &&

        /[A-Z]/.test(value) &&

        /[0-9]/.test(value) &&

        /[^A-Za-z0-9]/.test(value)

    );

}


/* =========================================================
   LOADING BUTTON
========================================================= */

function setLoading(
    buttonId,
    spinnerId,
    textId,
    loading,
    defaultLabel
) {

    const button =
        document.getElementById(buttonId);


    const spinner =
        document.getElementById(spinnerId);


    const text =
        document.getElementById(textId);


    if (button) {

        button.disabled =
            loading;

    }


    if (spinner) {

        spinner.style.display =
            loading
                ? "inline-block"
                : "none";

    }


    if (text) {

        text.textContent =
            loading
                ? "Procesando…"
                : defaultLabel;

    }

}


/* =========================================================
   CÓDIGO DE VERIFICACIÓN
========================================================= */

function codeInput(index) {

    const input =
        document.getElementById(
            "c" + index
        );


    if (!input) {

        return;

    }


    /*
     * Permitir solamente números.
     */

    input.value =
        input.value.replace(
            /\D/g,
            ""
        );


    /*
     * Pasar automáticamente al siguiente campo.
     */

    if (
        input.value &&
        index < 5
    ) {

        const next =
            document.getElementById(
                "c" + (index + 1)
            );


        if (next) {

            next.focus();

        }

    }


    /*
     * Auto-verificar cuando
     * se completan los seis dígitos.
     */

    const code =
        getCode();


    if (code.length === 6) {

        if (
            typeof handleVerify === "function"
        ) {

            handleVerify();

        }

    }

}


/* =========================================================
   RETROCESO DEL CÓDIGO
========================================================= */

function codeBack(
    event,
    index
) {

    if (
        event.key === "Backspace" &&
        !document.getElementById(
            "c" + index
        ).value &&
        index > 0
    ) {

        const previous =
            document.getElementById(
                "c" + (index - 1)
            );


        if (previous) {

            previous.focus();

        }

    }

}


/* =========================================================
   OBTENER CÓDIGO
========================================================= */

function getCode() {

    return [

        0,
        1,
        2,
        3,
        4,
        5

    ]

    .map(
        function (index) {

            const input =
                document.getElementById(
                    "c" + index
                );


            return input
                ? input.value
                : "";

        }
    )

    .join("");

}


/* =========================================================
   LIMPIAR CÓDIGO
========================================================= */

function clearVerificationCode() {

    for (
        let index = 0;
        index < 6;
        index++
    ) {

        const input =
            document.getElementById(
                "c" + index
            );


        if (input) {

            input.value = "";

        }

    }


    const first =
        document.getElementById("c0");


    if (first) {

        first.focus();

    }

}

/* =========================================================
   SESIÓN
========================================================= */

function hasValidSession() {

    const accessToken =
        localStorage.getItem("cb_access") ||
        sessionStorage.getItem("cb_access");


    const expiration =
        parseInt(

            localStorage.getItem("cb_exp") ||
            sessionStorage.getItem("cb_exp") ||
            "0",

            10

        );


    /* =====================================================
       NO EXISTE TOKEN
    ===================================================== */

    if (!accessToken) {

        return false;

    }


    /* =====================================================
       TOKEN VÁLIDO
    ===================================================== */

    if (
        expiration &&
        Date.now() < expiration
    ) {

        return true;

    }


    /* =====================================================
       SESIÓN EXPIRADA
    ===================================================== */

    clearSession();

    return false;

}


/* =========================================================
   LIMPIAR SESIÓN
========================================================= */

function clearSession() {

    /* =====================================================
       LOCAL STORAGE
    ===================================================== */

    localStorage.removeItem("cb_access");
    localStorage.removeItem("cb_id");
    localStorage.removeItem("cb_refresh");
    localStorage.removeItem("cb_exp");
    localStorage.removeItem("cb_user");


    /* =====================================================
       SESSION STORAGE
    ===================================================== */

    sessionStorage.removeItem("cb_access");
    sessionStorage.removeItem("cb_id");
    sessionStorage.removeItem("cb_refresh");
    sessionStorage.removeItem("cb_exp");
    sessionStorage.removeItem("cb_user");

}


/* =========================================================
   PROTEGER DASHBOARD
========================================================= */

function requireSession() {

    if (!hasValidSession()) {

        window.location.replace(
            "login.html"
        );

        return false;

    }

    return true;

}
/* =========================================================
   INICIAR CLOUDBOX
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadComponents();

    }
);