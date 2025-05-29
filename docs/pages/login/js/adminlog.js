// Login Form
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the values from the form fields
    const email = document.getElementById("logEmail").value;
    const password = document.getElementById("logPassword").value;

    // Custom admin credentials
    const adminEmail = "admin@example.com";
    const adminPassword = "Admin@123";

    // Perform validation
    if (email === adminEmail && password === adminPassword) {
      Toastify({
        text: "Welcome, Admin!",
        duration: 3000,
        gravity: "top",
        position: "center",
        style: { background: "#27ae60" },
      }).showToast();
      localStorage.setItem("isLogged", "true");
      localStorage.setItem("user", JSON.stringify({ username: "Admin", email: "admin@example.com" }));
      // Go to admin page after a short delay
      setTimeout(() => {
        window.location.href = "../admin/admin.html";
      }, 1200);
    } else {
      Toastify({
        text: "Invalid admin credentials.",
        duration: 5000,
        gravity: "top",
        position: "center",
        style: { background: "#e74c3c" },
      }).showToast();
    }
  });