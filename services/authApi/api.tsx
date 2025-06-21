import { apiConfig } from "@/config/apiConfig";
import {
  GoogleData,
  LoginCredentials,
  NewPasswordData,
  RegisterData,
  VerifyOTPData,
} from "@/interface/type";
import { AxiosResponse } from "axios";
import { router } from "expo-router";
import { showMessage } from "react-native-flash-message";
import api from "../axios";

const handleSuccess = (response: AxiosResponse["data"]) => {
  if (response?.success || response?.data?.success) {
    showMessage({
      type: "success",
      message: "success",
      description: response?.data?.message || response?.message,
    });
  } else {
    showMessage({
      type: "danger",
      message: "Fail",
      description: response?.data?.message || response?.message,
    });
    if (response?.data?.statusCode === 403 && response?.data?.message === "Invalid token.") {
      router.replace("/");
    }
  }
  return response;
};

const handleError = (error: any) => {
  const errorMessage = error instanceof Error ? error?.message : String(error);
  console.log("errorMessage-->", errorMessage);
  showMessage({
    type: "danger",
    message: "Fail",
    description: errorMessage,
  });
  return errorMessage;
};

export const authApiService = {
  login: async (credentials: LoginCredentials) => {
    try {
      const response = (await api.post(apiConfig.ENDPOINTS.AUTH.LOGIN, credentials)) as any;
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },

  register: async (userData: RegisterData) => {
    try {
      const response = (await api.post(apiConfig.ENDPOINTS.AUTH.SIGNUP, userData)) as any;
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },

  googleSignIn: async (data: GoogleData) => {
    try {
      const response = (await api.post(apiConfig.ENDPOINTS.AUTH.GOOGLE_LOGIN, data)) as any;
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },

  logout: async () => {
    try {
      const response = (await api.post(apiConfig.ENDPOINTS.AUTH.LOGOUT)) as any;
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },

  resetPassword: async (data: NewPasswordData) => {
    try {
      const response = (await api.post(apiConfig.ENDPOINTS.AUTH.RESET_PASSWORD, data)) as any;
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },

  verifyOTP: async (data: VerifyOTPData) => {
    try {
      const response = (await api.post(apiConfig.ENDPOINTS.AUTH.VERIFY_OTP, data)) as any;
      return handleSuccess(response);
    } catch (error) {
      console.log("error-->", JSON.stringify(error));
      return handleError(error);
    }
  },

  sendForgotPasswordOTP: async (email: string) => {
    try {
      const response = (await api.post(apiConfig.ENDPOINTS.AUTH.SEND_FORGOT_PASSWORD_OTP, {
        email,
      })) as any;
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },
};

export default authApiService;
