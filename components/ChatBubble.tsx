import { apiConfig } from "@/config/apiConfig";
import { FONTS } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { memo, Ref, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle
} from "react-native";
import { HandlerStateChangeEvent, Swipeable } from "react-native-gesture-handler";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import ChatImagePreview from "./ChatImagePreview";
import CustomImageLoadder from "./CustomImageLoadder";
import CustomText from "./CustomText";

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

interface ChatBubbleProps {
  index: number;
  isUser: boolean;
  chat: {
    message: string;
    timestamp: string;
    attachment: {
      url: string;
      type: string;
      filename?: string;
    };
    is_read?: bigint;
  };
  isUserSame: boolean;
  isDateSame: boolean;
  inputRef: Ref<TextInput>;
  onReplyMessagePress: (id: string) => void;
  setReplyMessage: React.Dispatch<React.SetStateAction<ReplyMessage>>;
}

export const localTime = (date: Date) => {
  const utcDate = new Date(date);

  return utcDate.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const ChatBubble = ({
  chat,
  index,
  isUser,
  inputRef,
  isUserSame,
  isDateSame,
  setReplyMessage,
  onReplyMessagePress,
}: ChatBubbleProps | any) => {
  const styles = Style();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [isVisiable, setIsVisiable] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const swipeableRef = useRef<Swipeable>(null);

  const isRead = useMemo(() => chat?.is_read, [chat]);
  const message = useMemo(() => chat?.message, [chat]);
  const attachment = useMemo(() => chat?.attachment, [chat]);

  const isAttachment = useMemo(() => attachment?.url && attachment.type, [attachment]);

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      padding: isAttachment ? 10 : 0,
      marginVertical: isDateSame ? 2 : 5,
      alignSelf: isUser ? "flex-end" : "flex-start",
      alignItems: isUser ? "flex-end" : "flex-start",
    };
    return baseStyle;
  };

  const getBubbleStyle = ():ViewStyle => ({
    ...styles.bubble,
    padding: 12,
    marginHorizontal: 3,
    backgroundColor: isUser ? colors.primary : colors.background,
  });

  const getBubbleTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      ...styles.bubbleText,
      color: isUser ? colors.white : colors.black,
    };
    return baseTextStyle;
  };

  const renderLeftAction = () => (
    <Ionicons name="arrow-undo-outline" size={24} color={colors.gray} />
  );

  const handleSwipeEnd = (e: HandlerStateChangeEvent | any) => {
    if (e.nativeEvent?.translationX > 100) {
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

      const attachment = {
        uri: chat?.attachment?.url || "",
        type: chat?.attachment?.type || "",
        name: chat?.attachment?.filename || "",
      };

      if (swipeableRef.current) {
        if (inputRef?.current) {
          inputRef?.current?.focus();
        }
        setReplyMessage((prev: any) => ({
          ...prev,
          image: attachment,
          id: chat?.id || "",
          message: chat?.message || "",
          sender: chat?.userId?.fullName || "",
        }));
      }
    }
    swipeableRef.current?.close();
  };

  return (
    <>
      {
        isVisiable && (
          <ChatImagePreview
            url={selectedImage}
            isVisiable={isVisiable}
            setIsVisiable={setIsVisiable}
          />
        )
      }
      <Swipeable
        friction={2}
        ref={swipeableRef}
        onEnded={handleSwipeEnd}
        dragOffsetFromRightEdge={10}
        renderLeftActions={renderLeftAction}
      >
        <Animated.View
          exiting={FadeOut}
          entering={FadeInDown.springify().damping(80).stiffness(200)}
          style={[styles.container, getContainerStyle()]}
        >
          {chat?.messageId ? (
            <Pressable
              style={styles.replyContainer}
              onPress={() => onReplyMessagePress(chat?.messageId?.id)}
            >
              <View style={styles.lineView}>
                <CustomText style={styles.nameText}>
                  {isUser ? "You" : chat?.userId?.fullName}
                </CustomText>
                {chat?.messageId?.attachment ? (
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <CustomText numberOfLines={10} style={[styles.replyText, { marginBottom: 10 }]}>
                      {chat?.messageId?.message || "Image"}
                    </CustomText>
                    <CustomImageLoadder
                      resizeMode="contain"
                      style={styles.attachment}
                      source={{
                        uri: `${apiConfig.BASE_URL}${chat?.messageId?.attachment?.url}`,
                      }}
                    />
                  </View>
                ) : (
                  chat?.messageId?.message && (
                    <CustomText numberOfLines={10} style={[styles.replyText, { width: "100%" }]}>
                      {chat?.messageId?.message || "--"}
                    </CustomText>
                  )
                )}
              </View>
              {isAttachment && (
                <Pressable
                  onPress={()=>{
                    setIsVisiable(true);
                    setSelectedImage(attachment?.url)
                  }}
                  style={{ marginTop: 8 }}
                >
                  <CustomImageLoadder
                    resizeMode="contain"
                    style={styles.image}
                    source={{uri : `${apiConfig.BASE_URL}${attachment?.url}`}}
                  />
                </Pressable>
              )}
              {message?.trim() && (
                <CustomText style={[styles.messageText, { marginTop: isAttachment ? 8 : 8 }]} numberOfLines={10}>
                  {message.trim() || '--'}
                </CustomText>
              )}
            </Pressable>
          ) : (
            <>{
              isAttachment && <Animated.View>
                <Pressable
                  onPress={()=>{
                    setIsVisiable(true);
                    setSelectedImage(attachment?.url)
                  }}
                >
                  <CustomImageLoadder
                    resizeMode="contain"
                    style={styles.image}
                    source={{uri : `${apiConfig.BASE_URL}${attachment?.url}`}}
                  />
                </Pressable>
              </Animated.View>
              }
              {message?.trim() && (
                <Animated.View style={getBubbleStyle()}>
                  <CustomText selectable style={getBubbleTextStyle()}>
                    {message.trim() || '--'}
                  </CustomText>
                </Animated.View>
              )}
            </>
          )}
          <View style={styles.timeView}>
            <Animated.Text allowFontScaling={false} style={styles.timeText} >
              {localTime(chat?.createdAt) || '--'}
            </Animated.Text>
            {isUser && (
              (isRead || 1 == 1) ? <Ionicons name="checkmark-done" size={24} color={isRead ? colors.primary : colors.gray} /> : <Ionicons />
            )}
          </View>
        </Animated.View>
      </Swipeable>
    </>
  );
};

