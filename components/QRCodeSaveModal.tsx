import { FONTS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface QRCodeSaveModalProps {
  visible: boolean;
  isSaving: boolean;
  onClose: () => void;
  onRetry: () => void;
  error?: string;
}

const QRCodeSaveModal: React.FC<QRCodeSaveModalProps> = ({
  visible,
  isSaving,
  onClose,
  onRetry,
  error,
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          {isSaving ? (
            <>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Saving QR Code...
              </Text>
              <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                Please wait while we save your QR code to the gallery
              </Text>
            </>
          ) : error ? (
            <>
              <View style={[styles.iconContainer, { backgroundColor: colors.error + '20' }]}>
                <Ionicons name="close-circle" size={48} color={colors.error} />
              </View>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Save Failed
              </Text>
              <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                {error}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.primary }]}
                  onPress={onRetry}
                >
                  <Text style={[styles.buttonText, { color: colors.background }]}>
                    Try Again
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
                  onPress={onClose}
                >
                  <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="checkmark-circle" size={48} color={colors.primary} />
              </View>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Success!
              </Text>
              <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                Your QR code has been saved to your gallery successfully!
              </Text>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={onClose}
              >
                <Text style={[styles.buttonText, { color: colors.background }]}>
                  OK
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
  },
});

export default QRCodeSaveModal; 