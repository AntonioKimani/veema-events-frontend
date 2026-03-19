// Load navbar and footer automatically
document.addEventListener('DOMContentLoaded', function() {
    // Load navbar
    fetch('navbar.html')
        .then(response => {
            if (!response.ok) throw new Error('Navbar not found');
            return response.text();
        })
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
            updateCartCount();
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
        });

    // Load footer
    fetch('footer.html')
        .then(response => {
            if (!response.ok) throw new Error('Footer not found');
            return response.text();
        })
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
});

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const counts = document.querySelectorAll('#cart-count');
    counts.forEach(el => {
        if (el) el.textContent = totalItems;
    });
}