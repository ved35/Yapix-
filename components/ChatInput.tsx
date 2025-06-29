import { Icons } from "@/assets/assets";
import { apiConfig } from "@/config/apiConfig";
import { isAndroid, SCREEN_WIDTH } from "@/constants/device";
import { FONTS } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { memo, Ref } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View
} from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
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

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  inputRef: Ref<TextInput>;
  replyMessage: ReplyMessage;
  // pickAttachment: () => void;
  setReplyMessage: React.Dispatch<React.SetStateAction<ReplyMessage>>;
  setMessage: (message: string) => void;
  sendMessage: (message: string) => void;
}

const ChatInput = ({
  message,
  inputRef,
  setMessage,
  sendMessage,
  replyMessage,
  // pickAttachment,
  setReplyMessage,
  isLoading = false,
}: ChatInputProps) => {
  const styles = Style();
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        {(replyMessage.message || replyMessage?.image?.uri) && (
          <Animated.View
            entering={FadeInDown}
            exiting={FadeOutDown}
            style={[styles.replyMessageContainer, { padding: replyMessage.image.uri ? 10 : 15 }]}
          >
            <View style={styles.nameClose}>
              {replyMessage?.image?.uri && (
                <CustomImageLoadder
                  resizeMode="contain"
                  style={styles.replyImage}
                  source={{
                    uri: `${apiConfig.BASE_URL}${replyMessage.image.uri}`,
                  }}
                />
              )}

              <View
                style={[
                  // styles.header,
                  {
                    marginTop: 0,
                    width: replyMessage?.image?.uri ? "85%" : "100%",
                  },
                ]}
              >
                <View style={{ width: "90%" }}>
                  <CustomText numberOfLines={1} style={styles.nameText}>
                    {replyMessage.sender || "--"}
                  </CustomText>
                  <CustomText numberOfLines={1} style={styles.messageText}>
                    {replyMessage.message || "--"}
                  </CustomText>
                </View>

                <Pressable
                  hitSlop={10}
                  onPress={() => {
                    setReplyMessage({
                      id: "",
                      message: "",
                      sender: "",
                      image: {
                        uri: "",
                        type: "",
                        name: "",
                      },
                    });
                  }}
                >
                  <Image resizeMode="contain" source={Icons.block} style={styles.closeIcon} />
                </Pressable>
              </View>
            </View>
          </Animated.View>
        )}
        <View style={styles.textInputView}>
          <TextInput
            multiline
            ref={inputRef}
            value={message}
            style={styles.textInput}
            placeholder="Type Message..."
            placeholderTextColor={colors.gray}
            onChangeText={(text) => setMessage(text.trimStart())}
            returnKeyType="send"
            onSubmitEditing={() => {
              if (message.trim()) {
                sendMessage(message);
              }
            }}
          />
        </View>
        <View style={styles.bottomView}>
          {isLoading ? (
            <View>
              <ActivityIndicator size={"small"} color={colors.primary} />
            </View>
          ) : (
            <Pressable disabled={isLoading} onPress={() => setMessage(message)}>
              <Ionicons name="send-outline" color={colors.primary} style={styles.messageIcon} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(ChatInput);

const Style = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      paddingVertical: 15,
      alignItems: "center",
      paddingHorizontal: 10,
      justifyContent: "center",
      paddingBottom: isAndroid ? 5 : 30,
      backgroundColor: colors.background,
    },
    main: {
      width: "100%",
      minHeight: 55,
      maxHeight: 150,
      borderWidth: 1,
      borderRadius: 7,
      alignItems: "center",
      flexDirection: "row",
      borderColor: colors.border,
      justifyContent: "space-between",
    },
    bottomView: {
      marginRight: 10,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
    },
    messageIconView: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    messageIcon: {
      width: 22,
      height: 22,
    },
    textInputView: {
      left: -2,
      width: "65%",
      bottom: isAndroid ? 0 : 3,
    },
    textInput: {
      fontFamily: FONTS.medium,
      fontSize: 16,
      color: colors.text,
    },
    sendBTN: {
      width: 43,
      height: 44,
      borderRadius: 7,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },
    replyMessageContainer: {
      left: 0,
      right: 0,
      zIndex: 999,
      borderWidth: 1,
      borderRadius: 4,
      alignItems: "center",
      position: "absolute",
      flexDirection: "row",
      bottom: SCREEN_WIDTH * 0.07,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    nameText: {
      fontSize: 13,
      color: colors.primary,
      fontFamily: FONTS.medium,
    },
    messageText: {
      fontSize: 13,
      marginTop: 5,
      color: colors.text,
      fontFamily: FONTS.semiBold,
    },
    replyImage: {
      width: 40,
      height: 40,
      marginRight: 10,
      borderRadius: 5,
    },
    nameClose: {
      width: "100%",
      alignItems: "center",
      flexDirection: "row",
    },
    closeIcon: {
      width: 13,
      height: 13,
    },
  });
};
