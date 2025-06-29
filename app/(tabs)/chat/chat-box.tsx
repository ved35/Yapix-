import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import CustomImageLoadder from "@/components/CustomImageLoadder";
import CustomText from "@/components/CustomText";
import { FONTS } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import useAuthStore from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import Animated, {
  FadeIn,
  runOnJS,
  useAnimatedScrollHandler
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface PageManagement {
  limit: number;
  currentPage: number;
}

interface LoadingState {
  isLoadingTop: boolean;
  isLoadingBottom: boolean;
  isSendMessageLoading: boolean;
  isChatListLoading: boolean;
}

interface ReplyMessage {
  id: string;
  sender: string;
  message: string;
  image: {
    uri: string;
    name: string;
    type: string;
  };
}

const CHAT_LIMIT = 30;

const ChatBox = () => {
  const param: any = useLocalSearchParams();

  const { colors } = useTheme();
  const styles = Style();
  const { t } = useTranslation();
  const isFocused = useIsFocused();

  const user = useAuthStore((state) => state.user);

  const status = true;

  const message: any = [
    {
      id: "msg_31",
      message: "This is a reply to the image above!",
      createdAt: "2024-01-16T18:08:00.000Z",
      userId: {
        id: user?.id || "current_user",
        fullName: "You"
      },
      attachment: null,
      messageId: {
        id: "msg_30",
        message: "It's a homemade pasta with fresh vegetables and herbs. I'll share the recipe with you!",
        attachment: {
          url: "/uploads/dinner.jpg",
          type: "image/jpeg",
          filename: "homemade_dinner.jpg"
        }
      },
      is_read: 0
    },
    {
      id: "msg_30",
      message: "It's a homemade pasta with fresh vegetables and herbs. I'll share the recipe with you!",
      createdAt: "2024-01-16T18:05:00.000Z",
      userId: {
        id: param.id,
        fullName: param.name
      },
      attachment: {
        url: "/uploads/dinner.jpg",
        type: "image/jpeg",
        filename: "homemade_dinner.jpg"
      },
      messageId: null,
      is_read: 0
    },
    {
      id: "msg_29",
      message: "That looks delicious! What is it?",
      createdAt: "2024-01-16T18:02:00.000Z",
      userId: {
        id: user?.id || "current_user",
        fullName: "You"
      },
      attachment: null,
      messageId: {
        id: "msg_28",
        message: "Look what I just made for dinner!",
        attachment: {
          url: "/uploads/dinner.jpg",
          type: "image/jpeg",
          filename: "homemade_dinner.jpg"
        }
      },
      is_read: 0
    },
    {
      id: "msg_28",
      message: "Look what I just made for dinner!",
      createdAt: "2024-01-16T18:00:00.000Z",
      userId: {
        id: param.id,
        fullName: param.name
      },
      attachment: {
        url: "/uploads/dinner.jpg",
        type: "image/jpeg",
        filename: "homemade_dinner.jpg"
      },
      messageId: null,
      is_read: 0
    },
    {
      id: "msg_27b",
      message: "Wow, that's amazing! Can you share the recipe?",
      createdAt: "2024-01-16T15:30:00.000Z",
      userId: {
        id: param.id,
        fullName: param.name
      },
      attachment: null,
      messageId: {
        id: "msg_27a",
        message: "Check out this beautiful sunset I captured!",
        attachment: {
          url: "/uploads/sunset_beach.jpg",
          type: "image/jpeg",
          filename: "sunset_beach.jpg"
        }
      },
      is_read: 0
    },
    {
      id: "msg_27a",
      message: "Check out this beautiful sunset I captured!",
      createdAt: "2024-01-16T15:00:00.000Z",
      userId: {
        id: user?.id || "current_user",
        fullName: "You"
      },
      attachment: {
        url: "/uploads/sunset_beach.jpg",
        type: "image/jpeg",
        filename: "sunset_beach.jpg"
      },
      messageId: null,
      is_read: 0
    },
    {
      id: "msg_26b",
      message: "Here's my version!",
      createdAt: "2024-01-16T14:10:00.000Z",
      userId: {
        id: user?.id || "current_user",
        fullName: "You"
      },
      attachment: {
        url: "/uploads/my_presentation.pptx",
        type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        filename: "my_presentation.pptx"
      },
      messageId: {
        id: "msg_25",
        message: "I've attached the presentation slides",
        attachment: {
          url: "/uploads/presentation.pptx",
          type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          filename: "project_presentation.pptx"
        }
      },
      is_read: 1
    },
    {
      id: "msg_26",
      message: "Thanks! I'll review them and get back to you",
      createdAt: "2024-01-16T14:05:00.000Z",
      userId: {
        id: user?.id || "current_user",
        fullName: "You"
      },
      attachment: null,
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_25",
      message: "I've attached the presentation slides",
      createdAt: "2024-01-16T14:00:00.000Z",
      userId: {
        id: param.id,
        fullName: param.name
      },
      attachment: {
        url: "/uploads/presentation.pptx",
        type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        filename: "project_presentation.pptx"
      },
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_24",
      message: "Perfect! I'll listen to it right away",
      createdAt: "2024-01-16T11:32:00.000Z",
      userId: {
        id: param.id,
        fullName: param.name
      },
      attachment: null,
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_23",
      message: "Here's the audio recording you asked for",
      createdAt: "2024-01-16T11:30:00.000Z",
      userId: {
        id: user?.id || "current_user",
        fullName: "You"
      },
      attachment: {
        url: "/uploads/meeting_audio.mp3",
        type: "audio/mpeg",
        filename: "meeting_recording.mp3"
      },
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_22",
      message: "Haha, that's hilarious! 😂",
      createdAt: "2024-01-16T10:02:00.000Z",
      userId: {
        id: user?.id || "current_user",
        fullName: "You"
      },
      attachment: null,
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_21",
      message: "Check out this funny video I found!",
      createdAt: "2024-01-16T10:00:00.000Z",
      userId: {
        id: param.id,
        fullName: param.name
      },
      attachment: {
        url: "/uploads/funny_video.mp4",
        type: "video/mp4",
        filename: "funny_moment.mp4"
      },
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_20",
      message: "Pretty good! Ready for the day ahead",
      createdAt: "2024-01-16T08:07:00.000Z",
      userId: {
        id: param.id,
        fullName: param.name
      },
      attachment: null,
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_19",
      message: "Morning! Yes, slept really well. How about you?",
      createdAt: "2024-01-16T08:05:00.000Z",
      userId: {
        id: user?.id || "current_user",
        fullName: "You"
      },
      attachment: null,
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_18",
      message: "Good morning! Did you have a good night's sleep?",
      createdAt: "2024-01-16T08:00:00.000Z",
      userId: {
        id: param.id,
        fullName: param.name
      },
      attachment: null,
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_17",
      message: "I can see why! The atmosphere must be incredible",
      createdAt: "2024-01-15T10:35:00.000Z",
      userId: {
        id: param.id,
        fullName: param.name
      },
      attachment: null,
      messageId: {
        id: "msg_12",
        message: "Here's another photo from the same evening",
        attachment: {
          url: "/uploads/beach_waves.jpg",
          type: "image/jpeg",
          filename: "beach_waves.jpg"
        }
      },
      is_read: 1
    },
    {
      id: "msg_16",
      message: "I could stay there for hours",
      createdAt: "2024-01-15T10:34:00.000Z",
      userId: {
        id: user?.id || "current_user",
        fullName: "You"
      },
      attachment: null,
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_15",
      message: "It's so relaxing",
      createdAt: "2024-01-15T10:33:30.000Z",
      userId: {
        id: user?.id || "current_user",
        fullName: "You"
      },
      attachment: null,
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_14",
      message: "Exactly!",
      createdAt: "2024-01-15T10:33:00.000Z",
      userId: {
        id: user?.id || "current_user",
        fullName: "You"
      },
      attachment: null,
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_13",
      message: "The waves look so peaceful! I can almost hear the ocean",
      createdAt: "2024-01-15T10:32:00.000Z",
      userId: {
        id: param.id,
        fullName: param.name
      },
      attachment: null,
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_12",
      message: "Here's another photo from the same evening",
      createdAt: "2024-01-15T10:30:00.000Z",
      userId: {
        id: user?.id || "current_user",
        fullName: "You"
      },
      attachment: {
        url: "/uploads/beach_waves.jpg",
        type: "image/jpeg",
        filename: "beach_waves.jpg"
      },
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_11",
      message: "That sounds perfect! I'll plan a trip there next weekend. Thanks for the detailed info!",
      createdAt: "2024-01-15T10:28:00.000Z",
      userId: {
        id: param.id,
        fullName: param.name
      },
      attachment: null,
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_10",
      message: "You should definitely come! It's about 30 minutes from the city center. There's a nice walking trail along the coast, and there are several good restaurants nearby. The best time to visit is around 6-7 PM when the sun is setting. The whole area gets this golden glow that's just magical. Plus, there's usually a nice breeze from the ocean.",
      createdAt: "2024-01-15T10:25:00.000Z",
      userId: {
        id: user?.id || "current_user",
        fullName: "You"
      },
      attachment: null,
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_9",
      message: "I need to visit that place sometime. The colors are amazing!",
      createdAt: "2024-01-15T10:22:00.000Z",
      userId: {
        id: param.id,
        fullName: param.name
      },
      attachment: null,
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_8",
      message: "At the beach near my house. The sunset was incredible!",
      createdAt: "2024-01-15T10:20:00.000Z",
      userId: {
        id: user?.id || "current_user",
        fullName: "You"
      },
      attachment: null,
      messageId: {
        id: "msg_6",
        message: "Check out this cool photo I took yesterday!",
        attachment: {
          url: "/uploads/sunset.jpg",
          type: "image/jpeg",
          filename: "sunset_photo.jpg"
        }
      },
      is_read: 1
    },
    {
      id: "msg_7",
      message: "Wow, that's absolutely beautiful! Where did you take this?",
      createdAt: "2024-01-15T10:17:00.000Z",
      userId: {
        id: param.id,
        fullName: param.name
      },
      attachment: null,
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_6",
      message: "Check out this cool photo I took yesterday!",
      createdAt: "2024-01-15T10:15:00.000Z",
      userId: {
        id: user?.id || "current_user",
        fullName: "You"
      },
      attachment: {
        url: "/uploads/sunset.jpg",
        type: "image/jpeg",
        filename: "sunset_photo.jpg"
      },
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_5",
      message: "Sure, I'll take a look at it. Give me a few minutes",
      createdAt: "2024-01-15T09:38:00.000Z",
      userId: {
        id: user?.id || "current_user",
        fullName: "You"
      },
      attachment: null,
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_4",
      message: "Here's the document I was talking about",
      createdAt: "2024-01-15T09:36:00.000Z",
      userId: {
        id: param.id,
        fullName: param.name
      },
      attachment: {
        url: "/uploads/document.pdf",
        type: "application/pdf",
        filename: "project_document.pdf"
      },
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_3",
      message: "Pretty good! Just working on some project deadlines. Can you help me review this document?",
      createdAt: "2024-01-15T09:35:00.000Z",
      userId: {
        id: param.id,
        fullName: param.name
      },
      attachment: null,
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_2",
      message: "I'm doing great! Just finished my morning workout. How about you?",
      createdAt: "2024-01-15T09:32:00.000Z",
      userId: {
        id: user?.id || "current_user",
        fullName: "You"
      },
      attachment: null,
      messageId: null,
      is_read: 1
    },
    {
      id: "msg_1",
      message: "Hey! How are you doing today?",
      createdAt: "2024-01-15T09:30:00.000Z",
      userId: {
        id: param.id,
        fullName: param.name
      },
      attachment: null,
      messageId: null,
      is_read: 1
    }
  ];
  

  const [scrollTodownEnable, setScrollTodownEnable] = useState(false);
  const [manageGetMessage, setManageGetMessage] = useState<PageManagement>({
    currentPage: 1,
    limit: CHAT_LIMIT,
  });
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isChatListLoading: false,
    isLoadingBottom: false,
    isLoadingTop: false,
    isSendMessageLoading: false,
  });
  const [replyMessage, setReplyMessage] = useState<ReplyMessage>({
    id: "",
    sender: "",
    message: "",
    image: {
      uri: "",
      name: "",
      type: "",
    },
  });
  const [isFriend, setIsFriend] = useState(false);
  const [isKeyBoardOpen, setIsKeyBoardOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const inputRef = useRef<TextInput>(null);
  const chatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyBoardOpen(true);
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyBoardOpen(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    // connect();
    // getFriend();

    handleFriend();

    setTimeout(() => {
      setLoadingState((prev) => ({ ...prev, isChatListLoading: false }));
    });
  }, [isFocused]);

  const handleFriend = async () => {
    try {
      // const response = await getFrienfList(null);
      // if(response?.success){
      //   const isFriend = response?.data?.some(
      //     (friend: any) => friend?.follow_byid?.id === userId
      //   );
      //   setIsFriend(isFriend);
      // }
    } catch (error) {}
  };

  const onScroll = useAnimatedScrollHandler((event) => {
    const { y } = event.contentOffset;

    if (y > 100) {
      if (!scrollTodownEnable) {
        runOnJS(setScrollTodownEnable)(true);
      }
    } else {
      runOnJS(setScrollTodownEnable)(false);
    }
  });

  const keyExtractor = useCallback(
    (item: any, index: number) => `${item?.id?.toString()} - ${index.toString()}`,
    []
  );

  const renderMessageList = ({ item, index }: { item: any; index: number }) => {
    const isUser = item?.userId?.id === user?.id;

    const currentDate = new Date(item?.createdAt);
    const nextMessage = message[index + 1];
    const nextDate = nextMessage ? new Date(nextMessage?.createdAt) : null;

    const isDateSame =
      (nextDate && currentDate.toDateString() === nextDate.toDateString()) || false;

    const currentHourAndMinute = `${currentDate.getHours()}:${currentDate.getMinutes().toString().padStart(2, "0")}`;

    const prevMessage = message[index - 1];
    const prevHourAndMinute = prevMessage 
      ? `${new Date(prevMessage?.createdAt).getHours()}:${new Date(prevMessage?.createdAt).getMinutes().toString().padStart(2, "0")}`
      : null;

    const isUserSame = prevMessage && 
      message[index]?.userId?.id === prevMessage?.userId?.id &&
      currentHourAndMinute === prevHourAndMinute;

    const handleReplyPress = (id: number) => {
      const index = message.findIndex((i: any) => i?.id === id);

      if (index === -1) {
        chatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
      } else {
        if (chatListRef?.current) {
          chatListRef?.current?.scrollToIndex({
            index: index,
            animated: true,
            viewPosition: 0,
          });
        }
      }
    };
    return (
      <>
        <ChatBubble
          chat={item}
          index={index}
          isUser={isUser}
          isUserSame={isUserSame}
          inputRef={inputRef}
          isDateSame={isDateSame}
          setReplyMessage={setReplyMessage}
          onReplyMessagePress={handleReplyPress}
        />
        {!isDateSame && (
          <View style={styles.dateView}>
            <CustomText selectable style={styles.date}>
              {item?.createdAt?.split("T")[0].toString()}
            </CustomText>
          </View>
        )}
      </>
    );
  };

  const onBottomReached = useCallback(async () => {
    try {
      // setManageGetMessage((prev)=>{
      //   const newPage = prev.currentPage + 1;
      //   fetchMessage?.(newPage)
      //   setLoadingState((prevState)=>({
      //     ...prevState,
      //     isLoadingBottom: false
      //   }));
      //   return {
      //     ...prev,
      //     currentPage: newPage
      //   }
      // })
    } catch (error: any) {
      showMessage({ message: error?.message?.toString(), type: "danger" });
      setLoadingState((prevState) => ({
        ...prevState,
        isLoadingBottom: false,
      }));
    }
  }, [loadingState.isLoadingBottom, manageGetMessage.currentPage]);

  const handleSendMessage = (message: string) => {
    try {
      if (!isFriend) {
        showMessage({ message: "warning", type: "danger", description: "you are not a friend" });
      } else {
        setLoadingState((prev) => ({ ...prev, isSendMessageLoading: true }));
        if (message?.trim() !== "") {
          //   if(replyMessage.id){
          //     socketRef.current?.emit("message", {
          //       token,
          //       userid: UserId,
          //       message: message,
          //       messageId: replyMessage.id;
          //     })
          //   } else {
          //     socketRef?.current?.emit("message", {
          //       token,
          //       userid: userId,
          //       message: message
          //     })
          //   }
          // }

          setNewMessage("");
          setReplyMessage({
            id: "",
            sender: "",
            message: "",
            image: {
              uri: "",
              type: "",
              name: "",
            },
          });
        } else {
          showMessage({
            type: "warning",
            message: "warning",
            description: "You can't send message",
          });
        }
      }
    } catch (error: any) {
      showMessage({ type: "danger", message: error?.message?.toString() });
    } finally {
      setLoadingState((prev) => ({
        ...prev,
        isSendMessageLoading: false,
      }));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1, alignSelf: "center", backgroundColor: colors.background }}
        behavior="padding"
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginVertical: 20,
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Pressable onPress={() => router.canGoBack() && router.back()}>
              <Ionicons  name="chevron-back" size={25} color={colors.text} />
            </Pressable>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <CustomImageLoadder
                source={{ uri: param.avatar }}
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 45,
                }}
                resizeMode="contain"
              />
            </View>
            <View>
              <CustomText
                style={{
                  fontFamily: FONTS.bold,
                  fontSize: 18,
                  color: colors.text,
                }}
              >
                {param.name}
              </CustomText>
              <CustomText
                style={{
                  fontFamily: FONTS.regular,
                  color: colors.gray,
                  fontSize: 14,
                }}
              >
                {status ? "Online" : "Offline"}
              </CustomText>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
            }}
          >
            <Pressable>
              <Ionicons name="videocam" color={colors.primary} size={25} />
            </Pressable>
            <Pressable>
              <Ionicons name="videocam" color={colors.primary} size={25} />
            </Pressable>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.lightGray,
          }}
        >
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <Animated.FlatList
              data={message}
              ref={chatListRef}
              onScroll={onScroll}
              style={{ marginVertical: 4 }}
              keyExtractor={keyExtractor}
              renderItem={renderMessageList}
              onEndReached={onBottomReached}
              bounces={false}
              inverted={true}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ 
                flexGrow: 1,
                paddingBottom: 20
              }}
              ListFooterComponent={
                loadingState.isLoadingBottom ? (
                  <ActivityIndicator
                    size={"small"}
                    color={colors.primary}
                    style={{ marginVertical: 10 }}
                  />
                ) : null
              }
              ListEmptyComponent={
                message?.length === 0 && !loadingState.isChatListLoading ? (
                  <Animated.View style={styles.emptyListView} entering={FadeIn}>
                    <CustomText style={styles.emptyListText}>Start the Conversation</CustomText>
                  </Animated.View>
                ) : null
              }
            />
            {scrollTodownEnable && (
              <Pressable
                hitSlop={15}
                style={[styles.downView, { bottom: Keyboard.isVisible() ? "30%" : "17%" }]}
                onPress={() => {
                  if (chatListRef?.current) {
                    chatListRef.current?.scrollToOffset({
                      offset: -1,
                      animated: true,
                    });
                  }
                }}
              >
                <Ionicons name="chevron-down" size={15} color={colors.white} />
              </Pressable>
            )}
          </View>
            <ChatInput
              inputRef={inputRef}
              message={newMessage}
              setMessage={setNewMessage}
              replyMessage={replyMessage}
              setReplyMessage={setReplyMessage}
              sendMessage={handleSendMessage}
              isLoading={loadingState.isSendMessageLoading}
            />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatBox;

const Style = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    darkBackImage: {
      tintColor: colors.white,
    },
    emptyListView: {
      flex: 1,
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    emptyListText: {
      width: "90%",
      fontSize: 14,
      textAlign: "center",
      color: colors.text,
      fontFamily: FONTS.medium,
    },
    dateView: {
      height: 2,
      width: "100%",
      marginVertical: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.border,
    },
    date: {
      fontSize: 14,
      color: colors.gray,
      textAlign: "center",
      paddingVertical: 10,
      position: "absolute",
      paddingHorizontal: 15,
      fontFamily: FONTS.semiBold,
      backgroundColor: colors.background,
    },
    downView: {
      right: 0,
      width: 55,
      height: 44,
      zIndex: 999,
      position: 'absolute',
      alignItems: "center",
      justifyContent: "center",
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      backgroundColor: colors.gray,
    },
    arrow: {
      width: 15,
      height: 15,
      tintColor: colors.white,
    },
  });
};
