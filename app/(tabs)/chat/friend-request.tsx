import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import CustomSearchBar from "@/components/CustomSearchBar";
import CustomText from "@/components/CustomText";
import { FONTS } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useFriendRespondToRequestMutation, useSendFriendRequestMutation } from "@/hooks/mutations/friendMutation";
import { useFriendRequestListQuery, useFriendSearchQuery } from "@/hooks/query/friend/useFriendSearchQuery";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Mock data for demonstration
const mockFriends = [
  { id: "1", name: "John Doe", avatar: "https://via.placeholder.com/50", status: "online" },
  { id: "2", name: "Jane Smith", avatar: "https://via.placeholder.com/50", status: "offline" },
  { id: "3", name: "Mike Johnson", avatar: "https://via.placeholder.com/50", status: "online" },
  { id: "4", name: "Sarah Wilson", avatar: "https://via.placeholder.com/50", status: "offline" },
];

const mockFriendRequests = [
  { id: "1", name: "Alex Brown", avatar: "https://via.placeholder.com/50", mutualFriends: 3 },
  { id: "2", name: "Emma Davis", avatar: "https://via.placeholder.com/50", mutualFriends: 5 },
  { id: "3", name: "Chris Lee", avatar: "https://via.placeholder.com/50", mutualFriends: 2 },
];

