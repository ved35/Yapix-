export const apiConfig = {
  //live
  BASE_URL: "https://echomeet-3wyb.onrender.com",
  IMAGE_URL: "https://echomeet-3wyb.onrender.com/",
  SOCKET_URL: "https://echomeet-3wyb.onrender.com",
  LIVE_URL: "https://api.example.com",

  //local
  // BASE_URL: "http://192.168.31.162:5000",
  // SOCKET_URL: "http://192.168.31.162:5000/",

  // Request configuration
  TIMEOUT: 20000,
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
    PROFILE: {
      PROFILE: "/profile/editProfile",
      CHANGE_PASSWORD: "/profile/changePassword",
    },
    FRIEND: {
      SEARCHFRIEND: "/messages/search",
      FRIEND_REQUEST: "/messages/friendRequest",
      FRIEND_RESPOND_TO_REQUEST: "/messages/friendRespondToRequest",
      FRIEND_REQUESTLIST: "/messages/friendRequestList",
    }
  },

  // Headers
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};
