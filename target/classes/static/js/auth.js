// Authentication JavaScript Module for CRM System

const AUTH_KEY = 'crm_user_session';

document.addEventListener('DOMContentLoaded', () => {
    initAuthTabs();
    initAuthForms();
    checkAuthStatus();
});

function initAuthTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const tab = btn.getAttribute('data-tab');
            if (tab === 'login') {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            } else {
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
            }
        });
    });
}

function initAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const result = await response.json();
                if (response.ok && result.success) {
                    localStorage.setItem(AUTH_KEY, JSON.stringify(result));
                    showToast('Welcome back, ' + result.fullName + '!', 'success');
                    showAppView();
                } else {
                    showToast(result.message || 'Login failed', 'danger');
                }
            } catch (err) {
                console.error(err);
                showToast('Server error during login', 'danger');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('regUsername').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const fullName = document.getElementById('regFullName').value.trim();
            const password = document.getElementById('regPassword').value;

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, fullName, password })
                });

                const result = await response.json();
                if (response.ok && result.success) {
                    showToast('Registration successful! Please login.', 'success');
                    // Switch to login tab
                    document.querySelector('.tab-btn[data-tab="login"]').click();
                    document.getElementById('loginUsername').value = username;
                } else {
                    showToast(result.message || 'Registration failed', 'danger');
                }
            } catch (err) {
                console.error(err);
                showToast('Server error during registration', 'danger');
            }
        });
    }
}

function checkAuthStatus() {
    const session = getAuthSession();
    if (session) {
        showAppView();
    } else {
        showAuthView();
    }
}

function getAuthSession() {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
}

function logoutUser() {
    localStorage.removeItem(AUTH_KEY);
    showToast('Logged out successfully', 'success');
    showAuthView();
}

function showAuthView() {
    document.getElementById('authWrapper').classList.remove('hidden');
    document.getElementById('appContainer').classList.add('hidden');
}

function showAppView() {
    const session = getAuthSession();
    if (session) {
        document.getElementById('navUserFullName').textContent = session.fullName || session.username;
        document.getElementById('navUserAvatar').textContent = (session.fullName || session.username).charAt(0).toUpperCase();
    }
    document.getElementById('authWrapper').classList.add('hidden');
    document.getElementById('appContainer').classList.remove('hidden');
    
    // Load initial dashboard metrics
    if (window.loadDashboardData) {
        window.loadDashboardData();
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✓' : '⚠️'}</span><span>${message}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 4000);
}
