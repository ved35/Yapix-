import { Icons } from "@/assets/assets";
import { FONTS } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useGoogleMutation } from "@/hooks/mutations/authMutations";
import { GoogleSignInButtonProps } from "@/interface/type";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { User } from 'firebase/auth';
import React, { memo, useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, StyleSheet } from "react-native";
import CustomText from "./CustomText";

const GoogleSignInButton = ({
  onPress,
  style: containerStyle,
}: GoogleSignInButtonProps) => {

  const styles = getStyles();

  const googleMutation = useGoogleMutation();

  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const signInWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true);
      
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      const userInfo = await GoogleSignin.signIn();
      console.log("userinfo:",userInfo)
      // const { idToken } = await GoogleSignin.getTokens();

      if(userInfo.type === 'success'){
        let data = {
          email: userInfo.data?.user.email as string,
          name: userInfo.data?.user.name as string,
          profile_pic: userInfo.data?.user.photo as string,
        }
  
        let res = await googleMutation.mutateAsync(data)

        if(res?.success){
          router.replace('/(tabs)/profile')
        }
      }

      
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Sign-in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign-in in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play services not available');
      } else {
        Alert.alert('Something went wrong', error.message || 'Unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async (): Promise<void> => {
    try {
      setLoading(true);
      
      await GoogleSignin.signOut();
      
      console.log('User signed out successfully!');
      
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error signing out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable 
      style={[styles.googleBtn, containerStyle]} 
      onPress={signInWithGoogle} 
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#222" />
      ) : (
        <>
          <Image source={Icons.google} style={styles.googleIcon} />
          <CustomText style={styles.googleText}>
            {userInfo ? 'Sign Out' : 'Continue with Google'}
          </CustomText>
        </>
      )}
    </Pressable>
  );
};

const getStyles = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    googleBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.white,
      borderRadius: 10,
      paddingVertical: 12,
      width: 260,
      justifyContent: "center",
      shadowColor: colors.black,
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      marginBottom: 8,
    },
    googleIcon: {
      width: 20,
      height: 20,
      marginRight: 8,
    },
    googleText: {
      color: colors.black,
      fontSize: 16,
      fontFamily: FONTS.medium,
      marginTop: 2,
    },
  });
};

export default memo(GoogleSignInButton);