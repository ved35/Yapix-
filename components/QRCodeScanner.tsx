import { FONTS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { CameraView } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface QRCodeScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan, onClose }) => {
  const { colors } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const [scanned, setScanned] = useState(false);
  const scanLineAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start scanning animation when component mounts
    const startScanAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnimation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    // Start animation immediately since permission is already granted
    startScanAnimation();
  }, [scanLineAnimation]);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    
    // Trigger haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Add a small delay to prevent multiple scans
    setTimeout(() => {
      onScan(data);
    }, 100);
  };

  const handleClose = () => {
    setScanned(false);
    onClose();
  };

  const handleRescan = () => {
    setScanned(false);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <View style={styles.overlay}>
          {/* Close Button */}
          <TouchableOpacity 
            style={[styles.closeButton, { top: bottom + 20 }]} 
            onPress={handleClose}
          >
            <Ionicons name="close" size={28} color={colors.text} />
          </TouchableOpacity>

          {/* Scanner Frame */}
          <View style={styles.scannerFrame}>
            <View style={[styles.corner, styles.cornerTopLeft, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.cornerTopRight, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.cornerBottomLeft, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.cornerBottomRight, { borderColor: colors.primary }]} />
            
            {/* Scanning animation overlay */}
            <Animated.View 
              style={[
                styles.scanLine, 
                { 
                  backgroundColor: colors.primary,
                  transform: [{
                    translateY: scanLineAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, Math.min(width * 0.8, 300) - 4], // Match frame size
                    })
                  }]
                }
              ]} 
            />
          </View>

          {/* Instructions */}
          <View style={[styles.instructionsContainer, { backgroundColor: colors.background + 'DD', bottom: bottom + 20 }]}>
            <Text style={[styles.instructions, { color: colors.text }]}>
              Position the QR code within the frame
            </Text>
            {scanned && (
              <TouchableOpacity 
                style={[styles.rescanButton, { backgroundColor: colors.primary }]}
                onPress={handleRescan}
              >
                <Text style={[styles.rescanText, { color: colors.background }]}>
                  Tap to Scan Again
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    marginBottom: 50
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButtonHeader: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  scannerFrame: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: Math.min(width * 0.8, 300), // Responsive width with max limit
    height: Math.min(width * 0.8, 300), // Responsive height with max limit
    marginLeft: -Math.min(width * 0.8, 300) / 2,
    marginTop: -Math.min(width * 0.8, 300) / 2,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderWidth: 4,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.8,
  },
  instructionsContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  instructions: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    marginBottom: 10,
  },
  rescanButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  rescanText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
  text: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    padding: 5,
  },
});

export default QRCodeScanner;