import { sendForgotPasswordOTP } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";

export const useSendForgotPasswordOTP = () => {
  return useMutation({
    mutationFn: sendForgotPasswordOTP,
  });
};
