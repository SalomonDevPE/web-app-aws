/* =========================================================
   CLOUDBOX
   DASHBOARD.JS
   ========================================================= */


/* =========================================================
   DATOS DE DEMOSTRACIÓN
   ========================================================= */

const carpetas = [

    {
        id: 1,
        nombre: "Documentos",
        archivos: 126,
        tamaño: "8.4 GB"
    },

    {
        id: 2,
        nombre: "Proyectos",
        archivos: 85,
        tamaño: "12.7 GB"
    },

    {
        id: 3,
        nombre: "Trabajo",
        archivos: 214,
        tamaño: "18.2 GB"
    },

    {
        id: 4,
        nombre: "Imágenes",
        archivos: 362,
        tamaño: "15.6 GB"
    },

    {
        id: 5,
        nombre: "Música",
        archivos: 184,
        tamaño: "6.3 GB"
    },

    {
        id: 6,
        nombre: "Personal",
        archivos: 74,
        tamaño: "3.1 GB"
    }

];


const archivos = [

    {
        id: 1,
        nombre: "Informe mensual.pdf",
        tipo: "PDF",
        extension: "pdf",
        propietario: "Salomón",
        modificado: "2026-08-28T15:42:00",
        fechaTexto: "Hoy, 15:42",
        tamaño: "4.8 MB",
        tamañoBytes: 4800000,

        url:
            "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    },


    {
        id: 2,
        nombre: "Proyecto CloudBox.docx",
        tipo: "Microsoft Word",
        extension: "docx",
        propietario: "Salomón",
        modificado: "2026-08-28T12:25:00",
        fechaTexto: "Hoy, 12:25",
        tamaño: "2.1 MB",
        tamañoBytes: 2100000
    },


    {
        id: 3,
        nombre: "Inventario.xlsx",
        tipo: "Microsoft Excel",
        extension: "xlsx",
        propietario: "Salomón",
        modificado: "2026-08-27T18:32:00",
        fechaTexto: "Ayer, 18:32",
        tamaño: "1.7 MB",
        tamañoBytes: 1700000
    },


    {
        id: 4,
        nombre: "Diseño CloudBox.png",
        tipo: "Imagen PNG",
        extension: "png",
        propietario: "Salomón",
        modificado: "2026-08-27T14:20:00",
        fechaTexto: "Ayer, 14:20",
        tamaño: "3.8 MB",
        tamañoBytes: 3800000,

        url:
            "https://placehold.co/1200x800/png?text=CloudBox"
    },


    {
        id: 5,
        nombre: "Proyecto.zip",
        tipo: "Archivo comprimido",
        extension: "zip",
        propietario: "Salomón",
        modificado: "2026-08-25T10:15:00",
        fechaTexto: "25 Ago, 2026",
        tamaño: "18.6 MB",
        tamañoBytes: 18600000
    },


    {
        id: 6,
        nombre: "BaseDatos.sql",
        tipo: "Archivo SQL",
        extension: "sql",
        propietario: "Salomón",
        modificado: "2026-08-24T16:40:00",
        fechaTexto: "24 Ago, 2026",
        tamaño: "4.2 MB",
        tamañoBytes: 4200000
    },


    {
        id: 7,
        nombre: "Presentación CloudBox.pptx",
        tipo: "Microsoft PowerPoint",
        extension: "pptx",
        propietario: "Salomón",
        modificado: "2026-08-23T11:30:00",
        fechaTexto: "23 Ago, 2026",
        tamaño: "8.4 MB",
        tamañoBytes: 8400000
    },


    {
        id: 8,
        nombre: "Logo CloudBox.svg",
        tipo: "Imagen SVG",
        extension: "svg",
        propietario: "Salomón",
        modificado: "2026-08-22T09:10:00",
        fechaTexto: "22 Ago, 2026",
        tamaño: "245 KB",
        tamañoBytes: 245000,

        url:
            "https://placehold.co/800x500/png?text=CloudBox+SVG"
    },


    {
        id: 9,
        nombre: "Notas del proyecto.txt",
        tipo: "Documento de texto",
        extension: "txt",
        propietario: "Salomón",
        modificado: "2026-08-21T18:20:00",
        fechaTexto: "21 Ago, 2026",
        tamaño: "32 KB",
        tamañoBytes: 32000
    },


    {
        id: 10,
        nombre: "Código fuente.rar",
        tipo: "Archivo comprimido",
        extension: "rar",
        propietario: "Salomón",
        modificado: "2026-08-20T14:50:00",
        fechaTexto: "20 Ago, 2026",
        tamaño: "24.8 MB",
        tamañoBytes: 24800000
    }

];


/* =========================================================
   REFERENCIAS DOM
   ========================================================= */

const foldersContainer =
    document.getElementById("foldersContainer");

const folderCount =
    document.getElementById("folderCount");

const filesTableBody =
    document.getElementById("filesTableBody");

const filesGrid =
    document.getElementById("filesGrid");

const itemCount =
    document.getElementById("itemCount");

const tableCount =
    document.getElementById("tableCount");

const emptyState =
    document.getElementById("emptyState");

const listView =
    document.getElementById("listView");

const gridView =
    document.getElementById("gridView");

const listViewButton =
    document.getElementById("listViewButton");

const gridViewButton =
    document.getElementById("gridViewButton");

const fileSearch =
    document.getElementById("fileSearch");

const globalSearch =
    document.getElementById("globalSearch");

const sortFiles =
    document.getElementById("sortFiles");

const selectAllFiles =
    document.getElementById("selectAllFiles");

const selectedCount =
    document.getElementById("selectedCount");

const themeToggle =
    document.getElementById("themeToggle");

const themeIcon =
    document.getElementById("themeIcon");

const newFolderButton =
    document.getElementById("newFolderButton");

const uploadButton =
    document.getElementById("uploadButton");

const logoutButton =
    document.getElementById("logoutButton");

/* =========================================================
   USUARIO ACTUAL
   ========================================================= */

const currentUserName =
    document.getElementById(
        "currentUserName"
    );

const currentUserAvatar =
    document.getElementById(
        "currentUserAvatar"
    );


let currentUser = {

    name: "Usuario",

    email: ""

};


/* =========================================================
   CARGAR USUARIO
   ========================================================= */

function loadCurrentUser() {

    const userData =
        localStorage.getItem("cb_user") ||
        sessionStorage.getItem("cb_user");


    if (!userData) {

        console.warn(
            "No se encontró el usuario de CloudBox."
        );

        return;

    }


    try {

        currentUser =
            JSON.parse(userData);


        const name =
            currentUser.name ||
            currentUser.email ||
            "Usuario";


        /* =============================================
           NOMBRE EN HEADER
        ============================================== */

        if (
            currentUserName
        ) {

            currentUserName.textContent =
                name;

        }


        /* =============================================
           INICIALES
        ============================================== */

        if (
            currentUserAvatar
        ) {

            const initials =
                name
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map(
                        word =>
                            word
                                .charAt(0)
                                .toUpperCase()
                    )
                    .join("");


            currentUserAvatar.textContent =
                initials || "U";

        }


        console.log(
            "Usuario autenticado:",
            currentUser
        );

    }
    catch (error) {

        console.error(
            "Error leyendo el usuario:",
            error
        );

    }

}
/* =========================================================
   INICIALES DEL USUARIO
   ========================================================= */

function getUserInitials() {

    const name =
        currentUser.name ||
        currentUser.email ||
        "Usuario";


    return name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(
            word =>
                word
                    .charAt(0)
                    .toUpperCase()
        )
        .join("") || "U";

}
/* =========================================================
   ICONOS DE ARCHIVOS
   ========================================================= */

function getFileIcon(extension) {

    const icons = {

        pdf:
            "bi-file-earmark-pdf-fill",

        doc:
            "bi-file-earmark-word-fill",

        docx:
            "bi-file-earmark-word-fill",

        xls:
            "bi-file-earmark-excel-fill",

        xlsx:
            "bi-file-earmark-excel-fill",

        ppt:
            "bi-file-earmark-ppt-fill",

        pptx:
            "bi-file-earmark-ppt-fill",

        png:
            "bi-file-earmark-image-fill",

        jpg:
            "bi-file-earmark-image-fill",

        jpeg:
            "bi-file-earmark-image-fill",

        gif:
            "bi-file-earmark-image-fill",

        webp:
            "bi-file-earmark-image-fill",

        svg:
            "bi-file-earmark-image-fill",

        zip:
            "bi-file-earmark-zip-fill",

        rar:
            "bi-file-earmark-zip-fill",

        sql:
            "bi-filetype-sql",

        txt:
            "bi-file-earmark-text-fill"

    };


    return icons[extension] ||
        "bi-file-earmark-fill";

}


/* =========================================================
   CLASE DEL ARCHIVO
   ========================================================= */

function getFileClass(extension) {

    if (
        extension === "pdf"
    ) {

        return "file-pdf";

    }


    if (
        extension === "doc" ||
        extension === "docx"
    ) {

        return "file-word";

    }


    if (
        extension === "xls" ||
        extension === "xlsx"
    ) {

        return "file-excel";

    }


    if (
        [
            "png",
            "jpg",
            "jpeg",
            "gif",
            "webp",
            "svg"
        ].includes(extension)
    ) {

        return "file-image";

    }


    if (
        [
            "zip",
            "rar"
        ].includes(extension)
    ) {

        return "file-zip";

    }


    return "file-text";

}


/* =========================================================
   FORMATEAR BYTES
   ========================================================= */

function formatBytes(bytes) {

    if (
        bytes === 0
    ) {

        return "0 B";

    }


    const units = [

        "B",
        "KB",
        "MB",
        "GB",
        "TB"

    ];


    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );


    return (

        parseFloat(

            (
                bytes /
                Math.pow(
                    1024,
                    index
                )
            ).toFixed(2)

        )

        +

        " "

        +

        units[index]

    );

}


