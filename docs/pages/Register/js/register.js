// Listen for form submission
document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get values from input fields
    const username = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    // Username validation: must start with a capital letter and contain only letters
    function validationUsername(name) {
      return /^[A-Z][a-zA-Z]*$/.test(name);
    }
    if (!username) {
      // Show error if username is empty
      Toastify({
        text: "Please enter a valid name.",
        duration: 5000, //ms
        gravity: "top",
        position: "center",
        style: { background: "#e74c3c" },
      }).showToast();
      return;
    } 
    else if (!validationUsername(username)) {
      // Show error if username does not match regex
      Toastify({
        text: "Name must start with a capital letter and contain only letters.",
        duration: 5000, //ms
        gravity: "top",
        position: "center",
        style: { background: "#e74c3c" },
      }).showToast();
      return;
    }

    // Email validation using regex
    function validationEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    }
    if (!email) {
      // Show error if email is empty
      Toastify({
        text: "Email field cannot be empty.",
        duration: 5000, //ms
        gravity: "top",
        position: "center",
        style: { background: "#e74c3c" },
      }).showToast();
      return;
    }
    if (!validationEmail(email)) {
      // Show error if email is not valid
      Toastify({
        text: "Please enter a valid email address.",
        duration: 5000, //ms
        gravity: "top",
        position: "center",
        style: { background: "#e74c3c" },
      }).showToast();
      return;
    }

    // Password validation: at least 8 chars, 1 uppercase, 1 lowercase, 1 number
    function validationPassword(password) {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    }
    if (!password) {
      // Show error if password is empty
      Toastify({
        text: "Please enter a valid password.",
        duration: 5000, //ms
        gravity: "top",
        position: "center",
        style: { background: "#e74c3c" },
      }).showToast();
      return;
    } 
    else if (!validationPassword(password)) {
      // Show error if password does not meet requirements
      Toastify({
        text: "Password must be at least 8 characters, include uppercase, lowercase, and a number.",
        duration: 5000, //ms
        gravity: "top",
        position: "center",
        style: { background: "#e74c3c" },
      }).showToast();
      return;
    }

    // If all validations pass, save user data and show success message
    localStorage.setItem("user", JSON.stringify({ username, email, password }));
    this.reset();
    Toastify({
      text: "Registration successful! Redirecting to login...",
      duration: 2000,
      gravity: "top",
      position: "center",
      style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
    }).showToast();
    setTimeout(() => {
      window.location.href = "../login/login.html";
    }, 1200);
  });
