// Load shared navbar, dark mode and logout button
fetch('../Home/navbar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('navbar-placeholder').innerHTML = html;
  })
  .then(() => {
    const script = document.createElement('script');
    script.src = '../Home/js/navbar.js';
    script.onload = function () {
      // Call setupNavbar after script loads and HTML is present
      if (window.setupNavbar) window.setupNavbar();
    };
    document.body.appendChild(script);
  });

async function getDetails() {
  const productId = localStorage.getItem("productId");
  const detailsDiv = document.getElementById("productDetails");
  if (!productId) {
    detailsDiv.innerHTML = "<p>No product selected.</p>";
    return;
  }
  detailsDiv.innerHTML = "<p>Loading...</p>"; // Show loading state
  const data = await fetch(`https://fakestoreapi.com/products/${productId}`);
  const product = await data.json();

  // Check if product is in favourites
  let favs = JSON.parse(localStorage.getItem('favourites') || '[]');
  const isFaved = favs.includes(Number(productId));

  // Replace loading message with product details
  detailsDiv.innerHTML = `
         <h2 id="productTitle">${product.title}</h2>
        <img id="productImage" src="${product.image}" alt="${product.title}" style="max-width:200px;">
        <p id="productDescription">${product.description}</p>
        <p id="productPrice">Price: $${product.price}</p>
        <div class="d-flex justify-content-center gap-3 mt-3">
            <button id="addToCartBtn" class="btn" title="Add to Cart">
                <i class="fa-solid fa-cart-shopping"></i>
            </button>
            <button id="addToFavBtn" class="btn" title="Add to Favourites">
                <i class="fa-regular fa-heart${isFaved ? ' faved' : ''}" id="favIcon"></i>
            </button>
        </div>
    `;
  // Add to cart handler
  document.getElementById('addToCartBtn').onclick = function () {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id == product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id: product.id, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    Toastify({
      text: "Product added to cart!",
      duration: 2000,
      gravity: "top",
      position: "center",
      style: { background: "#27ae60" },
    }).showToast();
  };

  // Add/remove from favourites handler
  document.getElementById('addToFavBtn').onclick = function () {
    const favIcon = document.getElementById('favIcon');
    let favs = JSON.parse(localStorage.getItem('favourites') || '[]');
    const prodId = Number(product.id);
    if (favs.includes(prodId)) {
      favs = favs.filter(id => id !== prodId);
      favIcon.classList.remove('faved');
      Toastify({
        text: "Product removed from favourites!",
        duration: 2000,
        gravity: "top",
        position: "center",
        style: { background: "#b2bec3", color: "#222" },
      }).showToast();
    } else {
      favs.push(prodId);
      favIcon.classList.add('faved');
      Toastify({
        text: "Product added to favourites!",
        duration: 2000,
        gravity: "top",
        position: "center",
        style: { background: "#e67e22" },
      }).showToast();
    }
    localStorage.setItem('favourites', JSON.stringify(favs));
  };
}
getDetails();