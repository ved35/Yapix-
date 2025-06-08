import { LoginCredentials, RegisterData } from "@/interface/type";
import { authApiService } from "@/services/authApi/api";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () => {
  const navigation = useNavigation();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApiService.login(credentials),
    onSuccess: (data) => {
      // Handle successful login
      // You can add navigation logic here
      // For example: navigation.navigate('Home');
    },
    onError: (error) => {
      // Error is already handled in the API service
      console.error("Login error:", error);
    },
  });
};

export const useSignupMutation = () => {
  const navigation = useNavigation();

  return useMutation({
    mutationFn: (userData: RegisterData) => authApiService.register(userData),
    onSuccess: (data) => {
      // Handle successful registration
      // You can add navigation logic here
      // For example: navigation.navigate('Login');
    },
    onError: (error) => {
      // Error is already handled in the API service
      console.error("Signup error:", error);
    },
  });
};

export const useLogoutMutation = () => {
  const navigation = useNavigation();

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
