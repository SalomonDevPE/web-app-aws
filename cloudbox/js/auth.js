/* =========================================================
   CLOUDBOX
   AMAZON COGNITO
   AUTH.JS
========================================================= */


/* =========================================================
   CONFIGURACIÓN COGNITO
========================================================= */

const POOL_DATA = {

    UserPoolId:
        "us-east-1_UUxJ24QzU",

    ClientId:
        "1pertl4p9uja06gtqrfuu36qqs"

};


const userPool =
    new AmazonCognitoIdentity.CognitoUserPool(
        POOL_DATA
    );


/* =========================================================
   ESTADO DE AUTENTICACIÓN
========================================================= */

let pendingUser = null;

let forgotEmail = null;


/* =========================================================
   SESIÓN
========================================================= */

function saveSession(
    session,
    remember
) {

    const store =
        remember
            ? localStorage
            : sessionStorage;


    /* =====================================================
       ACCESS TOKEN
    ===================================================== */

    store.setItem(
        "cb_access",
        session
            .getAccessToken()
            .getJwtToken()
    );


    /* =====================================================
       ID TOKEN
    ===================================================== */

    store.setItem(
        "cb_id",
        session
            .getIdToken()
            .getJwtToken()
    );


    /* =====================================================
       REFRESH TOKEN
    ===================================================== */

    store.setItem(
        "cb_refresh",
        session
            .getRefreshToken()
            .getToken()
    );


    /* =====================================================
       EXPIRACIÓN
    ===================================================== */

    const expiration =
        session
            .getAccessToken()
            .getExpiration() * 1000;


    store.setItem(
        "cb_exp",
        String(expiration)
    );

}


/* =========================================================
   GUARDAR USUARIO
========================================================= */

function saveUser(
    user,
    remember
) {

    const store =
        remember
            ? localStorage
            : sessionStorage;


    store.setItem(
        "cb_user",
        JSON.stringify(user)
    );

}


/* =========================================================
   LOGIN
========================================================= */

