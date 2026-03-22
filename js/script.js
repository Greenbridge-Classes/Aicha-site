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
    alert(name + " added to cart!");
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

    // stop if not on cart page
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

// clear cart
function clearCart() {
    cart = [];
    saveCart();
    displayCart();
    updateCartCount();
}

// place order via WhatsApp
function placeOrder() {
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let location = document.getElementById("location").value;

    if (!name || !phone || !location) {
        alert("Please fill all fields");
        return;
    }

    let message = "New Order:\n\n";

    let total = 0;

    cart.forEach(item => {
        message += `${item.name} - UGX ${item.price}\n`;
        total += item.price;
    });

    message += `\nTotal: UGX ${total}\n\n`;
    message += `Customer Name: ${name}\n`;
    message += `Phone: ${phone}\n`;
    message += `Location: ${location}`;

    let whatsappNumber = "256780770671";

    let url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
}

function goToCheckout() {
    window.location.href = "checkout.html";
}

// run when page loads
updateCartCount();
displayCart();