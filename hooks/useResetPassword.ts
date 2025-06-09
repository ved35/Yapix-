import { resetPassword } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";

interface ResetPasswordParams {
  password: string;
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (params: ResetPasswordParams) => resetPassword(params),
  });
};
