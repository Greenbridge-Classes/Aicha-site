// Cart management
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Core cart functions
function saveCart() { localStorage.setItem("cart", JSON.stringify(cart)); }
function updateCartCount() { let count = document.getElementById("cart-count"); if (count) count.innerText = cart.length; }

// Add items to cart
function addToCart(name, price) {
    cart.push({ name, price });
    saveCart();
    updateCartCount();
    showToast(`${name} added to cart! 🛒`);
}

function addToCartWithQuantity(name, price, button) {
    const quantity = parseInt(button.parentElement.querySelector('.quantity').textContent);
    for (let i = 0; i < quantity; i++) cart.push({ name, price });
    saveCart();
    updateCartCount();
    showToast(`${quantity}x ${name} added to cart! 🛒`);
}

// Display cart items on cart page
function displayCart() {
    let cartItems = document.getElementById("cart-items");
    let totalPrice = document.getElementById("total-price");
    let checkoutBtn = document.getElementById("checkout-btn");
    let clearBtn = document.getElementById("clear-btn");
    
    if (!cartItems || !totalPrice) return;

    cartItems.innerHTML = "";
    let total = 0, itemCount = {};

    // Group items and calculate totals
    cart.forEach(item => {
        if (!itemCount[item.name]) itemCount[item.name] = { count: 0, price: item.price };
        itemCount[item.name].count++;
        total += item.price;
    });

    // Show empty cart message and disable buttons
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-muted">Your cart is empty</p>';
        totalPrice.innerText = "UGX 0";
        if (checkoutBtn) checkoutBtn.disabled = true;
        if (clearBtn) clearBtn.disabled = true;
        return;
    }

    // Enable buttons when cart has items
    if (checkoutBtn) checkoutBtn.disabled = false;
    if (clearBtn) clearBtn.disabled = false;

    // Display grouped items with quantities
    Object.keys(itemCount).forEach(itemName => {
        const item = itemCount[itemName], itemTotal = item.count * item.price;
        cartItems.innerHTML += `
            <div class="cart-item mb-3 p-3 bg-white rounded shadow-sm">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1 fw-bold">${itemName}</h6>
                        <small class="text-muted">${item.count}x UGX ${item.price}</small>
                    </div>
                    <div class="fw-bold text-success">UGX ${itemTotal}</div>
                </div>
            </div>`;
    });

    totalPrice.innerText = `UGX ${total + 2500}`;
}

// Clear cart and navigation
function clearCart() {
    if (confirm("Clear your cart?")) {
        cart = [];
        saveCart();
        displayCart();
        updateCartCount();
    }
}

function viewCart() { window.location.href = "cart.html"; }
function goToCheckout() { window.location.href = "checkout.html"; }

// MENU PAGE FUNCTIONS
// Quantity controls for product cards
function increaseQuantity(button) {
    const quantitySpan = button.parentElement.querySelector('.quantity');
    quantitySpan.textContent = parseInt(quantitySpan.textContent) + 1;
}

function decreaseQuantity(button) {
    const quantitySpan = button.parentElement.querySelector('.quantity');
    const quantity = parseInt(quantitySpan.textContent);
    if (quantity > 1) quantitySpan.textContent = quantity - 1;
}

// Search and filter functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            document.querySelectorAll('.menu-item').forEach(item => {
                const name = item.getAttribute('data-name');
                item.style.display = name && name.includes(searchTerm) ? 'block' : 'none';
            });
        });
    }
}

function initializeFilters() {
    document.querySelectorAll('.category-filters button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.category-filters button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const selectedCategory = this.getAttribute('data-category');
            document.querySelectorAll('.menu-item').forEach(item => {
                item.style.display = selectedCategory === 'all' || item.getAttribute('data-category') === selectedCategory ? 'block' : 'none';
            });
        });
    });
}

// CHECKOUT PAGE FUNCTIONS
// Order summary and WhatsApp integration
function displayOrderSummary() {
    const orderItems = document.getElementById('order-items');
    if (!orderItems) return;

    orderItems.innerHTML = '';
    let total = 0, itemCount = {};

    // Count items for display
    cart.forEach(item => {
        if (!itemCount[item.name]) itemCount[item.name] = { count: 0, price: item.price };
        itemCount[item.name].count++;
        total += item.price;
    });

    // Display order items
    Object.keys(itemCount).forEach(itemName => {
        const item = itemCount[itemName];
        orderItems.innerHTML += `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <div class="fw-bold">${itemName}</div>
                    <small class="text-muted">${item.count}x UGX ${item.price}</small>
                </div>
                <span class="fw-bold">UGX ${item.count * item.price}</span>
            </div>`;
    });

    updateTotalPrice(total);
}

// Calculate total with delivery options
function updateTotalPrice(subtotal) {
    const deliveryOption = document.querySelector('input[name="delivery"]:checked')?.value || 'standard';
    let deliveryCost = deliveryOption === 'express' ? 4000 : deliveryOption === 'pickup' ? 0 : 2000;
    const serviceCharge = 500, total = subtotal + deliveryCost + serviceCharge;

    document.getElementById('subtotal').textContent = `UGX ${subtotal}`;
    document.getElementById('delivery-cost').textContent = `UGX ${deliveryCost}`;
    document.getElementById('service-charge').textContent = `UGX ${serviceCharge}`;
    document.getElementById('total-price').textContent = `UGX ${total}`;
}

// Place order via WhatsApp
function placeOrder() {
    const name = document.getElementById('name')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const location = document.getElementById('location')?.value.trim();

    // Validate form
    if (!name || !phone || !location) {
        showToast('Please fill all required fields ❌', 'danger');
        return;
    }

    if (cart.length === 0) {
        showToast('Your cart is empty 🛒', 'danger');
        return;
    }

    // Build WhatsApp message
    let message = `🍦 AI-CHA ORDER 🍦\n\n👤 Customer Details\nName: ${name}\nPhone: ${phone}\nLocation: ${location}\n\n🧾 Order Items\n`;
    let total = 0;
    cart.forEach(item => {
        message += `${item.name} - UGX ${item.price}\n`;
        total += item.price;
    });

    message += `\n💰 Total: UGX ${total + 2500}\nThank you for choosing Ai-Cha! 🎉`;

    // Send via WhatsApp
    const whatsappNumber = "256780770671";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    showToast('Opening WhatsApp... 📱', 'success');
    setTimeout(() => window.open(url, '_blank'), 1000);
}

// NOTIFICATION SYSTEM
// Toast notifications for user feedback
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 250px;';
    toast.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// INITIALIZE ALL FUNCTIONS
// Run when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    displayCart();
    initializeSearch();
    initializeFilters();
    displayOrderSummary();
    document.querySelectorAll('input[name="delivery"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
            updateTotalPrice(subtotal);
        });
    });
});