function handleLogin(event) {

    event.preventDefault();

    hideAlert();


    /* =====================================================
       LIMPIAR ERRORES
    ===================================================== */

    clearFields(

        ["lgEmailGrp", "lgEmailErr"],

        ["lgPassGrp", "lgPassErr"]

    );


    /* =====================================================
       DATOS DEL FORMULARIO
    ===================================================== */

    const email =
        document.getElementById(
            "lgEmail"
        ).value.trim();


    const password =
        document.getElementById(
            "lgPass"
        ).value;


    const remember =
        document.getElementById(
            "remember"
        ).checked;


    let valid = true;


    /* =====================================================
       VALIDAR EMAIL
    ===================================================== */

    if (!isEmail(email)) {

        fieldErr(

            "lgEmailGrp",

            "lgEmailErr",

            true

        );

        valid = false;

    }


    /* =====================================================
       VALIDAR PASSWORD
    ===================================================== */

    if (!password) {

        fieldErr(

            "lgPassGrp",

            "lgPassErr",

            true

        );

        valid = false;

    }


    if (!valid) {

        return;

    }


    /* =====================================================
       LOADING
    ===================================================== */

    setLoading(

        "btnLogin",

        "lgSpinner",

        "lgBtnTxt",

        true,

        "Iniciar sesión"

    );


    /* =====================================================
       AUTHENTICATION DETAILS
    ===================================================== */

    const authDetails =
        new AmazonCognitoIdentity.AuthenticationDetails({

            Username: email,

            Password: password

        });


    /* =====================================================
       COGNITO USER
    ===================================================== */

    const cognitoUser =
        new AmazonCognitoIdentity.CognitoUser({

            Username: email,

            Pool: userPool

        });


    /* =====================================================
       AUTENTICAR
    ===================================================== */

    cognitoUser.authenticateUser(

        authDetails,

        {

            /* =============================================
               LOGIN EXITOSO
            ============================================= */

            onSuccess(session) {

                const payload =
                    session
                        .getIdToken()
                        .decodePayload();


                /* =========================================
                   GUARDAR SESIÓN
                ========================================= */

                saveSession(

                    session,

                    remember

                );


                /* =========================================
                   GUARDAR USUARIO
                ========================================= */

                saveUser(

                    {

                        name:
                            payload.name ||
                            payload[
                                "cognito:username"
                            ],

                        email:
                            payload.email

                    },

                    remember

                );


                /* =========================================
                   MENSAJE
                ========================================= */

                showAlert(

                    "¡Bienvenido! Redirigiendo…",

                    "success"

                );


                /* =========================================
                   REDIRECCIÓN
                ========================================= */

                setTimeout(

                    () => {

                        window.location.href =
                            "dashboard.html";

                    },

                    1000

                );

            },


            /* =============================================
               ERROR LOGIN
            ============================================= */

            onFailure(error) {

                setLoading(

                    "btnLogin",

                    "lgSpinner",

                    "lgBtnTxt",

                    false,

                    "Iniciar sesión"

                );


                const messages = {

                    NotAuthorizedException:
                        "Correo o contraseña incorrectos.",

                    UserNotFoundException:
                        "No existe una cuenta con ese correo.",

                    UserNotConfirmedException:
                        "Debes verificar tu correo antes de iniciar sesión.",

                    PasswordResetRequiredException:
                        "Debes restablecer tu contraseña.",

                    TooManyRequestsException:
                        "Demasiados intentos. Espera unos minutos.",

                    UserLambdaValidationException:
                        "Error de validación. Intenta de nuevo."

                };


                showAlert(

                    messages[error.code] ||

                    error.message ||

                    "Error al iniciar sesión.",

                    "error"

                );


                /* =========================================
                   USUARIO NO CONFIRMADO
                ========================================= */

                if (
                    error.code ===
                    "UserNotConfirmedException"
                ) {

                    pendingUser =
                        cognitoUser;


                    const verifyEmail =
                        document.getElementById(
                            "verifyEmail"
                        );


                    if (verifyEmail) {

                        verifyEmail.textContent =
                            email;

                    }


                    setTimeout(

                        () => {

                            showView(
                                "verify"
                            );

                        },

                        1500

                    );

                }

            },


            /* =============================================
               NUEVA PASSWORD OBLIGATORIA
            ============================================= */

            newPasswordRequired() {

                setLoading(

                    "btnLogin",

                    "lgSpinner",

                    "lgBtnTxt",

                    false,

                    "Iniciar sesión"

                );


                pendingUser =
                    cognitoUser;


                showAlert(

                    "Debes cambiar tu contraseña antes de continuar.",

                    "info"

                );


                showView(
                    "newPass"
                );

            }

        }

    );

}


/* =========================================================
   REGISTRO
========================================================= */

