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

//   function renderProducts
function getProducts() {
    return JSON.parse(localStorage.getItem("products") || "[]");
}
function getCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
}
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
    const cartDiv = document.getElementById("cartItems");
    const cart = getCart();
    const products = getProducts();
    if (!cart.length) {
        cartDiv.innerHTML = `<p class="text-center empty-cart">Your cart is empty.</p>`;
        document.getElementById("cartTotal").innerHTML = "";
        return;
    }
    let total = 0;
    cartDiv.innerHTML = cart.map(item => {
        const product = products.find(p => p.id == item.id);
        if (!product) return '';
        const subtotal = product.price * item.qty;
        total += subtotal;
        return `
            <div class="cart-item row align-items-center mb-3">
                <div class="col-2">
                    <img src="${product.image}" alt="${product.title}" class="cart-img">
                </div>
                <div class="col-4">
                    <h5>${product.title}</h5>
                    <p class="mb-1 text-muted">${product.category}</p>
                </div>
                <div class="col-2">
                    <span class="cart-price">$${product.price.toFixed(2)}</span>
                </div>
                <div class="col-2">
                    <input type="number" min="1" value="${item.qty}" class="form-control cart-qty" data-id="${item.id}">
                </div>
                <div class="col-1">
                    <span class="cart-subtotal">$${subtotal.toFixed(2)}</span>
                </div>
                <div class="col-1 text-end">
                    <button class="btn btn-danger btn-sm remove-cart-btn" data-id="${item.id}"><i class="fa fa-trash"></i></button>
                </div>
            </div>
        `;
    }).join('');
    document.getElementById("cartTotal").innerHTML = `<h4>Total: $${total.toFixed(2)}</h4>`;

    // Quantity change
    document.querySelectorAll('.cart-qty').forEach(input => {
        input.addEventListener('change', function () {
            let cart = getCart();
            const id = this.getAttribute('data-id');
            const qty = Math.max(1, parseInt(this.value));
            const item = cart.find(i => i.id == id);
            if (item) item.qty = qty;
            saveCart(cart);
            renderCart();
        });
    });

    // Remove button
    document.querySelectorAll('.remove-cart-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            const item = cart.find(i => i.id == id);
            if (item) {
                if (item.qty > 1) {
                    item.qty -= 1; // Decrease quantity by 1
                } else {
                    cart = cart.filter(i => i.id != id); // Remove item if qty is 1
                }
                saveCart(cart);
                renderCart();
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", renderCart);