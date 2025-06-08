export const apiConfig = {
    BASE_URL: 'http://localhost:3000',
    LIVE_URL: 'https://api.example.com',

    // Request configuration
    TIMEOUT: 10000,
    RETRY: 3,

    // API endpoints
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            LOGOUT: '/auth/logout',
        },
        USER: {
            PROFILE: '/user/profile',
            SETTINGS: '/user/settings',
        }
    },

    // Headers
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
}