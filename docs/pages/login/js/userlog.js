// Login Form
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the values from the form fields
    const email = document.getElementById("logEmail").value;
    const password = document.getElementById("logPassword").value;
    // Perform validation
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email === email && user.password === password) {
      Toastify({
        text: "Welcome back, " + user.username + "!",
        duration: 3000,
        gravity: "top",
        position: "center",
        style: { background: "#27ae60" },
      }).showToast();
      localStorage.setItem("isLogged", "true"); // Set login flag

      //Go to home page after a short delay
      setTimeout(() => {
        window.location.href = "../Home/home.html"; 
      }, 1200);
    } else {
      Toastify({
        text: "Invalid username or password.",
        duration: 5000,
        gravity: "top",
        position: "center",
        style: { background: "#e74c3c" },
      }).showToast();
    }
  });