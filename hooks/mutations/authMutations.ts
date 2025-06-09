import { LoginCredentials, NewPasswordData, RegisterData } from "@/interface/type";
import { authApiService } from "@/services/authApi/api";
import useAuthStore from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import Storage from "../Storage";

export const useLoginMutation = () => {
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApiService.login(credentials),
    onSuccess: (data) => {
      console.log("data", data);
      if (data?.token) {
        Storage.setItem("token", data.token);
        setUser(data.user);
      }
    },
    onError: (error) => {
      // Error is already handled in the API service
      console.error("Login error:", error);
    },
  });
};

export const useSignupMutation = () => {
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (userData: RegisterData) => authApiService.register(userData),
    onSuccess: (data) => {
      console.log("data", data);
      if (data?.token) {
        Storage.setItem("token", data.token);
        setUser(data.user);
      }
    },
    onError: (error) => {
      // Error is already handled in the API service
      console.error("Signup error:", error);
    },
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () => authApiService.logout(),
    onSuccess: (data) => {
      // Handle successful logout
      // You can add navigation logic here
      // For example: navigation.navigate('Login');
    },
    onError: (error) => {
      // Error is already handled in the API service
      console.error("Logout error:", error);
    },
  });
};

export const useVerifyOTPMutation = () => {
  return useMutation({
    mutationFn: (otp: string) => authApiService.verifyOTP(otp),
    onSuccess: (data) => {
      // Handle successful OTP verification
      // You can add navigation logic here if needed
    },
    onError: (error) => {
      // Error is already handled in the API service
      console.error("OTP verification error:", error);
    },
  });
};

export const useSendForgotPasswordOTPMutation = () => {
  return useMutation({
    mutationFn: (email: string) => authApiService.sendForgotPasswordOTP(email),
    onSuccess: (data) => {
      // Handle successful OTP sending
    },
    onError: (error) => {
      // Error is already handled in the API service
      console.error("Send OTP error:", error);
    },
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: NewPasswordData) => authApiService.resetPassword(data),
    onSuccess: (data) => {
      // Handle successful password reset
      // You can add navigation logic here if needed
    },
    onError: (error) => {
      // Error is already handled in the API service
      console.error("Reset password error:", error);
    },
  });
};