/* =========================================================
   CARPETAS
   ========================================================= */

function renderFolders() {

    if (
        !foldersContainer
    ) {

        return;

    }


    foldersContainer.innerHTML = "";


    carpetas.forEach(
        folder => {

            foldersContainer.innerHTML += `

                <div class="col-6 col-md-4 col-xl-2">

                    <div
                        class="folder-card"
                        data-folder-id="${folder.id}"
                    >

                        <div class="d-flex justify-content-between">

                            <span class="folder-icon">

                                <i class="bi bi-folder-fill"></i>

                            </span>


                            <button
                                class="btn btn-sm p-0 text-muted"
                                type="button"
                            >

                                <i class="bi bi-three-dots"></i>

                            </button>

                        </div>


                        <div class="folder-name">

                            ${folder.nombre}

                        </div>


                        <div class="folder-info">

                            ${folder.archivos}
                            archivos ·
                            ${folder.tamaño}

                        </div>

                    </div>

                </div>

            `;

        }
    );


    if (
        folderCount
    ) {

        folderCount.textContent =
            carpetas.length;

    }

}


/* =========================================================
   RENDERIZAR ARCHIVOS
   ========================================================= */

function renderFiles(lista = archivos) {

    if (
        !filesTableBody ||
        !filesGrid
    ) {

        return;

    }


    filesTableBody.innerHTML = "";

    filesGrid.innerHTML = "";


    lista.forEach(
        file => {

            const icon =
                getFileIcon(
                    file.extension
                );


            const fileClass =
                getFileClass(
                    file.extension
                );


            /* =============================================
               TABLA
            ============================================== */

            filesTableBody.innerHTML += `

                <tr data-file-id="${file.id}">

                    <td class="file-check">

                        <input
                            type="checkbox"
                            class="form-check-input file-checkbox"
                            value="${file.id}"
                        >

                    </td>


                    <td class="file-name-cell">

                        <div class="file-name-wrapper">

                            <span
                                class="file-icon ${fileClass} me-2"
                            >

                                <i class="bi ${icon}"></i>

                            </span>


                            <div class="min-width-0">

                                <div
                                    class="file-name"
                                    title="${file.nombre}"
                                >

                                    ${file.nombre}

                                </div>


                                <div class="file-meta">

                                    ${file.tipo}

                                </div>

                            </div>

                        </div>

                    </td>


                    <td>

                        <div class="file-owner">

                            <span class="owner-avatar">

                                SA

                            </span>

                            <span>

                                ${file.propietario}

                            </span>

                        </div>

                    </td>


                    <td>

                        ${file.fechaTexto}

                    </td>


                    <td>

                        ${file.tamaño}

                    </td>


                    <td>

                        <span class="file-type-badge">

                            ${file.extension.toUpperCase()}

                        </span>

                    </td>


                    <td class="text-end">

                        <div class="file-actions">

                            <button
                                class="btn btn-sm btn-outline-secondary"
                                title="Ver"
                                onclick="openFile(${file.id})"
                            >

                                <i class="bi bi-eye"></i>

                            </button>


                            <button
                                class="btn btn-sm btn-outline-secondary"
                                title="Descargar"
                                onclick="downloadFile(${file.id})"
                            >

                                <i class="bi bi-download"></i>

                            </button>


                            <button
                                class="btn btn-sm btn-outline-secondary"
                                title="Más opciones"
                                data-bs-toggle="dropdown"
                            >

                                <i class="bi bi-three-dots"></i>

                            </button>


                            <ul class="dropdown-menu dropdown-menu-end">

                                <li>

                                    <a
                                        href="#"
                                        class="dropdown-item"
                                        onclick="openFile(${file.id}); return false;"
                                    >

                                        <i class="bi bi-eye me-2"></i>

                                        Ver

                                    </a>

                                </li>


                                <li>

                                    <a
                                        href="#"
                                        class="dropdown-item"
                                        onclick="downloadFile(${file.id}); return false;"
                                    >

                                        <i class="bi bi-download me-2"></i>

                                        Descargar

                                    </a>

                                </li>


                                <li>

                                    <a
                                        href="#"
                                        class="dropdown-item"
                                        href="#"
                                    >

                                        <i class="bi bi-share me-2"></i>

                                        Compartir

                                    </a>

                                </li>


                                <li>

                                    <a
                                        href="#"
                                        class="dropdown-item"
                                    >

                                        <i class="bi bi-pencil me-2"></i>

                                        Renombrar

                                    </a>

                                </li>


                                <li>

                                    <hr class="dropdown-divider">

                                </li>


                                <li>

                                    <a
                                        href="#"
                                        class="dropdown-item text-danger"
                                    >

                                        <i class="bi bi-trash3 me-2"></i>

                                        Eliminar

                                    </a>

                                </li>

                            </ul>

                        </div>

                    </td>

                </tr>

            `;


            /* =============================================
               GRID
            ============================================== */

            filesGrid.innerHTML += `

                <div class="col-6 col-md-4 col-lg-3 col-xl-2">

                    <div
                        class="grid-file"
                        onclick="openFile(${file.id})"
                    >

                        <div class="d-flex justify-content-between">

                            <span
                                class="file-icon ${fileClass}"
                            >

                                <i class="bi ${icon}"></i>

                            </span>


                            <div
                                class="dropdown"
                                onclick="event.stopPropagation()"
                            >

                                <button
                                    class="btn btn-sm p-0 text-muted"
                                    data-bs-toggle="dropdown"
                                >

                                    <i class="bi bi-three-dots"></i>

                                </button>


                                <ul
                                    class="dropdown-menu dropdown-menu-end"
                                >

                                    <li>

                                        <a
                                            class="dropdown-item"
                                            href="#"
                                            onclick="openFile(${file.id}); return false;"
                                        >

                                            <i class="bi bi-eye me-2"></i>

                                            Ver

                                        </a>

                                    </li>


                                    <li>

                                        <a
                                            class="dropdown-item"
                                            href="#"
                                            onclick="downloadFile(${file.id}); return false;"
                                        >

                                            <i class="bi bi-download me-2"></i>

                                            Descargar

                                        </a>

                                    </li>


                                    <li>

                                        <a
                                            class="dropdown-item"
                                            href="#"
                                        >

                                            <i class="bi bi-share me-2"></i>

                                            Compartir

                                        </a>

                                    </li>

                                </ul>

                            </div>

                        </div>


                        <div
                            class="grid-file-name"
                            title="${file.nombre}"
                        >

                            ${file.nombre}

                        </div>


                        <div class="grid-file-info">

                            ${file.tipo}
                            ·
                            ${file.tamaño}

                        </div>

                    </div>

                </div>

            `;

        }
    );


    /* =============================================
       CONTADORES
    ============================================== */

    if (
        itemCount
    ) {

        itemCount.textContent =
            `${lista.length} elementos`;

    }


    if (
        tableCount
    ) {

        tableCount.textContent =
            lista.length;

    }


    /* =============================================
       EMPTY STATE
    ============================================== */

    if (
        emptyState
    ) {

        emptyState.style.display =
            lista.length === 0
                ? "block"
                : "none";

    }


    if (
        lista.length === 0
    ) {

        listView.style.display =
            "none";

        gridView.style.display =
            "none";

    }
    else {

        /*
         * Si estamos en móvil se mantiene
         * la cuadrícula.
         */

        if (
            window.innerWidth <= 767
        ) {

            listView.style.display =
                "none";

            gridView.style.display =
                "block";

        }

    }


    updateSelectedCount();

}