function handleRegister(event) {

    event.preventDefault();

    hideAlert();


    /* =====================================================
       LIMPIAR ERRORES
    ===================================================== */

    clearFields(

        ["rgNameGrp", "rgNameErr"],

        ["rgEmailGrp", "rgEmailErr"],

        ["rgPassGrp", "rgPassErr"],

        ["rgConfGrp", "rgConfErr"]

    );


    /* =====================================================
       DATOS
    ===================================================== */

    const name =
        document.getElementById(
            "rgName"
        ).value.trim();


    const email =
        document.getElementById(
            "rgEmail"
        ).value.trim();


    const password =
        document.getElementById(
            "rgPass"
        ).value;


    const confirm =
        document.getElementById(
            "rgConf"
        ).value;


    let valid = true;


    /* =====================================================
       VALIDAR NOMBRE
    ===================================================== */

    if (name.length < 2) {

        fieldErr(

            "rgNameGrp",

            "rgNameErr",

            true

        );

        valid = false;

    }


    /* =====================================================
       VALIDAR EMAIL
    ===================================================== */

    if (!isEmail(email)) {

        fieldErr(

            "rgEmailGrp",

            "rgEmailErr",

            true

        );

        valid = false;

    }


    /* =====================================================
       VALIDAR PASSWORD
    ===================================================== */

    if (!isStrongPass(password)) {

        fieldErr(

            "rgPassGrp",

            "rgPassErr",

            true

        );

        valid = false;

    }


    /* =====================================================
       CONFIRMAR PASSWORD
    ===================================================== */

    if (password !== confirm) {

        fieldErr(

            "rgConfGrp",

            "rgConfErr",

            true

        );

        valid = false;

    }


    if (!valid) {

        return;

    }


    /* =====================================================
       LOADING
    ===================================================== */

    setLoading(

        "btnRegister",

        "rgSpinner",

        "rgBtnTxt",

        true,

        "Crear cuenta"

    );


    /* =====================================================
       CREAR USUARIO COGNITO
    ===================================================== */

    userPool.signUp(

        email,

        password,

        [

            new AmazonCognitoIdentity.CognitoUserAttribute({

                Name: "name",

                Value: name

            })

        ],

        null,

        (

            error,

            result

        ) => {

            /* =============================================
               QUITAR LOADING
            ============================================= */

            setLoading(

                "btnRegister",

                "rgSpinner",

                "rgBtnTxt",

                false,

                "Crear cuenta"

            );


            /* =============================================
               ERROR
            ============================================= */

            if (error) {

                showAlert(

                    error.message ||

                    "No se pudo crear la cuenta.",

                    "error"

                );

                return;

            }


            /* =============================================
               USUARIO PENDIENTE
            ============================================= */

            pendingUser =
                result.user;


            const verifyEmail =
                document.getElementById(
                    "verifyEmail"
                );


            if (verifyEmail) {

                verifyEmail.textContent =
                    email;

            }


            /* =============================================
               MENSAJE
            ============================================= */

            showAlert(

                "Cuenta creada. Revisa tu correo.",

                "success"

            );


            /* =============================================
               IR A VERIFICACIÓN
            ============================================= */

            setTimeout(

                () => {

                    showView(
                        "verify"
                    );

                },

                1000

            );

        }

    );

}


/* =========================================================
   VERIFICAR EMAIL
========================================================= */

function handleVerify() {

    const code =
        getCode();


    /* =====================================================
       VALIDAR USUARIO
    ===================================================== */

    if (!pendingUser) {

        showAlert(

            "Sesión expirada. Regístrate nuevamente.",

            "error"

        );

        return;

    }


    /* =====================================================
       VALIDAR CÓDIGO
    ===================================================== */

    if (
        !code ||
        code.length !== 6
    ) {

        showAlert(

            "Ingresa el código de 6 dígitos.",

            "error"

        );

        return;

    }


    /* =====================================================
       CONFIRMAR REGISTRO
    ===================================================== */

    pendingUser.confirmRegistration(

        code,

        true,

        error => {

            if (error) {

                showAlert(

                    error.message ||

                    "Código incorrecto.",

                    "error"

                );

                return;

            }


            /* =============================================
               ÉXITO
            ============================================= */

            showAlert(

                "Correo verificado correctamente.",

                "success"

            );


            pendingUser = null;


            clearVerificationCode();


            /* =============================================
               VOLVER AL LOGIN
            ============================================= */

            setTimeout(

                () => {

                    showView(
                        "login"
                    );

                },

                1200

            );

        }

    );

}


/* =========================================================
   REENVIAR CÓDIGO
========================================================= */

function resendCode() {

    if (!pendingUser) {

        showAlert(

            "No hay una cuenta pendiente de verificación.",

            "error"

        );

        return;

    }


    pendingUser.resendConfirmationCode(

        error => {

            if (error) {

                showAlert(

                    error.message ||

                    "No se pudo reenviar el código.",

                    "error"

                );

                return;

            }


            showAlert(

                "Nuevo código enviado.",

                "success"

            );

        }

    );

}


