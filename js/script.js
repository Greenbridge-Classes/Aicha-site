// load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// save cart to localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// add item to cart
function addToCart(name, price) {
    cart.push({ name: name, price: price });
    saveCart();
    updateCartCount();

    // Better feedback than plain alert
    alert(`${name} has been added to your cart 🛒`);
}

// update cart count in navbar
function updateCartCount() {
    let count = document.getElementById("cart-count");
    if (count) {
        count.innerText = cart.length;
    }
}

// go to cart page
function viewCart() {
    window.location.href = "cart.html";
}

// display items in cart page
function displayCart() {
    let cartItems = document.getElementById("cart-items");
    let totalPrice = document.getElementById("total-price");
    let emptyMessage = document.getElementById("empty-message");

    // stop if not on cart page
    if (!cartItems || !totalPrice) return;

    cartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        if (emptyMessage) emptyMessage.classList.remove("d-none");
        totalPrice.innerText = "";
        return;
    } else {
        if (emptyMessage) emptyMessage.classList.add("d-none");
    }

    cart.forEach((item, index) => {
        let li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";

        li.innerHTML = `
            <div>
                <strong>${item.name}</strong><br>
                <small class="text-muted">UGX ${item.price}</small>
            </div>
            <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">
                ✖
            </button>
        `;

        cartItems.appendChild(li);
        total += item.price;
    });

    totalPrice.innerText = "Total: UGX " + total;
}

// Clear cart
function clearCart() {
    if (cart.length === 0) return;

    if (confirm("Are you sure you want to clear your cart?")) {
        cart = [];
        saveCart();
        displayCart();
        updateCartCount();
    }
}

// Run when page loads
updateCartCount();
displayCart();
