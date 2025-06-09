import { api } from "@/lib/api";

export const sendForgotPasswordOTP = async (email: string) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

interface ResetPasswordParams {
  password: string;
}

export const resetPassword = async (params: ResetPasswordParams) => {
  const response = await api.post("/auth/reset-password", params);
  return response.data;
};
