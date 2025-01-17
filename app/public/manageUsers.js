export default function useManageUsers() {
    const noUsersMessage = Vue.ref(null);
    const userData = Vue.reactive({ username: '' });
    const users = Vue.ref([]);
    const wonAuctions = Vue.ref([]);
    const selectedUserId = Vue.ref(null);
    const showDetails = Vue.ref(false);
    const userDetailsTable = Vue.ref(null);

    const getAllUsers = async () => {
        try {
            const response = await fetch(`/api/users/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error("Error fetching users");
            }
            users.value = await response.json();
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const searchUser = async () => {
        try {
            const response = await fetch(`/api/users/?q=${ userData.username }`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error("Error fetching users");
            }
            const data = await response.json();
            if (data.users && data.users.length === 0) {
                users.value = [];
                noUsersMessage.value = data.message;
            } else {
                users.value = data;
                noUsersMessage.value = null;
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const scrollToUserDetailsTable = () => {
        if (userDetailsTable.value) {
            userDetailsTable.value.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const getUserById = async (userId) => {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error("Error fetching user details");
            }
            wonAuctions.value = await response.json();
            selectedUserId.value = userId;
            showDetails.value = true;

            setTimeout(() => {
                scrollToUserDetailsTable();
            }, 100);

        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const closeDetails = () => {
        selectedUserId.value = null;
        showDetails.value = false;
        wonAuctions.value = [];
    };

    return {
        noUsersMessage,
        userData,
        users,
        wonAuctions,
        selectedUserId,
        showDetails,
        userDetailsTable,
        getAllUsers,
        searchUser,
        getUserById,
        closeDetails,
        scrollToUserDetailsTable,
    };
}