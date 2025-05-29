// Wait for the DOM to be fully loaded
window.addEventListener("DOMContentLoaded", function() {
  // --- Typewriter effect for the header text ---
  const text = "Your one-stop shop for all your needs!";
  const headerText = document.getElementById("headerText");
  let i = 0;

  function typeWriter() {
    if (i < text.length) {
      headerText.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 50); // Typing speed in ms
    } else {
      setTimeout(() => {
        headerText.textContent = "";
        i = 0;
        typeWriter(); // Repeat after 2 seconds
      }, 2000);
    }
  }

  headerText.textContent = "";
  typeWriter();

  // --- Theme toggle (dark/light mode) ---
  const themeToggle = document.getElementById("themeToggle");
  const navbarBrand = document.getElementById("navbarBrand"); // Make sure your logo img has id="navbarBrand"

  themeToggle.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");

    // Change the icon (moon/sun)
    const icon = themeToggle.querySelector("i");
    if(document.body.classList.contains("dark-mode")) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
      // Change logo for dark mode
      if(navbarBrand) navbarBrand.src = "images/noBgColor.png";
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
      // Change logo for light mode
      if(navbarBrand) navbarBrand.src = "images/noBgBlack.png";
    }
  });
});