// frontend/assets/js/firebase.js
// Import Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

// Your web app's Firebase configuration (COPY THIS EXACTLY)
const firebaseConfig = {
  apiKey: "AIzaSyA0D7OnPSrkF0fFrcdQnYpTJGIyGjUNlWU",
  authDomain: "veema-events.firebaseapp.com",
  projectId: "veema-events",
  storageBucket: "veema-events.firebasestorage.app",
  messagingSenderId: "933547953857",
  appId: "1:933547953857:web:84fe2d92fb721763508e40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Backend URL (update with your Railway URL)
const BACKEND_URL = window.ENV?.BACKEND_URL || 'https://veema-events-backend.railway.app';

// Login function
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    
    // Store token
    localStorage.setItem('firebaseToken', token);
    localStorage.setItem('userEmail', email);
    
    // Verify with your backend and check admin status
    const response = await fetch(`${BACKEND_URL}/api/auth/is-admin`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    
    return { 
      success: true, 
      user: userCredential.user, 
      isAdmin: data.isAdmin || false,
      token 
    };
  } catch (error) {
    let errorMessage = 'Login failed';
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Try again later';
        break;
      default:
        errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

// Register function
export async function register(email, password, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    
    // Store token
    localStorage.setItem('firebaseToken', token);
    localStorage.setItem('userEmail', email);
    
    // Optional: Save user name to your PostgreSQL database via backend
    await fetch(`${BACKEND_URL}/api/auth/sync-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, email })
    });
    
    return { success: true, user: userCredential.user, token };
  } catch (error) {
    let errorMessage = 'Registration failed';
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Email already registered';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      default:
        errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

// Logout function
export async function logout() {
  try {
    await signOut(auth);
    localStorage.removeItem('firebaseToken');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Get current user token
export async function getCurrentToken() {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
}

// Check if user is logged in and admin
export async function checkAdminStatus() {
  const token = localStorage.getItem('firebaseToken');
  if (!token) return { isLoggedIn: false, isAdmin: false };
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/is-admin`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    return { 
      isLoggedIn: true, 
      isAdmin: data.isAdmin || false,
      user: data.user
    };
  } catch (error) {
    return { isLoggedIn: true, isAdmin: false };
  }
}

// Listen to auth state changes
export function onAuthStateChangedListener(callback) {
  return onAuthStateChanged(auth, callback);
}

// Reset password
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: 'Password reset email sent' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Export auth instance
export { auth };