/* =========================================================
   BÚSQUEDA
   ========================================================= */

function searchFiles(value) {

    const text =
        value
            .toLowerCase()
            .trim();


    const resultado =
        archivos.filter(
            file =>

                file.nombre
                    .toLowerCase()
                    .includes(text)

                ||

                file.tipo
                    .toLowerCase()
                    .includes(text)

                ||

                file.extension
                    .toLowerCase()
                    .includes(text)
        );


    renderFiles(
        resultado
    );

}


/* =========================================================
   BUSCADOR DE ARCHIVOS
   ========================================================= */

if (
    fileSearch
) {

    fileSearch.addEventListener(
        "input",
        function() {

            searchFiles(
                this.value
            );

        }
    );

}


/* =========================================================
   BUSCADOR GLOBAL
   ========================================================= */

if (
    globalSearch
) {

    globalSearch.addEventListener(
        "input",
        function() {

            if (
                fileSearch
            ) {

                fileSearch.value =
                    this.value;

            }


            searchFiles(
                this.value
            );

        }
    );

}


/* =========================================================
   ORDENAMIENTO
   ========================================================= */

if (
    sortFiles
) {

    sortFiles.addEventListener(
        "change",
        function() {

            const value =
                this.value;


            const sorted =
                [...archivos];


            if (
                value === "name"
            ) {

                sorted.sort(
                    (a, b) =>

                        a.nombre.localeCompare(
                            b.nombre
                        )
                );

            }


            if (
                value === "date"
            ) {

                sorted.sort(
                    (a, b) =>

                        new Date(
                            b.modificado
                        )

                        -

                        new Date(
                            a.modificado
                        )
                );

            }


            if (
                value === "size"
            ) {

                sorted.sort(
                    (a, b) =>

                        b.tamañoBytes -
                        a.tamañoBytes
                );

            }


            if (
                value === "type"
            ) {

                sorted.sort(
                    (a, b) =>

                        a.tipo.localeCompare(
                            b.tipo
                        )
                );

            }


            renderFiles(
                sorted
            );

        }
    );

}


