import Storage from '@/hooks/Storage';
import { LoginCredentials, NewPasswordData, PasswordResetData, RegisterData } from '@/interface/type';
import { showMessage } from 'react-native-flash-message';
import api from '../axios';

const handleSuccess = (response: any) => {
  showMessage({
    type: 'success',
    message: 'success',
    description: response?.data?.message || response?.message,
  });
  return response.data;
}

const handleError = (error: any) => {
  showMessage({
    type: 'danger',
    message: 'Fail',
    description: error.response?.data?.message || error.message,
  });
  return error;
}


// Authentication API functions
export const authApiService = {
  // Login user
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Register new user
  register: async (userData: RegisterData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      Storage.removeItem('token');
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Request password reset
  requestPasswordReset: async (data: PasswordResetData) => {
    try {
      const response = await api.post('/auth/forgot-password', data);
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Reset password with token
  resetPassword: async (data: NewPasswordData) => {
    try {
      const response = await api.post('/auth/reset-password', data);
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Refresh access token
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh-token');
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Verify email
  verifyEmail: async (token: string) => {
    try {
      const response = await api.post('/auth/verify-email', { token });
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Resend verification email
  resendVerificationEmail: async (email: string) => {
    try {
      const response = await api.post('/auth/resend-verification', { email });
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Update user profile
  updateProfile: async (userData: Partial<RegisterData>) => {
    try {
      const response = await api.put('/auth/profile', userData);
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Change password
  changePassword: async (oldPassword: string, newPassword: string) => {
    try {
      const response = await api.post('/auth/change-password', { oldPassword, newPassword });
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Verify OTP
  verifyOTP: async (otp: string) => {
    try {
      const response = await api.post('/auth/verify-otp', { otp });
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },
};

export default authApiService;
