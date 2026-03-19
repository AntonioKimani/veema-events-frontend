let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price, productId, quantity = 1) {
    price = Number(price);
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: name,
            price: price,
            quantity: quantity
        });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(`${quantity} × ${name} added to cart!`);
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const countElements = document.getElementById("cart-count");
    if (countElements) {
        countElements.innerText = totalItems;
    }
}

function displayCart() {
    const cartItems = document.getElementById("cart-items");
    if (!cartItems) return;

    cartItems.innerHTML = "";
    let total = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<li class="list-group-item text-center">Your cart is empty</li>';
        document.getElementById("total").innerText = "Total: Ksh 0";
        document.getElementById("itemCount").innerText = "0";
        return;
    }

    cart.forEach((item, index) => {
        const quantity = item.quantity || 1;
        const itemTotal = item.price * quantity;
        total += itemTotal;
        totalItems += quantity;

        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <br>
                <small>Ksh ${item.price} × ${quantity}</small>
            </div>
            <div>
                <span class="fw-bold me-3">Ksh ${itemTotal}</span>
                <button onclick="removeItem(${index})" class="btn btn-sm btn-danger">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        cartItems.appendChild(li);
    });

    document.getElementById("total").innerText = `Total: Ksh ${total}`;
    document.getElementById("itemCount").innerText = totalItems;
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

function clearCart() {
    if (confirm("Clear your cart?")) {
        cart = [];
        localStorage.removeItem("cart");
        displayCart();
        updateCartCount();
    }
}

// Initialize on page load
if (window.location.pathname.includes("cart.html")) {
    document.addEventListener('DOMContentLoaded', displayCart);
}
document.addEventListener('DOMContentLoaded', updateCartCount);