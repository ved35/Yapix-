export const apiConfig = {

  //live
  BASE_URL: "https://echomeet-3wyb.onrender.com",
  LIVE_URL: "https://api.example.com",

  // Request configuration
  TIMEOUT: 10000,
  RETRY: 3,

  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      SIGNUP: "/auth/signup",
      LOGOUT: "/auth/logout",
      RESET_PASSWORD: "/auth/resetPassword",
      VERIFY_OTP: "/auth/verify-otp",
      SEND_FORGOT_PASSWORD_OTP: "/auth/sendForgotPasswordOtp",
      GOOGLE_LOGIN: "/auth/googleLogin",
    },
    USER: {
      PROFILE: "/user/profile",
      SETTINGS: "/user/settings",
    },
  },

  // Headers
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};
