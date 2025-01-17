import { displayMessage } from "./utils.js";

export default function useRegister() {
    const registerData = Vue.reactive({
        username: '',
        name: '',
        surname: '',
        password: '',
        message: ''
    });

    const handleSignup = async () => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: registerData.username,
                    name: registerData.name,
                    surname: registerData.surname,
                    password: registerData.password,
                }),
            });
            const result = await response.json();
            if (response.ok) {
                registerData.message = displayMessage(result.message, 'success');
                registerData.username = '';
                registerData.name = '';
                registerData.surname = '';
                registerData.password = '';
            } else {
                registerData.message = displayMessage(result.message, 'danger');
            }
        } catch (error) {
            registerData.message = displayMessage('Internal server error. Please try again later.', 'danger');
        }

        setTimeout(() => {
            registerData.message = '';
        }, 5000);
    };

    return { registerData, handleSignup };
}