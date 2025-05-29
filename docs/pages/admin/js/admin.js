// --- Admin Dashboard Initialization ---
window.onload = async function () {
    const user = JSON.parse(localStorage.getItem("user"));
    const isLogged = localStorage.getItem("isLogged") === "true";
    if (isLogged && user && user.username === "Admin") {
        document.getElementById("usernameDisplay").textContent = "Admin";
        document.getElementById("welcomeMessage").style.display = "block";
    } else {
        window.location.href = "../../index.html";
        return;
    }
    await initProducts();
    renderCategoryFilter();
    filterAndSearchProducts();
    document.getElementById("searchInput").oninput = filterAndSearchProducts;
    document.getElementById("categoryFilter").onchange = filterAndSearchProducts;
};

// --- Logout button logic ---
const logoutBtn = document.getElementById("logoutButton");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("isLogged");
    localStorage.removeItem("user");
    localStorage.removeItem("productId");
    localStorage.removeItem("products");
    window.location.href = "../../index.html";
  });
}
// --- Product Data Helpers ---
function getProducts() {
    return JSON.parse(localStorage.getItem("products") || "[]");
}
function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}
function createProduct(product) {
    const products = getProducts();
    product.id = Date.now();
    products.push(product);
    saveProducts(products);
}
function getProductById(id) {
    return getProducts().find(p => p.id == id);
}
function updateProduct(id, updated) {
    let products = getProducts();
    products = products.map(p => p.id == id ? { ...p, ...updated } : p);
    saveProducts(products);
}
function deleteProduct(id) {
    let products = getProducts();
    products = products.filter(p => p.id != id);
    saveProducts(products);
}

// --- Products Initialization ---
async function initProducts() {
    if (!localStorage.getItem("products")) {
        let data = await fetch('https://fakestoreapi.com/products');
        let products = await data.json();
        saveProducts(products);
    }
}

// --- Render Functions ---
function renderProducts(products) {
    const productsDiv = document.getElementById("products");
    if (!products.length) {
        productsDiv.innerHTML = "<p class='text-center'>No products found.</p>";
        return;
    }
    productsDiv.innerHTML = products.map(product => `
        <div class="col-md-4 col-sm-6 mb-4">
            <div class="card h-100 product-card">
                <img src="${product.image}" class="card-img-top" alt="${product.title}" style="height:200px;object-fit:contain;">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">${product.description.substring(0, 100)}...</p>
                    <p class="card-text"><strong>Price:</strong> $${product.price}</p>
                    <p class="card-text"><strong>Category:</strong> ${product.category}</p>
                </div>
                <div>
                <button class="btn btn-warning btn-sm" onclick="event.stopPropagation();showEditProductForm(${product.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();removeProductUI(${product.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

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

// --- CRUD UI ---
function showAddProductForm() {
    document.getElementById("addEditForm").style.display = "block";
    document.getElementById("addEditForm").innerHTML = `
        <form id="productForm">
            <input name="title" class="form-control mb-2" placeholder="Title" required>
            <input name="image" class="form-control mb-2" placeholder="Image URL" required>
            <textarea name="description" class="form-control mb-2" placeholder="Description" required></textarea>
            <input name="price" type="number" class="form-control mb-2" placeholder="Price" required>
            <input name="category" class="form-control mb-2" placeholder="Category" required>
            <button class="btn btn-success" type="submit">Add</button>
            <button class="btn btn-secondary" type="button" onclick="hideForm()">Cancel</button>
        </form>
    `;
    document.getElementById("productForm").onsubmit = function(e) {
        e.preventDefault();
        const product = {
            title: this.title.value,
            image: this.image.value,
            description: this.description.value,
            price: this.price.value,
            category: this.category.value
        };
        createProduct(product);
        hideForm();
        renderCategoryFilter();
        filterAndSearchProducts();
    };
}

function showEditProductForm(id) {
    const product = getProductById(id);
    if (!product) return alert("Product not found.");
    document.getElementById("addEditForm").style.display = "block";
    document.getElementById("addEditForm").innerHTML = `
        <form id="productForm">
            <input name="title" class="form-control mb-2" value="${product.title}" required>
            <input name="image" class="form-control mb-2" value="${product.image}" required>
            <textarea name="description" class="form-control mb-2" required>${product.description}</textarea>
            <input name="price" type="number" class="form-control mb-2" value="${product.price}" required>
            <input name="category" class="form-control mb-2" value="${product.category}" required>
            <button class="btn btn-warning" type="submit">Update</button>
            <button class="btn btn-secondary" type="button" onclick="hideForm()">Cancel</button>
        </form>
    `;
    document.getElementById("productForm").onsubmit = function(e) {
        e.preventDefault();
        const updated = {
            title: this.title.value,
            image: this.image.value,
            description: this.description.value,
            price: this.price.value,
            category: this.category.value
        };
        updateProduct(id, updated);
        hideForm();
        renderCategoryFilter();
        filterAndSearchProducts();
    };
}

function hideForm() {
    document.getElementById("addEditForm").style.display = "none";
    document.getElementById("addEditForm").innerHTML = "";
}

function removeProductUI(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        deleteProduct(id);
        renderCategoryFilter();
        filterAndSearchProducts();
    }
}

// --- Navigation ---
function getDetails(id) {
    localStorage.setItem("productId", id);
    window.location.href = "product.html";
}

// --- Expose functions for HTML buttons ---
window.showAddProductForm = showAddProductForm;
window.showEditProductForm = showEditProductForm;
window.removeProductUI = removeProductUI;
window.getDetails = getDetails;

