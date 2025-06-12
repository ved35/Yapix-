import authApiService from "@/services/authApi/api"
import { useQuery } from "@tanstack/react-query"

export const useVerifyOTPQuery = (otp: string) => {
    return useQuery({
        queryKey: ["verify-otp"],
        queryFn: () => authApiService.verifyOTP(otp),
    })
}