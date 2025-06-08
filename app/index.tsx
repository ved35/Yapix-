import { Images } from '@/assets/assets';
import CustomButton from '@/components/CustomButton';
import CustomText from '@/components/CustomText';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import GradientView from '@/components/GradientView';
import { FONTS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, StyleSheet, View } from "react-native";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const GetStarted = () => {
  const styles = style();
  const { t } = useTranslation();

  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  return (
    <View onLayout={onLayoutRootView} style={styles.container}>
      <GradientView colors={["#EDF2FF", "#E7F9F4"]} style={styles.gradient} >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBg}>
              <MaterialIcons name="videocam" size={40} color="#fff" />
            </View>
            <CustomText style={styles.appName}>{t('onboarding.appName')}</CustomText>
            <CustomText style={styles.subtitle}>{t('onboarding.subtitle')}</CustomText>
          </View>

          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <Image source={Images.illustration} style={styles.illustration} resizeMode="contain" />
          </View>

          {/* Feature Text */}
          <View style={styles.featureContainer}>
            <CustomText style={styles.featureTitle}>{t('onboarding.stayConnected')}</CustomText>
            <CustomText style={styles.featureDesc}>
              {t('onboarding.featureDesc')}
            </CustomText>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <CustomButton 
              text={t('onboarding.getStarted')}
              onPress={() => {router.navigate('/(auth)/sign-up')}}
              variant="filled"
            />
            <CustomButton 
              text={t('auth.signIn')}
              onPress={() => {router.navigate('/(auth)/sign-in')}}
              variant="outlined"
            />
            <CustomText style={styles.orText}>{t('common.continueWith')}</CustomText>
            <GoogleSignInButton />
          </View>
        </ScrollView>
      </GradientView>
    </View>
  );
}

const style = () => {

  const {colors} = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 40,
    },
    logoContainer: {
      alignItems: 'center',
      marginTop: 40,
    },
    logoBg: {
      backgroundColor: colors.primary,
      borderRadius: 20,
      padding: 18,
      marginBottom: 16,
    },
    appName: {
      fontSize: 28,
      fontFamily: FONTS.bold,
      color: colors.black,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 15,
      fontFamily: FONTS.regular,
      color: colors.gray,
      marginBottom: 5,
    },
    illustrationContainer: {
      alignItems: 'center',
    },
    illustration: {
      width: 200,
      height: 200,
    },
    featureContainer: {
      alignItems: 'center',
      marginVertical: 5,
      paddingHorizontal: 24,
    },
    featureTitle: {
      fontSize: 20,
      fontFamily: FONTS.bold,
      color: colors.black,
      marginBottom: 6,
    },
    featureDesc: {
      fontSize: 15,
      fontFamily: FONTS.regular,
      color: colors.gray,
      textAlign: 'center',
    },
    buttonContainer: {
      width: '100%',
      alignItems: 'center',
      marginTop: 10,
    },
    orText: {
      color: colors.gray,
      fontSize: 13,
      fontFamily: FONTS.regular,
      marginVertical: 8,
    },
  });
}
export default GetStarted;