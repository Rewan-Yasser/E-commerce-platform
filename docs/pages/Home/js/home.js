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

// Home page logic
window.onload = async function () {
    const user = JSON.parse(localStorage.getItem("user"));
    const isLogged = localStorage.getItem("isLogged") === "true";
    if (isLogged && user && user.username) {
        document.getElementById("usernameDisplay").textContent = user.username;
        document.getElementById("welcomeMessage").style.display = "block";
    } else {
        window.location.href = "../../index.html";
        return;
    }
    // Wait for products to load before rendering
    await initProducts();
    renderCategoryFilter();
    filterAndSearchProducts();
    document.getElementById("searchInput").oninput = filterAndSearchProducts;
    document.getElementById("categoryFilter").onchange = filterAndSearchProducts;
    // --- FAV NAVBAR FILTER ---
    // Wait a bit to ensure navbar is loaded
    setTimeout(() => {
        const favNavBtn = document.getElementById("showFavourites");
        if (favNavBtn) {
            favNavBtn.addEventListener("click", function (e) {
                e.preventDefault();
                const allProducts = getProducts();
                const favs = JSON.parse(localStorage.getItem('favourites') || '[]');
                // If your favs are numbers, use Number(product.id)
                const favProducts = allProducts.filter(p => favs.includes(p.id));
                renderProducts(favProducts);
            });
        }
    }, 300); //time out
};

// --- Product Data Helpers ---
function getProducts() {
    return JSON.parse(localStorage.getItem("products") || "[]");
}
function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

function getProductById(id) {
    return getProducts().find(p => p.id == id);
}


//products
async function initProducts() {
    if (!localStorage.getItem("products")) {
        let data = await fetch('https://fakestoreapi.com/products');
        let products = await data.json();
        saveProducts(products);
    }
}
function renderProducts(products) {
    const productsDiv = document.getElementById("products");
    let favs = JSON.parse(localStorage.getItem('favourites') || '[]'); // <-- Add this line
    if (!products.length) {
        productsDiv.innerHTML = "<p class='text-center'>No products found.</p>";
        return;
    }
    productsDiv.innerHTML = products.map(product => `
        <div class="col-md-4 mb-4">
            <div class="card h-100 product-card" style="cursor:pointer;">
                <img src="${product.image}" class="card-img-top" alt="${product.title}" style="height:200px;object-fit:contain;">
                <div class="card-body" onclick="getDetails(${product.id})">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text"><strong>Price:</strong> $${product.price}</p>
                    <p class="card-text"><strong>Category:</strong> ${product.category}</p>
                </div>
                <div class="card-buttons">
                  <button class="btn add-to-cart-btn" data-id="${product.id}"> <i class="fa-solid fa-cart-shopping"></i> </button>
                  <button class="btn add-to-fav-btn" data-id="${product.id}"> <i class="fa-regular fa-heart${favs.includes(product.id) ? ' faved' : ''}"></i> </button>
                </div>
            </div>
        </div>
    `).join('');

    // Add to cart button
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const productId = this.getAttribute('data-id');
            addToCart(productId);
        });
    });

    // Add to favourite button
        document.querySelectorAll('.add-to-fav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = Number(this.getAttribute('data-id'));
            let favs = JSON.parse(localStorage.getItem('favourites') || '[]');
            const icon = this.querySelector('i');
            icon.classList.toggle('faved');
            if (icon.classList.contains('faved')) {
                // Add to favourites
                if (!favs.includes(productId)) {
                    favs.push(productId);
                    localStorage.setItem('favourites', JSON.stringify(favs));
                    Toastify({
                        text: "Product added to favourites!",
                        duration: 2000,
                        gravity: "top",
                        position: "center",
                        style: { background: "#e67e22" },
                    }).showToast();
                }
            } else {
                // Remove from favourites
                favs = favs.filter(id => id !== productId);
                localStorage.setItem('favourites', JSON.stringify(favs));
                Toastify({
                    text: "Product removed from favourites!",
                    duration: 2000,
                    gravity: "top",
                    position: "center",
                    style: { background: "#b2bec3", color: "#222" },
                }).showToast();
            }
        });
    });
}

//Category
function renderCategoryFilter() {
    const products = getProducts();
    const categories = [...new Set(products.map(p => p.category))];
    const filter = document.getElementById("categoryFilter");
    filter.innerHTML = `<option value="">All Categories</option>` +
        categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

// --- Search & Filter ---
function filterAndSearchProducts() {
    const search = document.getElementById("searchInput").value.trim().toLowerCase();
    const category = document.getElementById("categoryFilter").value;
    let products = getProducts();
    if (category) products = products.filter(p => p.category === category);
    if (search) products = products.filter(p =>
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
    );
    renderProducts(products);
}

// --- Navigation ---
function getDetails(id) {
    localStorage.setItem("productId", id);
    window.location.href = "product.html";
}

// add to cart
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id == productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id: productId, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    // Show Toastify notification instead of alert
    Toastify({
        text: "Product added to cart!",
        duration: 2000,
        gravity: "top",
        position: "center",
        style: { background: "#27ae60" },
    }).showToast();
}

// Add to favourite function
function addToFavourite(productId) {
    let favs = JSON.parse(localStorage.getItem('favourites') || '[]');
    productId = Number(productId); // Ensure it's a number
    if (!favs.includes(productId)) {
        favs.push(productId);
        localStorage.setItem('favourites', JSON.stringify(favs));
        Toastify({
            text: "Product added to favourites!",
            duration: 2000,
            gravity: "top",
            position: "center",
            style: { background: "#e67e22" },
        }).showToast();
    } else {
        Toastify({
            text: "Already in favourites!",
            duration: 2000,
            gravity: "top",
            position: "center",
            style: { background: "#b2bec3", color: "#222" },
        }).showToast();
    }
}
// --- Expose functions for HTML buttons ---
window.getDetails = getDetails;
window.addToFavourite = addToFavourite;