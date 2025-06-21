import { apiConfig } from "@/config/apiConfig";
import Storage from "@/hooks/Storage";
import { changePasswordData, editProfileData } from "@/interface/type";
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
      Storage.removeItem("token");
      Storage.removeItem("refreshToken");
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

export const profileApiService = {
  editProfile: async (credentials: editProfileData) => {
    try {
      const response = (await api.post(apiConfig.ENDPOINTS.PROFILE.PROFILE, credentials)) as any;
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },
  changePassword: async (credentials: changePasswordData) => {
    try {
      const response = (await api.post(
        apiConfig.ENDPOINTS.PROFILE.CHANGE_PASSWORD,
        credentials
      )) as any;
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },
};
