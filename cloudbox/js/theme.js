/* =========================================================
   CLOUDBOX
   THEME MANAGER
========================================================= */

(function () {

    const STORAGE_KEY = "cloudbox-theme";

    const savedTheme =
        localStorage.getItem(STORAGE_KEY) || "light";

    document.documentElement.setAttribute(
        "data-bs-theme",
        savedTheme
    );


    function updateThemeIcon() {

        const themeBtn =
            document.getElementById("themeBtn");

        const themeIcon =
            document.getElementById("themeIcon");

        if (!themeBtn || !themeIcon) {
            return;
        }


        const currentTheme =
            document.documentElement.getAttribute(
                "data-bs-theme"
            );


        if (currentTheme === "dark") {

            themeIcon.className = "bi bi-sun";

            themeBtn.title = "Modo claro";

        } else {

            themeIcon.className = "bi bi-moon";

            themeBtn.title = "Modo oscuro";
        }
    }


    function toggleTheme() {

        const currentTheme =
            document.documentElement.getAttribute(
                "data-bs-theme"
            );


        const nextTheme =
            currentTheme === "dark"
                ? "light"
                : "dark";


        document.documentElement.setAttribute(
            "data-bs-theme",
            nextTheme
        );


        localStorage.setItem(
            STORAGE_KEY,
            nextTheme
        );


        updateThemeIcon();
    }


    document.addEventListener(
        "DOMContentLoaded",
        function () {

            const themeBtn =
                document.getElementById("themeBtn");


            if (themeBtn) {

                themeBtn.addEventListener(
                    "click",
                    toggleTheme
                );

            }


            updateThemeIcon();

        }
    );

})();