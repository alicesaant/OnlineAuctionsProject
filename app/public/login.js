import { displayMessage } from "./utils.js";

export default function useLogin(isAuthenticated) {
    const loginData = Vue.reactive({ username: '', password: '', message: '' });

    const handleLogin = async () => {
        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: loginData.username,
                    password: loginData.password,
                }),
            });
            const result = await response.json();
            if (response.ok) {
                loginData.message = displayMessage(result.message, 'success');
                setTimeout(() => {
                    isAuthenticated.value = true;
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('username', loginData.username);
                    localStorage.setItem('loginTime', new Date().toString());
                }, 2000);
            } else {
                loginData.message = displayMessage(result.message, 'danger');
            }
        } catch (error) {
            loginData.message = displayMessage('Internal server error. Please try again later.', 'danger');
        }

        setTimeout(() => {
            loginData.message = '';
            loginData.username = '';
            loginData.password = '';
        }, 5000);
    };

    const logout = async () => {
        try {
            const response = await fetch('/api/auth/logout', { method: 'POST' });
            if (response.ok) {
                setTimeout(() => {
                    isAuthenticated.value = false;
                    localStorage.removeItem('isAuthenticated');
                    localStorage.removeItem('username');
                    localStorage.removeItem('loginTime');
                }, 2000);
                alert('Logout successful!', 'success');
            } else {
                alert('Logout failed! Please try again.');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return { loginData, handleLogin, logout };
}