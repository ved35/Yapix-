// import { isAndroid, SCREEN_WIDTH } from '@/constants/device'
// import { FONTS } from '@/constants/theme'
// import { useTheme } from '@/context/ThemeContext'
// import React, { memo, Ref } from 'react'
// import { StyleSheet, Text, TextInput, View } from 'react-native'

// interface ChatInputProps {
//     message: string;
//     isLoading: boolean;
//     inputRef: Ref<TextInput>;
//     replyMessage: string;
//     pickAttachment: () => void;
//     setReplyMessage: React.Dispatch<React.SetStateAction<ReplyMessage>>;
//     setMessage: (message: string) => void;
//     sendMessage: (message: string) => void;
// }

// const ChatInput = ({
//     message,
//     inputRef,
//     setMessage,
//     sendMessage,
//     replyMessage,
//     pickAttachment,
//     setReplyMessage,
//     isLoading = false
// }: ChatInputProps) => {
//   return (
//     <View>
//       <Text>ChatInput</Text>
//     </View>
//   )
// }

// export default memo(ChatInput)

// const Style = () => {

//     const {colors} = useTheme();

//     return StyleSheet.create({
//         container: {
//             paddingVertical: 15,
//             alignItems: 'center',
//             paddingHorizontal: 10,
//             justifyContent: 'center',
//             paddingBottom: isAndroid ? 5 : 30,
//             backgroundColor: colors.background
//         },
//         main: {
//             width: '100%',
//             minHeight:55,
//             maxHeight:150,
//             borderWidth:1,
//             borderRadius:7,
//             alignItems:'center',
//             flexDirection: 'row',
//             borderColor: colors.border,
//             justifyContent: 'space-between'
//         },
//         bottomView: {
//             marginRight: 10,
//             alignItems: 'center',
//             flexDirection: 'row',
//             justifyContent:'center'
//         },
//         messageIconView: {
//             width: 40,
//             height: 40,
//             alignItems: "center",
//             justifyContent: "center"
//         },
//         messageIcon: {
//             width: 22,
//             height: 22
//         },
//         textInputView: {
//             left: -2,
//             width: '65%',
//             bottom: isAndroid?0:3,
//         },
//         textInput:{
//             fontFamily: FONTS.medium,
//             fontSize: 16,
//             color: colors.text,
//         },
//         sendBTN: {
//             width: 43,
//             height: 44,
//             borderRadius: 7,
//             alignItems: 'center',
//             justifyContent: 'center',
//             backgroundColor: colors.background,
//         },
//         replyMessageContainer: {
//             left: 0,
//             right: 0,
//             zIndex: 999,
//             borderWidth: 1,
//             borderRadius: 4,
//              alignItems: "center",
//             position: 'absolute',
//             flexDirection: 'row',
//             bottom: SCREEN_WIDTH * 0.07,
//             borderColor: colors.border,
//             backgroundColor: colors.background
//         },
//         nameText: {
//             fontSize: 13,
//             color: colors.primary,
//             fontFamily:FONTS.medium
//         },
//         messageText: {
//             fontSize: 13,
//             marginTop: 5,
//             color: colors.text,
//             fontFamily: FONTS.semiBold,
//         },
//         replyImage: {
//             width: 40,
//             height: 40,
//             marginRight: 10,
//             borderRadius: 5
//         },
//         nameClose: {
//             width: '100%',
//             alignItems: 'center',
//             flexDirection: 'row'
//         },
//         closeIcon: {
//             width: 13,
//             height: 13
//         }
//     });
// }