/* =========================================================
   RECUPERAR CONTRASEÑA
========================================================= */

function handleForgot() {

    const email =
        document.getElementById(
            "fpEmail"
        ).value.trim();


    /* =====================================================
       VALIDAR EMAIL
    ===================================================== */

    if (!isEmail(email)) {

        showAlert(

            "Ingresa un correo válido.",

            "error"

        );

        return;

    }


    /* =====================================================
       CREAR USUARIO COGNITO
    ===================================================== */

    const user =
        new AmazonCognitoIdentity.CognitoUser({

            Username: email,

            Pool: userPool

        });


    /* =====================================================
       SOLICITAR RESET
    ===================================================== */

    user.forgotPassword({

        onSuccess() {

            forgotEmail =
                email;


            pendingUser =
                user;


            const verifyEmail =
                document.getElementById(
                    "verifyEmail"
                );


            if (verifyEmail) {

                verifyEmail.textContent =
                    email;

            }


            showAlert(

                "Código enviado a tu correo.",

                "success"

            );


            showView(
                "newPass"
            );

        },


        onFailure(error) {

            showAlert(

                error.message ||

                "No se pudo enviar el código.",

                "error"

            );

        }

    });

}


/* =========================================================
   NUEVA CONTRASEÑA
========================================================= */

function handleNewPassword() {

    const code =
        document.getElementById(
            "npCode"
        ).value.trim();


    const password =
        document.getElementById(
            "npPass"
        ).value;


    /* =====================================================
       VALIDAR CÓDIGO
    ===================================================== */

    if (
        !code ||
        code.length < 6
    ) {

        showAlert(

            "Ingresa el código de 6 dígitos.",

            "error"

        );

        return;

    }


    /* =====================================================
       VALIDAR PASSWORD
    ===================================================== */

    if (!isStrongPass(password)) {

        showAlert(

            "La contraseña no cumple los requisitos.",

            "error"

        );

        return;

    }


    /* =====================================================
       VALIDAR USUARIO
    ===================================================== */

    if (!pendingUser) {

        showAlert(

            "Sesión expirada. Solicita el código nuevamente.",

            "error"

        );

        return;

    }


    /* =====================================================
       CAMBIAR PASSWORD
    ===================================================== */

    pendingUser.confirmPassword(

        code,

        password,

        {

            onSuccess() {

                showAlert(

                    "¡Contraseña actualizada! Ya puedes iniciar sesión.",

                    "success"

                );


                pendingUser = null;

                forgotEmail = null;


                /* =========================================
                   VOLVER AL LOGIN
                ========================================= */

                setTimeout(

                    () => {

                        showView(
                            "login"
                        );

                    },

                    1500

                );

            },


            onFailure(error) {

                showAlert(

                    error.message ||

                    "Error al cambiar la contraseña.",

                    "error"

                );

            }

        }

    );

}


/* =========================================================
   COMPROBAR SESIÓN
========================================================= */

function checkSession() {

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
       NO EXISTE SESIÓN
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
       TOKEN EXPIRADO
    ===================================================== */

    localStorage.removeItem("cb_access");
    localStorage.removeItem("cb_id");
    localStorage.removeItem("cb_refresh");
    localStorage.removeItem("cb_exp");
    localStorage.removeItem("cb_user");


    sessionStorage.removeItem("cb_access");
    sessionStorage.removeItem("cb_id");
    sessionStorage.removeItem("cb_refresh");
    sessionStorage.removeItem("cb_exp");
    sessionStorage.removeItem("cb_user");


    return false;

}


/* =========================================================
   PROTEGER LOGIN
========================================================= */

function protectLoginPage() {

    if (checkSession()) {

        window.location.replace(
            "dashboard.html"
        );

    }

}

document.addEventListener(
    "DOMContentLoaded",
    function () {

        protectLoginPage();

    }
);