// Authentication related functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const authScreen = document.getElementById('authScreen');
    const startScreen = document.getElementById('startScreen');
    const userInfo = document.getElementById('userInfo');
    const usernameElement = document.getElementById('username');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginForm = document.getElementById('login');
    const registerForm = document.getElementById('register');
    const loginAlert = document.getElementById('loginAlert');
    const registerAlert = document.getElementById('registerAlert');
    
    // Check authentication status on page load
    checkAuthStatus();
    
    // Event Listeners
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Functions
    async function checkAuthStatus() {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.AUTH.STATUS}`, {
                credentials: 'include', // Important for cookies/sessions
                mode: 'cors'
            });
            const data = await response.json();
            
            if (data.isAuthenticated) {
                // User is logged in
                await fetchUserProfile();
                showGameScreen();
            } else {
                // User is not logged in
                showAuthScreen();
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            showAuthScreen();
        }
    }
    
    async function fetchUserProfile() {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.USER.PROFILE}`, {
                credentials: 'include',
                mode: 'cors'
            });
            if (response.ok) {
                const user = await response.json();
                usernameElement.textContent = user.username;
                userInfo.classList.remove('hidden');
                
                // Store user data in sessionStorage
                sessionStorage.setItem('user', JSON.stringify({
                    id: user._id,
                    username: user.username,
                    email: user.email
                }));
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    }
    
    async function handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            console.log('Login payload:', { username, password });
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.AUTH.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify({ username, password })
            });
            
            console.log('Login response status:', response.status);
            
            const data = await response.json();
            
            if (response.ok) {
                // Login successful
                usernameElement.textContent = data.user.username;
                showGameScreen();
                loginForm.reset();
                hideAlert(loginAlert);
            } else {
                // Login failed
                showAlert(loginAlert, data.message || 'Login failed', 'danger');
            }
        } catch (error) {
            console.error('Login error:', error);
            showAlert(loginAlert, 'An error occurred while logging in', 'danger');
        }
    }
    
    async function handleRegister(e) {
        e.preventDefault();
        
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        try {
            console.log('Register payload:', { username, email, password });
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.AUTH.REGISTER}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify({ username, email, password })
            });
            
            console.log('Register response status:', response.status);
            
            const data = await response.json();
            
            if (response.ok) {
                // Registration successful
                usernameElement.textContent = data.user.username;
                showGameScreen();
                registerForm.reset();
                hideAlert(registerAlert);
            } else {
                // Registration failed
                showAlert(registerAlert, data.message || 'Registration failed', 'danger');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showAlert(registerAlert, 'An error occurred while registering', 'danger');
        }
    }
    
    async function handleLogout() {
        try {
            await fetch(`${CONFIG.API_BASE_URL}${CONFIG.AUTH.LOGOUT}`, {
                credentials: 'include'
            });
            // Clear user data
            sessionStorage.removeItem('user');
            userInfo.classList.add('hidden');
            showAuthScreen();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
    
    function showAuthScreen() {
        authScreen.classList.remove('hidden');
        startScreen.classList.add('hidden');
        if (gameScreen) {
            gameScreen.style.display = 'none';
        }
    }
    
    function showGameScreen() {
        authScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        userInfo.classList.remove('hidden');
    }
    
    function showAlert(element, message, type) {
        element.textContent = message;
        element.className = `alert alert-${type}`;
        element.classList.remove('hidden');
    }
    
    function hideAlert(element) {
        element.classList.add('hidden');
    }
});
