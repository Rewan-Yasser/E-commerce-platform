function setupNavbar() {
    const toggleBtn = document.getElementById("toggleMode");
    if (!toggleBtn) return;
    const icon = toggleBtn.querySelector("i");
    const logo = document.getElementById("navbarBrand");
    const lightLogo = "images/noBgBlack.png";
    const darkLogo = "images/noBgColor.png";

    // Set initial mode
    if (localStorage.getItem("homeMode") === "dark") {
        document.body.classList.add("dark-mode");
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
        if (logo) logo.src = darkLogo;
    } else {
        document.body.classList.remove("dark-mode");
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
        if (logo) logo.src = lightLogo;
        localStorage.setItem("homeMode", "light");
    }

    toggleBtn.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
            if (logo) logo.src = darkLogo;
            localStorage.setItem("homeMode", "dark");
        } else {
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
            if (logo) logo.src = lightLogo;
            localStorage.setItem("homeMode", "light");
        }
    });

    // Logout button logic
    const logoutBtn = document.getElementById("logoutButton");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("isLogged");
            localStorage.removeItem("user");
            window.location.href = "../../index.html";
        });
    }
}

// Expose for dynamic call
window.setupNavbar = setupNavbar;