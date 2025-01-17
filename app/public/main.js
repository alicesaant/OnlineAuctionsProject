import useLogin from './login.js';
import useRegister from './register.js';
import useUserDetails from './userDetails.js';
import useManageUsers from './manageUsers.js';
import useManageAuctions from './manageAuctions.js';
import useManageBids from './manageBids.js';

const app = Vue.createApp({
    setup() {
        const isAuthenticated = Vue.ref(localStorage.getItem('isAuthenticated') === 'true');
        const sessionTimeout = 30 * 60 * 1000;
        const currentSection = Vue.ref('home');

        const checkSessionExpiration = () => {
            const loginTime = localStorage.getItem('loginTime');
            if (loginTime) {
                const loginDate = new Date(loginTime);
                const currentTime = new Date();
                const elapsedTime = currentTime - loginDate;
                if (elapsedTime > sessionTimeout) {
                    localStorage.removeItem('isAuthenticated');
                    localStorage.removeItem('loginTime');
                    isAuthenticated.value = false;
                    alert("Session expired. Please log in again.");
                }
            }
        };

        checkSessionExpiration();

        const setCurrentSection = (section) => {
            currentSection.value = section;
        };

        const login = useLogin(isAuthenticated);
        const register = useRegister();
        const userDetails = useUserDetails();
        const manageUsers = useManageUsers();
        const manageAuctions = useManageAuctions();
        const manageBids = useManageBids();

        Vue.onMounted(() => {
            manageAuctions.getAllAuctions();
        });

        Vue.watch(isAuthenticated, (newValue) => {
            if (newValue) {
                manageAuctions.getAllAuctions();
                currentSection.value = 'home';
            } else {
                currentSection.value = 'home';
            }
        });

        Vue.watch(currentSection, (newSection) => {
            if (newSection === 'users' && isAuthenticated.value) {
                manageUsers.getAllUsers();
            } else if (newSection === 'personalinfo' && isAuthenticated.value) {
                userDetails.fetchUserDetails();
            } else if ((newSection === 'auctions' && isAuthenticated.value) || (newSection === 'home')) {
                manageAuctions.getAllAuctions();
            }
        });

        return {
            ...login,
            ...register,
            ...userDetails,
            ...manageUsers,
            ...manageAuctions,
            ...manageBids,
            isAuthenticated,
            currentSection,
            setCurrentSection,
            checkSessionExpiration,
        };
    },
});

app.mount('#app');