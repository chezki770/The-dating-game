// Configuration settings for the client application
const CONFIG = {
    // API base URL - change this when deploying to production
    API_BASE_URL: 'http://localhost:3000/api',
    
    // Authentication endpoints
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        STATUS: '/auth/status'
    },
    
    // User endpoints
    USER: {
        PROFILE: '/user/profile',
        GAME_HISTORY: '/user/game-history'
    }
};

// Prevent modification of the configuration
Object.freeze(CONFIG);