/* =========================================================
   SELECCIÓN
   ========================================================= */

if (
    selectAllFiles
) {

    selectAllFiles.addEventListener(
        "change",
        function() {

            document
                .querySelectorAll(
                    ".file-checkbox"
                )
                .forEach(
                    checkbox => {

                        checkbox.checked =
                            this.checked;


                        updateRowSelection(
                            checkbox
                        );

                    }
                );


            updateSelectedCount();

        }
    );

}


/* =========================================================
   CHECKBOX INDIVIDUAL
   ========================================================= */

document.addEventListener(
    "change",
    function(event) {

        if (
            event.target.classList.contains(
                "file-checkbox"
            )
        ) {

            updateRowSelection(
                event.target
            );


            updateSelectedCount();

        }

    }
);


/* =========================================================
   ACTUALIZAR FILA
   ========================================================= */

function updateRowSelection(
    checkbox
) {

    const row =
        checkbox.closest("tr");


    if (
        !row
    ) {

        return;

    }


    row.classList.toggle(
        "selected",
        checkbox.checked
    );

}


/* =========================================================
   CONTADOR SELECCIONADOS
   ========================================================= */

function updateSelectedCount() {

    if (
        !selectedCount ||
        !selectAllFiles
    ) {

        return;

    }


    const selected =
        document.querySelectorAll(
            ".file-checkbox:checked"
        );


    selectedCount.textContent =
        selected.length;


    const all =
        document.querySelectorAll(
            ".file-checkbox"
        );


    selectAllFiles.checked =
        all.length > 0 &&
        selected.length === all.length;

}


