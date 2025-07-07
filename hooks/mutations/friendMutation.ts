import { friendApiServices } from "@/services/friendApi/api";
import { useMutation } from "@tanstack/react-query";

export const useSendFriendRequestMutation = () => {
  return useMutation({
    mutationFn: (receiver_id: string) => friendApiServices.sendFriendRequest(receiver_id),
    onSuccess: (data) => {
      // Optionally show a success message or refetch friend search/friend request list
      console.log("Friend request sent", data);
    },
    onError: (error) => {
      // Optionally show an error message
      console.error("Send friend request error:", error);
    },
  });
};

export const useFriendRespondToRequestMutation = () => {
  return useMutation({
    mutationFn: ({ request_id, status }: { request_id: string; status: string }) =>
      friendApiServices.friendRespondToRequest(request_id, status),
    onSuccess: (data) => {
      // Optionally show a success message or refetch friend request list
      console.log("Friend request response sent", data);
    },
    onError: (error) => {
      // Optionally show an error message
      console.error("Friend request response error:", error);
    },
  });
};
