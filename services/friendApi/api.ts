import { apiConfig } from "@/config/apiConfig";
import Storage from "@/hooks/Storage";
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

export const friendApiServices = {
  friendSearch: async (username: string) => {
    try {
      const response = (await api.get(`${apiConfig.ENDPOINTS.FRIEND.SEARCHFRIEND}?username=${encodeURIComponent(username)}`)) as any;
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },
  friendRequestList: async () => {
    try {
      const response = (await api.get(apiConfig.ENDPOINTS.FRIEND.FRIEND_REQUESTLIST)) as any;
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },
  sendFriendRequest: async (receiver_id: string) => {
    try {
      const response = (await api.post(apiConfig.ENDPOINTS.FRIEND.FRIEND_REQUEST, { receiver_id })) as any;
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },
  friendRespondToRequest: async (request_id: string, status: string) => {
    try {
      const response = (await api.post(apiConfig.ENDPOINTS.FRIEND.FRIEND_RESPOND_TO_REQUEST, { request_id, status })) as any;
      return handleSuccess(response);
    } catch (error) {
      return handleError(error);
    }
  },
};
