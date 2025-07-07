import { friendApiServices } from "@/services/friendApi/api";
import { useQuery } from "@tanstack/react-query";

export const useFriendSearchQuery = (searchTerm: string) => {
  return useQuery({
    queryKey: ["friendSearch", searchTerm],
    queryFn: () => friendApiServices.friendSearch(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useFriendRequestListQuery = () => {
  return useQuery({
    queryKey: ["friendRequestList"],
    queryFn: () => friendApiServices.friendRequestList(),
  });
};