export default memo(ChatBubble);

const Style = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      width: "100%",
      position: "relative",
      minHeight: 20,
    },
    bubble: {
      maxWidth: "80%",
    },
    bubbleText: {
      fontSize: 14,
      fontFamily: FONTS.medium,
      lineHeight: 22,
    },
    link: {
      color: colors.primary,
      textDecorationLine: "underline",
    },
    timeView: {
      marginTop: 4,
      marginBottom: 15,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    timeText: {
      fontFamily: FONTS.regular,
      color: colors.gray,
      textAlign: "right",
      marginRight: 5,
      fontSize: 13,
    },
    tick: {
      width: 15,
      height: 15,
    },
    attachmentView: {
      width: "80%",
      height: 230,
      marginBottom: 4,
    },
    reply: {
      width: 16,
      height: 16,
    },
    replyContainer: {
      padding: 10,
      width: "70%",
      borderRadius: 10,
      backgroundColor: colors.background,
    },
    lineView: {
      borderRadius: 5,
      paddingVertical: 6,
      borderLeftWidth: 2,
      paddingHorizontal: 7,
      borderLeftColor: colors.primary,
      backgroundColor: colors.lightGray,
    },
    replyText: {
      width: "60%",
      flexGrow: 1,
      fontSize: 12,
      color: colors.black,
      fontFamily: FONTS.semiBold,
    },
    messageText: {
      fontSize: 14,
      marginBottom: 6,
      color: colors.black,
      fontFamily: FONTS.medium,
    },
    nameText: {
      fontFamily: FONTS.semiBold,
      color: colors.text,
      marginBottom: 3,
      fontSize: 11,
    },
    attachment: {
      width: 60,
      height: 60,
      borderRadius: 8,
    },
    image: {
      width: 200,
      height: 200,
      borderRadius: 10,
    },
  });
};
