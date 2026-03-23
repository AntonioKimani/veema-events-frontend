// frontend/assets/js/api.js
// API Service for connecting to backend

const API = {
    // ============================================
    // BACKEND URL - WILL BE SET BY NETLIFY ENV VAR
    // ============================================
    // In production, this will be replaced by Netlify
    baseURL: (function() {
        // Check if running on localhost
        if (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1') {
            return 'http://localhost:5000/api';
        }
        
        // Use environment variable set by Netlify
        if (window.ENV && window.ENV.BACKEND_URL) {
            return window.ENV.BACKEND_URL + '/api';
        }
        
        // Fallback for development
         return 'https://veema-events-backend.railway.app/api'; // ← UPDATE THIS
    })(),
    
    // Get auth token from localStorage
    getToken() {
        return localStorage.getItem('token');
    },
    
    // Headers with auth
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': this.getToken() ? `Bearer ${this.getToken()}` : ''
        };
    },
    
    // ============ PRODUCTS ============
    async getAllProducts() {
        try {
            const response = await fetch(`${this.baseURL}/products`);
            if (!response.ok) throw new Error('Failed to fetch products');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { products: [] };
        }
    },
    
    async getFeaturedProducts() {
        try {
            const response = await fetch(`${this.baseURL}/products/featured`);
            if (!response.ok) throw new Error('Failed to fetch featured products');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return [];
        }
    },
    
    async getProduct(id) {
        try {
            const response = await fetch(`${this.baseURL}/products/${id}`);
            if (!response.ok) throw new Error('Product not found');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return null;
        }
    },
    
    // ============ AUTH ============
    async register(userData) {
        try {
            const response = await fetch(`${this.baseURL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            console.error('API Error:', error);
            return { error: 'Registration failed' };
        }
    },
    
    async login(email, password) {
        try {
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            console.error('API Error:', error);
            return { error: 'Login failed' };
        }
    },
    
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    },
    
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    isAuthenticated() {
        return !!this.getToken();
    },
    
    // ============ ORDERS ============
    async createOrder(orderData) {
        try {
            const response = await fetch(`${this.baseURL}/orders`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(orderData)
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    async getUserOrders() {
        try {
            const response = await fetch(`${this.baseURL}/orders/my-orders`, {
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return [];
        }
    },
    
    // ============ CART ============
    async getCart() {
        try {
            const response = await fetch(`${this.baseURL}/cart`, {
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { items: [] };
        }
    },
    
    async addToCart(item) {
        try {
            const response = await fetch(`${this.baseURL}/cart/add`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(item)
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    async removeFromCart(itemId) {
        try {
            const response = await fetch(`${this.baseURL}/cart/remove/${itemId}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    async clearCart() {
        try {
            const response = await fetch(`${this.baseURL}/cart/clear`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};

// Make API available globally
window.API = API;