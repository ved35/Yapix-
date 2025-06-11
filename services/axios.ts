import { apiConfig } from "@/config/apiConfig";
import Storage from "@/hooks/Storage";
import * as NetInfo from "@react-native-community/netinfo";
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const getNetInfo = async () => {
  const isConnected = (await NetInfo.fetch()).isConnected;
  return isConnected;
};

const getToken = () => {
  const token = Storage.getItem("token");
  return token;
};

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: apiConfig.BASE_URL,
    timeout: apiConfig.TIMEOUT,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return instance;
};

const axiosInstance = createAxiosInstance();

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig | any) => {
    const isConnected = await getNetInfo();
    if (!isConnected) {
      return Promise.reject({
        success: false,
        message: "No internet connection. Please check your network and try again.",
      });
    }

    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error: any) => {
    return Promise.reject({
      success: false,
      message: "An error occurred while processing your request. Please try again later.",
    });
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse | any) => {
    return response?.data || response;
  },
  (error: AxiosError | any) => {
    // Handle server response errors
    if (error?.response) {
      console.log("error", error?.response);
      return {
        success: false,
        message: error.response.data?.message || "Server error occurred. Please try again.",
        data: error.response.data,
      };
    }

    // Handle request errors
    if (error?.request) {
      if (error.code === "ECONNABORTED" || error?.request?._response === "timeout") {
        return {
          success: false,
          message: "Request timed out. Please try again.",
        };
      }

      if (error?.status === 0) {
        return {
          success: false,
          message: "Unable to connect to the server. Please try again.",
        };
      }

      if (error?.message?.includes("Failed to connect")) {
        return {
          success: false,
          message: "Failed to connect to the server. Please try again.",
        };
      }

      if (error?.message?.includes("Network Error")) {
        return {
          success: false,
          message: "Network error. Please check your connection and try again.",
        };
      }

      if (error?.message?.includes("Network request failed")) {
        return {
          success: false,
          message: "Network request failed. Please try again.",
        };
      }

      return {
        success: false,
        message: "No response from the server. Please try again.",
      };
    }

    // Handle general errors
    return {
      success: false,
      message: error?.message || "An unexpected error occurred. Please try again.",
    };
  }
);

export default axiosInstance;