// Add debounce utility (simple inline debounce)
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const FriendRequest = () => {
  const { colors } = useTheme();
  const styles = Style();
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();

  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(friendSearchQuery, 400);
  const { data, isLoading } = useFriendSearchQuery(debouncedSearch);
  const { data: friendRequestsData, isLoading: isFriendRequestsLoading } = useFriendRequestListQuery();
  const sendFriendRequestMutation = useSendFriendRequestMutation();
  const friendRespondToRequestMutation = useFriendRespondToRequestMutation();

  const handleAddFriend = (friendId: string) => {
    sendFriendRequestMutation.mutate(friendId);
  };

  const handleAcceptRequest = (requestId: string) => {
    friendRespondToRequestMutation.mutate({ request_id: requestId, status: "accepted" });
  };

  const handleRejectRequest = (requestId: string) => {
    friendRespondToRequestMutation.mutate({ request_id: requestId, status: "rejected" });
  };

  // Replace mockFriends with API data
  const friends = useMemo(() => {
    if (!data?.data?.user?.results) return [];
    return data.data.user.results;
  }, [data]);

  // Replace mockFriendRequests with API data
  const friendRequests = useMemo(() => {
    if (!friendRequestsData?.data) return [];
    return friendRequestsData.data;
  }, [friendRequestsData]);

  const renderFriendItem = ({ item }: { item: any }) => (
    <View style={styles.friendItem}>
      <View style={styles.friendInfo}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.profile_picture || "https://via.placeholder.com/50" }} style={styles.avatar} />
          {/* No status from API, so omit status indicator or set default */}
        </View>
        <View style={styles.friendDetails}>
          <CustomText style={styles.friendName}>{item.name || item.username}</CustomText>
          <CustomText style={styles.friendStatus}>{item.username}</CustomText>
        </View>
      </View>
      <CustomButton
        text={"Add Friend"}
        onPress={() => handleAddFriend(item.id)}
        variant="filled"
        style={styles.addButton}
        loading={sendFriendRequestMutation.isPending}
        disabled={sendFriendRequestMutation.isPending}
      />
    </View>
  );

  const renderRequestItem = ({ item }: { item: any }) => (
    <View style={styles.requestItem}>
      <View style={styles.requestInfo}>
        <Image source={{ uri: item.profile_picture || "https://via.placeholder.com/50" }} style={styles.requestAvatar} />
        <View style={styles.requestDetails}>
          <CustomText style={styles.requestName}>{item.name || item.username}</CustomText>
          {/* You can add more info here if needed */}
        </View>
      </View>
      <View style={styles.requestActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => handleAcceptRequest(item.id)}
          disabled={friendRespondToRequestMutation.isPending}
        >
          <Ionicons name="checkmark" size={20} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={() => handleRejectRequest(item.id)}
          disabled={friendRespondToRequestMutation.isPending}
        >
          <Ionicons name="close" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={{ width: "90%", alignSelf: "center" }}>
        <CustomHeader title="Friend Request" />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Friends Section */}
        <View style={styles.section}>
          <CustomSearchBar
            value={friendSearchQuery}
            onChangeText={setFriendSearchQuery}
            placeholder="Search for friends..."
            containerStyle={styles.searchBar}
          />

          <View style={styles.friendsList}>
            {friendSearchQuery.trim() === "" ? (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={64} color={colors.textSecondary} />
                <CustomText style={styles.emptyTitle}>Search for Friends</CustomText>
                <CustomText style={styles.emptySubtitle}>
                  Enter a name to search for friends and add them
                </CustomText>
              </View>
            ) : isLoading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size={'large'} color={colors.black} />
              </View>
            ) : friends.length > 0 ? (
              <FlatList
                data={friends}
                renderItem={renderFriendItem}
                keyExtractor={(item) => item.id?.toString() || item.username}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="person-remove-outline" size={64} color={colors.textSecondary} />
                <CustomText style={styles.emptyTitle}>No Users Found</CustomText>
                <CustomText style={styles.emptySubtitle}>
                  No users found matching "{friendSearchQuery}"
                </CustomText>
              </View>
            )}
          </View>
        </View>

        {/* Friend Requests Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CustomText style={styles.sectionTitle}>Friend Requests</CustomText>
            <CustomText style={styles.requestCount}>{friendRequests.length}</CustomText>
          </View>

          <View style={styles.requestsList}>
            {isFriendRequestsLoading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size={'large'} color={colors.black} />
              </View>
            ) : friendRequests.length > 0 ? (
              <FlatList
                data={friendRequests}
                renderItem={renderRequestItem}
                keyExtractor={(item) => item.id?.toString() || item.username}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={64} color={colors.textSecondary} />
                <CustomText style={styles.emptyTitle}>No Friend Requests</CustomText>
                <CustomText style={styles.emptySubtitle}>
                  When someone sends you a friend request, it will appear here
                </CustomText>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default FriendRequest;

const Style = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
          headerTitle: {
        fontSize: 24,
        fontFamily: FONTS.bold,
        color: colors.text,
      },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    section: {
      marginTop: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
          sectionTitle: {
        fontSize: 20,
        fontFamily: FONTS.semiBold,
        color: colors.text,
      },
          requestCount: {
        fontSize: 16,
        fontFamily: FONTS.medium,
        color: colors.primary,
        backgroundColor: colors.primary + "20",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
      },
    searchBar: {
      marginBottom: 16,
    },
    friendsList: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      paddingHorizontal: 16,
    },
    friendItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    friendInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    avatarContainer: {
      position: "relative",
      marginRight: 12,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
    },
    statusIndicator: {
      position: "absolute",
      bottom: 2,
      right: 2,
      width: 12,
      height: 12,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.background,
    },
    friendDetails: {
      flex: 1,
    },
          friendName: {
        fontSize: 16,
        fontFamily: FONTS.medium,
        color: colors.text,
        marginBottom: 2,
      },
          friendStatus: {
        fontSize: 14,
        fontFamily: FONTS.regular,
        color: colors.textSecondary,
      },
    addButton: {
      height: 36,
      paddingHorizontal: 16,
      borderRadius: 18,
    },
    requestsList: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      paddingHorizontal: 16,
    },
    requestItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    requestInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    requestAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 12,
    },
    requestDetails: {
      flex: 1,
    },
    requestName: {
      fontSize: 16,
      fontFamily: FONTS.medium,
      color: colors.text,
      marginBottom: 2,
    },
    requestActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1.5,
    },
    acceptButton: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    rejectButton: {
      backgroundColor: "transparent",
      borderColor: colors.error,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 40,
    },
          emptyTitle: {
        fontSize: 18,
        fontFamily: FONTS.semiBold,
        color: colors.text,
        marginTop: 16,
        marginBottom: 8,
      },
          emptySubtitle: {
        fontSize: 14,
        fontFamily: FONTS.regular,
        color: colors.textSecondary,
        textAlign: "center",
        paddingHorizontal: 20,
        lineHeight: 20,
      },
  });
};
