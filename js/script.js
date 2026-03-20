// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// SAVE cart to localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Add item to cart
function addToCart(name, price) {
    cart.push({ name: name, price: price });
    saveCart();
    updateCartCount();
    alert(name + " added to cart!");
}

// Update cart count in navbar
function updateCartCount() {
    let count = document.getElementById("cart-count");
    if (count) {
        count.innerText = cart.length;
    }
}

// Go to cart page
function viewCart() {
    window.location.href = "cart.html";
}

// Display items in cart page
function displayCart() {
    let cartItems = document.getElementById("cart-items");
    let totalPrice = document.getElementById("total-price");

    // Stop if not on cart page
    if (!cartItems || !totalPrice) return;

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        let li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";

        li.innerHTML = `
            ${item.name}
            <span>UGX ${item.price}</span>
        `;

        cartItems.appendChild(li);
        total += item.price;
    });

    totalPrice.innerText = "Total: UGX " + total;
}

// Clear cart
function clearCart() {
    cart = [];
    saveCart();
    displayCart();
    updateCartCount();
}

// Run when page loads
updateCartCount();
displayCart();