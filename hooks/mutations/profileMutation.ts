import { changePasswordData, editProfileData } from "@/interface/type";
import { profileApiService } from "@/services/profileApi/api";
import useAuthStore from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";

export const useEditPrfileMutation = () => {
  const { setUser, user } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: editProfileData) => profileApiService.editProfile(credentials),
    onSuccess: (data) => {
      console.log("data", data?.data?.user);
      if (data?.data?.user) {
        let Userdata = {
          id: user?.id || "",
          name: data?.data?.user?.name,
          username: data?.data?.user?.username,
          email: user?.email || "",
          profile_picture: user?.profile_picture || "",
        };
        setUser(Userdata);
      }
    },
    onError: (error) => {
      // Error is already handled in the API service
      console.error("Login error:", error);
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (credentials: changePasswordData) => profileApiService.changePassword(credentials),
    onSuccess: (data) => {},
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};
