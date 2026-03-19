// assets/js/utils.js
// This ensures cart count updates everywhere

function updateAllCartCounts() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.length;
    
    // Update all possible cart count elements
    document.querySelectorAll('#cart-count, .cart-count, [id="cart-count"]').forEach(el => {
        if (el) el.innerText = count;
    });
    
    // Update cart text in buttons if they exist
    document.querySelectorAll('.cart-count-text').forEach(el => {
        el.innerText = count;
    });
}

// Listen for cart updates
window.addEventListener('storage', function(e) {
    if (e.key === 'cart') {
        updateAllCartCounts();
    }
});

// Run on page load
document.addEventListener('DOMContentLoaded', updateAllCartCounts);