/* =========================================================
   CAMBIO DE VISTA
   ========================================================= */

function setListView() {

    if (
        window.innerWidth <= 767
    ) {

        return;

    }


    listView.style.display =
        "block";


    gridView.style.display =
        "none";


    listViewButton.classList.remove(
        "btn-outline-secondary"
    );


    listViewButton.classList.add(
        "btn-primary"
    );


    gridViewButton.classList.remove(
        "btn-primary"
    );


    gridViewButton.classList.add(
        "btn-outline-secondary"
    );

}


function setGridView() {

    listView.style.display =
        "none";


    gridView.style.display =
        "block";


    gridViewButton.classList.remove(
        "btn-outline-secondary"
    );


    gridViewButton.classList.add(
        "btn-primary"
    );


    listViewButton.classList.remove(
        "btn-primary"
    );


    listViewButton.classList.add(
        "btn-outline-secondary"
    );

}


if (
    listViewButton
) {

    listViewButton.addEventListener(
        "click",
        setListView
    );

}


if (
    gridViewButton
) {

    gridViewButton.addEventListener(
        "click",
        setGridView
    );

}


/* =========================================================
   TEMA
   ========================================================= */

function updateThemeIcon(theme) {

    if (
        !themeIcon ||
        !themeToggle
    ) {

        return;

    }


    if (
        theme === "dark"
    ) {

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


updateThemeIcon(
    savedTheme
);


if (
    themeToggle
) {

    themeToggle.addEventListener(
        "click",
        function() {

            const currentTheme =
                document.documentElement
                    .getAttribute(
                        "data-bs-theme"
                    );


            const newTheme =
                currentTheme === "dark"
                    ? "light"
                    : "dark";


            document.documentElement
                .setAttribute(
                    "data-bs-theme",
                    newTheme
                );


            localStorage.setItem(
                "cloudbox-theme",
                newTheme
            );


            updateThemeIcon(
                newTheme
            );

        }
    );

}


/* =========================================================
   FILE VIEWER
   ========================================================= */

const fileViewerModalElement =
    document.getElementById(
        "fileViewerModal"
    );


let fileViewerModal = null;


if (
    fileViewerModalElement
) {

    fileViewerModal =
        new bootstrap.Modal(
            fileViewerModalElement
        );

}


const fileViewerBody =
    document.getElementById(
        "fileViewerBody"
    );

const viewerFileName =
    document.getElementById(
        "viewerFileName"
    );

const viewerFileType =
    document.getElementById(
        "viewerFileType"
    );

const viewerFileSize =
    document.getElementById(
        "viewerFileSize"
    );

const viewerFileIcon =
    document.getElementById(
        "viewerFileIcon"
    );

const viewerIcon =
    document.getElementById(
        "viewerIcon"
    );

const viewerOpenButton =
    document.getElementById(
        "viewerOpenButton"
    );

const viewerDownloadButton =
    document.getElementById(
        "viewerDownloadButton"
    );


let currentViewerFile =
    null;


/* =========================================================
   ABRIR ARCHIVO
   ========================================================= */

function openFile(id) {

    const file =
        archivos.find(
            item =>
                item.id === id
        );


    if (
        !file
    ) {

        return;

    }


    currentViewerFile =
        file;


    const extension =
        file.extension
            .toLowerCase();


    /* HEADER */

    viewerFileName.textContent =
        file.nombre;


    viewerFileType.textContent =
        file.tipo;


    viewerFileSize.textContent =
        file.tamaño;


    const icon =
        getFileIcon(
            extension
        );


    const fileClass =
        getFileClass(
            extension
        );


    viewerIcon.className =
        `bi ${icon}`;


    viewerFileIcon.className =
        `file-icon ${fileClass}`;


    /* LIMPIAR */

    fileViewerBody.innerHTML =
        "";


    /* =====================================================
       PDF
    ====================================================== */

    if (
        extension === "pdf"
    ) {

        if (
            !file.url
        ) {

            showUnsupportedViewer(
                file
            );


            viewerOpenButton.style.display =
                "none";


            fileViewerModal.show();

            return;

        }


        const iframe =
            document.createElement(
                "iframe"
            );


        iframe.className =
            "pdf-viewer";


        iframe.src =
            file.url;


        iframe.title =
            file.nombre;


        iframe.setAttribute(
            "allow",
            "fullscreen"
        );


        fileViewerBody.appendChild(
            iframe
        );


        viewerOpenButton.style.display =
            "inline-flex";


        fileViewerModal.show();

        return;

    }


    /* =====================================================
       IMÁGENES
    ====================================================== */

    const imageExtensions = [

        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
        "svg"

    ];


    if (
        imageExtensions.includes(
            extension
        )
    ) {

        if (
            !file.url
        ) {

            showUnsupportedViewer(
                file
            );


            viewerOpenButton.style.display =
                "none";


            fileViewerModal.show();

            return;

        }


        const container =
            document.createElement(
                "div"
            );


        container.className =
            "image-viewer-container";


        const image =
            document.createElement(
                "img"
            );


        image.className =
            "image-viewer";


        image.src =
            file.url;


        image.alt =
            file.nombre;


        image.loading =
            "eager";


        image.onerror =
            function() {

                container.innerHTML = `

                    <div class="viewer-unsupported">

                        <div class="viewer-unsupported-icon">

                            <i class="bi bi-image"></i>

                        </div>


                        <h5>

                            No se pudo cargar la imagen

                        </h5>


                        <p>

                            Verifica que la URL del archivo
                            sea válida.

                        </p>

                    </div>

                `;

            };


        container.appendChild(
            image
        );


        fileViewerBody.appendChild(
            container
        );


        viewerOpenButton.style.display =
            "inline-flex";


        fileViewerModal.show();

        return;

    }


    /* =====================================================
       OTROS ARCHIVOS
    ====================================================== */

    showUnsupportedViewer(
        file
    );


    viewerOpenButton.style.display =
        "none";


    fileViewerModal.show();

}


/* =========================================================
   ARCHIVO NO COMPATIBLE
   ========================================================= */

function showUnsupportedViewer(
    file
) {

    const extension =
        file.extension
            .toLowerCase();


    const icon =
        getFileIcon(
            extension
        );


    fileViewerBody.innerHTML = `

        <div class="viewer-unsupported">

            <div class="viewer-unsupported-icon">

                <i class="bi ${icon}"></i>

            </div>


            <h5>

                Vista previa no disponible

            </h5>


            <p>

                CloudBox permite visualizar
                directamente archivos PDF e imágenes.
                Este archivo debe descargarse para
                poder abrirlo.

            </p>


            <button
                type="button"
                class="btn btn-sm btn-cloud"
                onclick="downloadFile(${file.id})"
            >

                <i class="bi bi-download me-1"></i>

                Descargar archivo

            </button>

        </div>

    `;

}


/* =========================================================
   ABRIR EN NUEVA PESTAÑA
   ========================================================= */

if (
    viewerOpenButton
) {

    viewerOpenButton.addEventListener(
        "click",
        function() {

            if (
                !currentViewerFile
            ) {

                return;

            }


            if (
                !currentViewerFile.url
            ) {

                return;

            }


            window.open(
                currentViewerFile.url,
                "_blank"
            );

        }
    );

}


/* =========================================================
   DESCARGAR DESDE VISOR
   ========================================================= */

if (
    viewerDownloadButton
) {

    viewerDownloadButton.addEventListener(
        "click",
        function() {

            if (
                !currentViewerFile
            ) {

                return;

            }


            downloadFile(
                currentViewerFile.id
            );

        }
    );

}


/* =========================================================
   CERRAR VISOR
   ========================================================= */

if (
    fileViewerModalElement
) {

    fileViewerModalElement.addEventListener(
        "hidden.bs.modal",
        function() {

            fileViewerBody.innerHTML =
                "";


            currentViewerFile =
                null;

        }
    );

}


/* =========================================================
   UPLOAD
   ========================================================= */

const uploadModalElement =
    document.getElementById(
        "uploadModal"
    );


let uploadModal = null;


if (
    uploadModalElement
) {

    uploadModal =
        new bootstrap.Modal(
            uploadModalElement
        );

}


const uploadDropZone =
    document.getElementById(
        "uploadDropZone"
    );

const fileInput =
    document.getElementById(
        "fileInput"
    );

const uploadFileList =
    document.getElementById(
        "uploadFileList"
    );

const uploadFilesSection =
    document.getElementById(
        "uploadFilesSection"
    );

const startUploadButton =
    document.getElementById(
        "startUploadButton"
    );

const clearFilesButton =
    document.getElementById(
        "clearFilesButton"
    );


let selectedUploadFiles =
    [];

const API_URL =
    "http://54.172.230.194:3000/api/files";

const MAX_FILE_SIZE =
    100 * 1024 * 1024;


/* =========================================================
   ABRIR MODAL
   ========================================================= */

if (
    uploadButton
) {

    uploadButton.addEventListener(
        "click",
        function() {

            uploadModal.show();

        }
    );

}


/* =========================================================
   DROP ZONE CLICK
   ========================================================= */

if (
    uploadDropZone
) {

    uploadDropZone.addEventListener(
        "click",
        function() {

            fileInput.click();

        }
    );

}


/* =========================================================
   INPUT FILE
   ========================================================= */

if (
    fileInput
) {

    fileInput.addEventListener(
        "change",
        function() {

            addFiles(
                [...this.files]
            );


            this.value =
                "";

        }
    );

}


/* =========================================================
   AGREGAR ARCHIVOS
   ========================================================= */

function addFiles(files) {

    files.forEach(
        file => {

            const alreadyExists =
                selectedUploadFiles.some(
                    item =>

                        item.file.name ===
                        file.name

                        &&

                        item.file.size ===
                        file.size
                );


            if (
                alreadyExists
            ) {

                return;

            }


            selectedUploadFiles.push({

                file:
                    file,

                id:
                    Date.now() +
                    Math.random(),

                status:
                    file.size >
                    MAX_FILE_SIZE

                        ? "error"

                        : "pending",

                progress:
                    0

            });

        }
    );


    renderUploadFiles();

}


/* =========================================================
   RENDER UPLOAD FILES
   ========================================================= */

function renderUploadFiles() {

    if (
        !uploadFileList
    ) {

        return;

    }


    uploadFileList.innerHTML =
        "";


    if (
        selectedUploadFiles.length === 0
    ) {

        uploadFilesSection.style.display =
            "none";


        startUploadButton.disabled =
            true;


        return;

    }


    uploadFilesSection.style.display =
        "block";


    selectedUploadFiles.forEach(
        item => {

            const file =
                item.file;


            const extension =
                file.name
                    .split(".")
                    .pop()
                    .toLowerCase();


            const icon =
                getFileIcon(
                    extension
                );


            const fileClass =
                getFileClass(
                    extension
                );


            let statusText =
                "Pendiente";


            if (
                item.status ===
                "uploading"
            ) {

                statusText =
                    `${item.progress}%`;

            }


            if (
                item.status ===
                "success"
            ) {

                statusText =
                    "Completado";

            }


            if (
                item.status ===
                "error"
            ) {

                statusText =
                    "Archivo demasiado grande";

            }


            uploadFileList.innerHTML += `

                <div
                    class="upload-file-item"
                    data-upload-id="${item.id}"
                >

                    <span
                        class="upload-file-icon ${fileClass}"
                    >

                        <i class="bi ${icon}"></i>

                    </span>


                    <div class="upload-file-info">

                        <div
                            class="upload-file-name"
                            title="${file.name}"
                        >

                            ${file.name}

                        </div>


                        <div class="upload-file-size">

                            ${formatBytes(file.size)}

                        </div>


                        ${
                            item.status === "uploading" ||
                            item.status === "success"

                            ?

                            `

                                <div
                                    class="progress upload-progress"
                                >

                                    <div
                                        class="progress-bar"
                                        style="width:${item.progress}%"
                                    ></div>

                                </div>

                            `

                            :

                            ""

                        }

                    </div>


                    <span
                        class="upload-status ${item.status}"
                    >

                        ${statusText}

                    </span>


                    ${
                        item.status !== "uploading"

                        ?

                        `

                            <button
                                type="button"
                                class="upload-remove"
                                onclick="removeUploadFile('${item.id}')"
                            >

                                <i class="bi bi-x-lg"></i>

                            </button>

                        `

                        :

                        ""

                    }

                </div>

            `;

        }
    );


    const validFiles =
        selectedUploadFiles.filter(
            item =>
                item.status === "pending"
        );


    const totalSize =
        selectedUploadFiles.reduce(
            (total, item) =>

                total +
                item.file.size,

            0
        );


    const uploadCount =
        document.getElementById(
            "uploadCount"
        );


    const uploadSize =
        document.getElementById(
            "uploadSize"
        );


    if (
        uploadCount
    ) {

        uploadCount.textContent =
            selectedUploadFiles.length;

    }


    if (
        uploadSize
    ) {

        uploadSize.textContent =
            formatBytes(
                totalSize
            );

    }


    startUploadButton.disabled =
        validFiles.length === 0;

}


/* =========================================================
   ELIMINAR ARCHIVO DE UPLOAD
   ========================================================= */

function removeUploadFile(id) {

    selectedUploadFiles =
        selectedUploadFiles.filter(
            item =>
                String(item.id) !==
                String(id)
        );


    renderUploadFiles();

}


/* =========================================================
   LIMPIAR UPLOAD
   ========================================================= */

if (
    clearFilesButton
) {

    clearFilesButton.addEventListener(
        "click",
        function() {

            selectedUploadFiles =
                [];


            renderUploadFiles();

        }
    );

}


/* =========================================================
   DRAG OVER
   ========================================================= */

if (
    uploadDropZone
) {

    uploadDropZone.addEventListener(
        "dragover",
        function(event) {

            event.preventDefault();


            this.classList.add(
                "dragging"
            );

        }
    );


    /* =====================================================
       DRAG LEAVE
    ====================================================== */

    uploadDropZone.addEventListener(
        "dragleave",
        function() {

            this.classList.remove(
                "dragging"
            );

        }
    );


    /* =====================================================
       DROP
    ====================================================== */

    uploadDropZone.addEventListener(
        "drop",
        function(event) {

            event.preventDefault();


            this.classList.remove(
                "dragging"
            );


            addFiles(
                [...event.dataTransfer.files]
            );

        }
    );

}


/* =========================================================
   INICIAR SUBIDA
   ========================================================= */

if (
    startUploadButton
) {

    startUploadButton.addEventListener(
        "click",
        async function() {

            const filesToUpload =
                selectedUploadFiles.filter(
                    item =>
                        item.status ===
                        "pending"
                );


            if (
                filesToUpload.length === 0
            ) {

                return;

            }


            startUploadButton.disabled =
                true;


            for (
                const item of
                filesToUpload
            ) {

                await simulateUpload(
                    item
                );

            }


            renderUploadFiles();


            renderFiles(
                archivos
            );

        }
    );

}


/* =========================================================
   SIMULAR SUBIDA
   ========================================================= */

async function simulateUpload(item) {

    item.status   = "uploading";
    item.progress = 0;
    renderUploadFiles();

    try {

        // 1. Pedir presigned URL a tu Express en EC2
        const token =
            localStorage.getItem("cb_access") ||
            sessionStorage.getItem("cb_access");

        const res = await fetch(`${API_URL}/upload`, {
            method:  "POST",
            headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                fileName:    item.file.name,
                contentType: item.file.type || "application/octet-stream",
                size:        item.file.size
            })
        });

        if (!res.ok) {
            throw new Error("Error obteniendo URL de subida.");
        }

        const { uploadUrl, fileUrl, key } = await res.json();

        // 2. Subir directo a S3 con la presigned URL
        await new Promise((resolve, reject) => {

            const xhr = new XMLHttpRequest();
            xhr.open("PUT", uploadUrl, true);
            xhr.setRequestHeader(
                "Content-Type",
                item.file.type || "application/octet-stream"
            );

            xhr.upload.addEventListener("progress", e => {
                if (e.lengthComputable) {
                    item.progress = Math.round((e.loaded / e.total) * 100);
                    renderUploadFiles();
                }
            });

            xhr.addEventListener("load", () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve();
                } else {
                    reject(new Error(`S3 respondió HTTP ${xhr.status}`));
                }
            });

            xhr.addEventListener("error", () =>
                reject(new Error("Error de red al subir a S3."))
            );

            xhr.send(item.file);
        });

        // 3. Agregar archivo a la lista del dashboard
        item.status   = "success";
        item.progress = 100;
        renderUploadFiles();

        const extension = item.file.name.split(".").pop().toLowerCase();

        archivos.unshift({
            id:          Date.now() + Math.random(),
            nombre:      item.file.name,
            tipo:        item.file.type || "Archivo",
            extension,
            propietario: currentUser.name || "Usuario",
            modificado:  new Date().toISOString(),
            fechaTexto:  "Ahora",
            tamaño:      formatBytes(item.file.size),
            tamañoBytes: item.file.size,
            url:         fileUrl || null,
            s3Key:       key || null
        });

        renderFiles(archivos);

    } catch (error) {

        console.error("Error subiendo archivo:", error);
        item.status   = "failed";
        item.progress = 0;
        renderUploadFiles();
        alert(error.message || "No se pudo subir el archivo.");

    }
}


