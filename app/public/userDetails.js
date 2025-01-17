export default function useUserDetails() {
    const user = Vue.reactive({
        userId: null,
        username: '',
        name: '',
        surname: '',
        message: '',
    });

    const fetchUserDetails = async () => {
        try {
            const response = await fetch('/api/whoami', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch user details");
            }
            const data = await response.json();
            user.userId = data.userId;
            user.username = data.username;
            user.name = data.name;
            user.surname = data.surname;
        } catch (error) {
            user.message = "Unable to fetch user details. Please try again.";
        }
    };

    return { user, fetchUserDetails };
}
