import { apiConfig } from '@/config/apiConfig';
import { SCREEN_HEIGHT } from '@/constants/device';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { memo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';

interface ChatPreviewProps {
    url: string;
    isVisiable: boolean;
    setIsVisiable: React.Dispatch<React.SetStateAction<boolean>>
}

const ChatImagePreview = ({
    url,
    isVisiable,
    setIsVisiable
}:ChatPreviewProps) => {

    const { colors } = useTheme();
    const styles = Style();

    const [isLoading, setIsLoading] = useState(false);

  return (
    <Modal
        useNativeDriver
        coverScreen={true}
        hasBackdrop={true}
        backdropOpacity={1}
        statusBarTranslucent
        isVisible={isVisiable}
        useNativeDriverForBackdrop
        deviceHeight={SCREEN_HEIGHT * 2}
        customBackdrop={
            <View style={{flex: 1,height: SCREEN_HEIGHT}}>
                <BlurView 
                    tint='dark'
                    intensity={20}
                    experimentalBlurMethod='dimezisBlurView'
                    style={{flex: 1, height: SCREEN_HEIGHT}}
                />
            </View>
        }
    >
        <Pressable hitSlop={20} style={styles.closeBtn} onPress={()=>setIsVisiable(false)}>
            <Ionicons name='close' size={25} color={colors.primary} />
        </Pressable>
        {
            isLoading && (
                <View style={styles.loadingView}>
                    <ActivityIndicator size={'large'} color={colors.primary} />
                </View>
            )
        }
        <View style={styles.imageView}>
            <Image 
                resizeMode='contain'
                style={styles.image}
                onLoad={()=> setIsLoading(false)}
                onLoadStart={()=> setIsLoading(true)}
                source={{uri: `${apiConfig.BASE_URL}${url}`}}
            />
            <Pressable hitSlop={20} style={styles.download} onPress={()=>setIsVisiable(false)}>
                <Ionicons name='download-outline' size={24} color={colors.primary} />
            </Pressable>
        </View>
    </Modal>
  )
}

export default memo(ChatImagePreview)

const Style = () => { 

    const { colors } = useTheme();
    
    return StyleSheet.create({
        closeBtn: {
            top: 30,
            right: 0,
            zIndex: 99999,
            backgroundColor: colors.white,
            height: 50,
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
            position: 'absolute'
        },
        closeicon: {
            width: 30,
            height: 30,
            resizeMode: 'contain',
            tintColor: colors.primary,
        },
        image: {
            width: '100%',
            height: '100%',
            backgroundColor: colors.border,
        },
        loadingView: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center'
        },
        errorView: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        imageView: {
            width: '100%',
            height: '80%',
            borderRadius: 10,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
        },
        download: {
            right: 10,
            bottom: 10,
            padding: 10,
            zIndex: 999,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            backgroundColor: colors.white,
        }
    });
}