/* =========================================================
   DESCARGAR ARCHIVO
   ========================================================= */

function downloadFile(id) {

    const file =
        archivos.find(
            item =>
                item.id === id
        );


    if (
        !file
    ) {

        return;

    }


    if (
        file.url
    ) {

        const link =
            document.createElement(
                "a"
            );


        link.href =
            file.url;


        link.target =
            "_blank";


        link.download =
            file.nombre;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        return;

    }


    alert(
        `Descargar archivo:\n\n${file.nombre}`
    );

}


/* =========================================================
   NUEVA CARPETA
   ========================================================= */

if (
    newFolderButton
) {

    newFolderButton.addEventListener(
        "click",
        function() {

            const nombre =
                prompt(
                    "Nombre de la nueva carpeta:"
                );


            if (
                nombre &&
                nombre.trim() !== ""
            ) {

                alert(
                    `Carpeta "${nombre.trim()}" creada correctamente.`
                );

            }

        }
    );

}


/* =========================================================
   CERRAR SESIÓN
   ========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


            localStorage.removeItem(
                "cb_access"
            );

            localStorage.removeItem(
                "cb_id"
            );

            localStorage.removeItem(
                "cb_refresh"
            );

            localStorage.removeItem(
                "cb_exp"
            );

            localStorage.removeItem(
                "cb_user"
            );


            sessionStorage.removeItem(
                "cb_access"
            );

            sessionStorage.removeItem(
                "cb_id"
            );

            sessionStorage.removeItem(
                "cb_refresh"
            );

            sessionStorage.removeItem(
                "cb_exp"
            );

            sessionStorage.removeItem(
                "cb_user"
            );


            window.location.replace(
                "login.html"
            );

        }
    );

}

/* =========================================================
   RESPONSIVE
   ========================================================= */

function updateResponsiveView() {

    if (
        window.innerWidth <= 767
    ) {

        listView.style.display =
            "none";


        gridView.style.display =
            "block";


        gridViewButton.classList.remove(
            "btn-outline-secondary"
        );


        gridViewButton.classList.add(
            "btn-primary"
        );


        listViewButton.classList.remove(
            "btn-primary"
        );


        listViewButton.classList.add(
            "btn-outline-secondary"
        );

    }

}

if (!requireSession()) {

    throw new Error(
        "Acceso al dashboard bloqueado."
    );

}
console.log(
    "Sesión válida. Dashboard autorizado."
);

/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        loadCurrentUser();
        renderFolders();
        updateResponsiveView();

        // Cargar archivos reales desde S3 via API Express
        try {
            const token =
                localStorage.getItem("cb_access") ||
                sessionStorage.getItem("cb_access");

            const res = await fetch(`${API_URL}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                // Reemplazar datos demo con archivos reales
                archivos.length = 0;
                data.files.forEach(f => archivos.push(f));
            }

        } catch (e) {
            console.warn("No se pudo conectar a la API. Mostrando datos demo.");
        }

        renderFiles();
    }
);

/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    updateResponsiveView
);