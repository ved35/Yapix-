import { apiConfig } from "@/config/apiConfig";
import Storage from "@/hooks/Storage";
import { LoginCredentials, NewPasswordData, RegisterData } from "@/interface/type";
import { showMessage } from "react-native-flash-message";
import api from "../axios";

const handleSuccess = (response: any) => {
  showMessage({
    type: "success",
    message: "success",
    description: response?.data?.message || response?.message,
  });
  return response.data;
};

const handleError = (error: any) => {
  showMessage({
    type: "danger",
    message: "Fail",
    description: error.response?.data?.message || error.message || error,
  });
  return error;
};

export const authApiService = {
  login: async (credentials: LoginCredentials) => {
    try {
      const response = (await api.post(apiConfig.ENDPOINTS.AUTH.LOGIN, credentials)) as any;
      if (response?.success || response?.data?.success) {
        return handleSuccess(response);
      }
      return handleError(response);
    } catch (error) {
      return handleError(error);
    }
  },

  register: async (userData: RegisterData) => {
    try {
      const response = (await api.post(apiConfig.ENDPOINTS.AUTH.SIGNUP, userData)) as any;
      if (response?.success || response?.data?.success) {
        return handleSuccess(response);
      }
      return handleError(response);
    } catch (error) {
      return handleError(error);
    }
  },

  logout: async () => {
    try {
      const response = (await api.post(apiConfig.ENDPOINTS.AUTH.LOGOUT)) as any;
      Storage.removeItem("token");
      if (response?.success || response?.data?.success) {
        return handleSuccess(response);
      }
      return handleError(response);
    } catch (error) {
      return handleError(error);
    }
  },

  resetPassword: async (data: NewPasswordData) => {
    try {
      const response = (await api.post(apiConfig.ENDPOINTS.AUTH.RESET_PASSWORD, data)) as any;
      if (response?.success || response?.data?.success) {
        return handleSuccess(response);
      }
      return handleError(response);
    } catch (error) {
      return handleError(error);
    }
  },

  verifyOTP: async (otp: string) => {
    try {
      const response = (await api.post(apiConfig.ENDPOINTS.AUTH.VERIFY_OTP, { otp })) as any;
      if (response?.success || response?.data?.success) {
        return handleSuccess(response);
      }
      return handleError(response);
    } catch (error) {
      return handleError(error);
    }
  },

  sendForgotPasswordOTP: async (email: string) => {
    try {
      const response = (await api.post(apiConfig.ENDPOINTS.AUTH.SEND_FORGOT_PASSWORD_OTP, {
        email,
      })) as any;
      if (response?.success || response?.data?.success) {
        return handleSuccess(response);
      }
      return handleError(response);
    } catch (error) {
      return handleError(error);
    }
  },
};

export default authApiService;
