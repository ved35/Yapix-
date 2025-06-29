import CustomImageLoadder from "@/components/CustomImageLoadder";
import CustomSearchBar from '@/components/CustomSearchBar';
import CustomText from "@/components/CustomText";
import { ROUTE } from "@/config/routes";
import { contact } from "@/constants/localData";
import { FONTS } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useSocket } from "@/hooks/useSocket";
import useAuthStore from "@/store/authStore";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StatusBar, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

export default function Chat() {
  const { colors } = useTheme();
  const styles = getStyles();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const user = useAuthStore(state => state.user)

  const {connect, socket } = useSocket({
    flag: "list", 
    userId: user?.id || "",
    manageGetMessagePage: { currentPage: 1 }
  });

  useEffect(()=>{
    if(socket){
      connect();
    }
  },[])

  const handleContactItem = (item: any) => {
    router.navigate({pathname: ROUTE["chat.chatBox"], params:item});
  };

  const reanderContactItem = ({ item }: any) => {
    return (
      <Pressable style={styles.contactItem} onPress={() => handleContactItem(item)}>
        <View style={styles.avatarContainer}>
          <CustomImageLoadder
            source={{ uri: item.avatar }}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>
        <View style={styles.contactInfo}>
          <View style={styles.contactHeader}>
            <CustomText style={styles.contactName}>{item.name}</CustomText>
            <CustomText style={styles.contactTime}>{item.time}</CustomText>
          </View>
          <View style={styles.contactHeader}>
            <CustomText style={styles.contactMessage}>{item.message}</CustomText>
            {item?.unreadCount && (
              <View style={styles.unreadCountContainer}>
                <CustomText style={styles.unreadCount}>{item.unreadCount.toString()}</CustomText>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  const keyExtractor = (item:any) => item.id.toString();

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
      <View style={{flex: 1, width: '90%', alignSelf: 'center'}}>
        <View style={{alignItems: 'center', alignSelf: 'center', width:'100%'}}>
          <CustomText style={styles.headerTitle}>Message</CustomText>

          <CustomSearchBar 
            value={search} 
            onChangeText={setSearch} 
            placeholder="Search contact" 
            containerStyle={{
              backgroundColor: colors.background,
              borderWidth: 1,
              borderColor: colors.border
            }}
          />

          <Animated.FlatList 
            data={contact}
            renderItem={reanderContactItem}
            keyExtractor={keyExtractor}
            style={styles.contactList}
            showsVerticalScrollIndicator={false}
            bounces={false}
            scrollEnabled
            ItemSeparatorComponent={()=><View style={styles.itemSeperator} />}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            initialNumToRender={10}
            updateCellsBatchingPeriod={100}
            windowSize={10}
            getItemLayout={(data, index)=> ({
              length: 74,
              offset: 74*index,
              index
            })}
            ListFooterComponent={()=><View style={styles.listFooter} />}
          />
        </View>
      </View>
    </View>
  );
}

const getStyles = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container:{
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.background
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: FONTS.bold,
      color: colors.text,
      marginVertical: 25,
    },
    itemSeperator: {
      width: "100%",
      height: 1,
      backgroundColor: colors.lightGray,
      marginVertical: 5,
    },
    listFooter: {
      height: 120,
      width: "100%",
    },
    contactList: {
      backgroundColor: colors.background,
      marginTop: 15,
      width: '100%'
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      backgroundColor: colors.background,
    },
    avatarContainer: {
      marginRight: 10,
    },
    avatar: {
      height: 50,
      width: 50,
      borderRadius: 50,
    },
    contactInfo: {
      flex: 1,
    },
    contactHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    contactName: {
      fontSize: 16,
      color: colors.text,
      fontFamily: FONTS.semiBold,
    },
    contactTime: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: FONTS.medium,
    },
    contactMessage: {
      color: colors.textSecondary,
      fontFamily: FONTS.medium,
      fontSize: 12,
    },
    unreadCount: {
      fontSize: 12,
      color: colors.white,
      fontFamily: FONTS.medium,
    },
    unreadCountContainer: {
      height: 20,
      width: 20,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      backgroundColor: colors.primary,
    },
  });
};
