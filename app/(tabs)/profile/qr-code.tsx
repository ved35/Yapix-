import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import CustomText from "@/components/CustomText";
import QRCodeSaveModal from "@/components/QRCodeSaveModal";
import QRCodeScanner from "@/components/QRCodeScanner";
import { FONTS } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useSendFriendRequestMutation } from "@/hooks/mutations/friendMutation";
import useAuthStore from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";
import * as MediaLibrary from "expo-media-library";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";

const { width, height } = Dimensions.get("window");

type TabType = "qr" | "scan";

const QrCode = () => {
  const styles = Style();
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const { colors } = useTheme();
  const user = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>("qr");
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveError, setSaveError] = useState<string | undefined>();
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [showScanResult, setShowScanResult] = useState(false);
  const qrRef = useRef<ViewShot | null>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const sendFriendRequestMutation = useSendFriendRequestMutation();

  // Create QR code data with user information
  const qrData = JSON.stringify({
    id: user?.user?.id || "",
    username: user?.user?.username || "",
    name: user?.user?.name || "",
    app: "Flikup",
  });

  const handleShareQR = async () => {
    if (!qrRef.current) {
      Alert.alert("Error", "QR code reference not found");
      return;
    }

    try {
      setIsSharing(true);

      // Capture the QR code as an image
      if (!qrRef.current) {
        throw new Error("QR code reference not found");
      }

      console.log("Capturing QR code for sharing...");
      let filePath;

      try {
        // Try with tmpfile first
        filePath = await (qrRef.current as any).capture();
        console.log("QR code captured for sharing, file path:", filePath);

        // If it's a data URI, convert it to a file
        if (filePath && filePath.startsWith("data:")) {
          const fileName = `flikup-qr-share-${Date.now()}.png`;
          const newPath = `${FileSystem.documentDirectory}${fileName}`;

          await FileSystem.writeAsStringAsync(newPath, filePath, {
            encoding: FileSystem.EncodingType.Base64,
          });

          filePath = newPath;
          console.log("Converted data URI to file for sharing:", filePath);
        }
      } catch (captureError) {
        console.error("Capture error for sharing:", captureError);
        throw new Error("Failed to capture QR code image for sharing");
      }

      if (!filePath) {
        throw new Error("Failed to capture QR code image for sharing");
      }

      // Create share content
      const shareMessage = `Connect with me on Flikup! 📱\n\n👤 Name: ${user.user?.name || "User"}\n🔗 Username: @${user.user?.username || "username"}\n\nScan this QR code to add me as a contact and start chatting! 💬\n\n#Flikup #Connect #QRCode`;

      await Share.share({
        message: shareMessage,
        title: "Flikup QR Code",
        url: filePath, // This will include the image in supported platforms
      });
    } catch (error) {
      console.error("Error sharing QR code:", error);
      Alert.alert("Error", "Failed to share QR code. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  const handleSaveQR = async () => {
    if (!qrRef.current) {
      setSaveError("QR code reference not found");
      setShowSaveModal(true);
      return;
    }

    try {
      setIsSaving(true);
      setShowSaveModal(true);
      setSaveError(undefined);

      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        setSaveError("Permission denied. Please grant permission to save QR code to your gallery");
        setIsSaving(false);
        return;
      }

      // Capture the QR code as an image
      if (!qrRef.current) {
        throw new Error("QR code reference not found");
      }

      console.log("Capturing QR code...");
      let filePath;

      try {
        // Try with tmpfile first
        filePath = await (qrRef.current as any).capture();
        console.log("QR code captured, file path:", filePath);

        // If it's a data URI, convert it to a file
        if (filePath && filePath.startsWith("data:")) {
          const fileName = `flikup-qr-${Date.now()}.png`;
          const newPath = `${FileSystem.documentDirectory}${fileName}`;

          await FileSystem.writeAsStringAsync(newPath, filePath, {
            encoding: FileSystem.EncodingType.Base64,
          });

          filePath = newPath;
          console.log("Converted data URI to file:", filePath);
        }
      } catch (captureError) {
        console.error("Capture error:", captureError);
        throw new Error("Failed to capture QR code image. Please try again.");
      }

      if (!filePath) {
        throw new Error("Failed to capture QR code image");
      }

      // Save to media library
      console.log("Saving to media library...");
      const asset = await MediaLibrary.saveToLibraryAsync(filePath);
      console.log("Saved to media library:", asset);

      setIsSaving(false);
      // Success state will be shown in the modal
    } catch (error) {
      console.error("Error saving QR code:", error);
      setSaveError(
        `Failed to save QR code: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      setIsSaving(false);
    }
  };

  const handleRetrySave = () => {
    setShowSaveModal(false);
    setTimeout(() => {
      handleSaveQR();
    }, 300);
  };

  const handleCloseSaveModal = () => {
    setShowSaveModal(false);
    setSaveError(undefined);
  };

  const handleScanQR = async () => {
    // Check if permission is already granted
    if (cameraPermission?.granted) {
      setShowScanner(true);
      return;
    }

    setIsRequestingPermission(true);

    try {
      // Request permission
      const permission = await requestCameraPermission();
      
      if (permission.granted) {
        setShowScanner(true);
      } else {
        // Show alert to user about permission being required
        Alert.alert(
          "Camera Permission Required",
          "To scan QR codes, Flikup needs access to your camera. Please grant camera permission in your device settings.",
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            {
              text: "Open Settings",
              onPress: () => {
                // Open device settings
                Linking.openSettings();
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      Alert.alert("Error", "Failed to request camera permission. Please try again.");
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleScanResult = (data: string) => {
    setShowScanner(false);
    try {
      const parsedData = JSON.parse(data);
      setScannedData(parsedData);
      setShowScanResult(true);
    } catch (error) {
      Alert.alert("Invalid QR Code", "The scanned QR code is not a valid Flikup QR code");
    }
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
  };

  const handleCloseScanResult = () => {
    setShowScanResult(false);
    setScannedData(null);
  };

  const handleAddContact = () => {
    if (scannedData) {
      sendFriendRequestMutation.mutate(scannedData.id, {
        onSuccess: () => {
          Alert.alert(
            "Contact Added!",
            `Successfully added ${scannedData.name} (@${scannedData.username}) to your contacts!`,
            [{ text: "OK", onPress: handleCloseScanResult }]
          );
        },
        onError: (error) => {
          Alert.alert(
            "Error",
            error?.message || "Failed to send friend request.",
            [{ text: "OK" }]
          );
        },
      });
    }
  };

  if (!user?.user) {
    return (
      <View style={[styles.container, { paddingTop: top }]}>
        <CustomHeader title={t("profile.qrCode")} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Please sign in to view your QR code
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={{ width: "90%", alignSelf: "center" }}>
        <CustomHeader title={t("profile.qrCode")} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "qr" && { backgroundColor: colors.primary }]}
          onPress={() => setActiveTab("qr")}
        >
          <Ionicons
            name="qr-code-outline"
            size={20}
            color={activeTab === "qr" ? colors.background : colors.text}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === "qr" ? colors.background : colors.text },
            ]}
          >
            My QR Code
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "scan" && { backgroundColor: colors.primary }]}
          onPress={() => setActiveTab("scan")}
        >
          <Ionicons
            name="scan-outline"
            size={20}
            color={activeTab === "scan" ? colors.background : colors.text}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === "scan" ? colors.background : colors.text },
            ]}
          >
            Scan QR
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === "qr" ? (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* User Info Section */}
          <View style={styles.userInfoContainer}>
            <LinearGradient
              colors={[colors.primary, colors.primary + "80"]}
              style={styles.userInfoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <CustomText style={styles.userName}>{user.user.name}</CustomText>
              <CustomText style={styles.userUsername}>@{user.user.username}</CustomText>
            </LinearGradient>
          </View>

          {/* QR Code Section */}
          <View style={styles.qrContainer}>
            <LinearGradient
              colors={[colors.background, colors.background + "20"]}
              style={styles.qrGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <ViewShot
                ref={qrRef}
                options={{
                  format: "png",
                  quality: 1,
                  result: "tmpfile",
                  fileName: "flikup-qr-code",
                }}
                style={styles.qrWrapper}
              >
                <QRCode
                  value={qrData}
                  size={width * 0.6}
                  color={colors.text}
                  backgroundColor={colors.background}
                  logo={require("@/assets/icons/app_icon.png")}
                  logoSize={60}
                  logoBackgroundColor={colors.background}
                  logoBorderRadius={30}
                  logoMargin={10}
                />
              </ViewShot>

              <Text style={[styles.qrDescription, { color: colors.textSecondary }]}>
                Scan this QR code to connect with me
              </Text>
            </LinearGradient>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.primary },
                isSharing && styles.actionButtonDisabled,
              ]}
              onPress={handleShareQR}
              disabled={isSharing}
            >
              {isSharing ? (
                <Ionicons name="share-social-outline" size={24} color={colors.background} />
              ) : (
                <Ionicons name="share-outline" size={24} color={colors.background} />
              )}
              <Text style={[styles.actionButtonText, { color: colors.background }]}>
                {isSharing ? "Sharing..." : "Share QR"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.accent },
                isSaving && styles.actionButtonDisabled,
              ]}
              onPress={handleSaveQR}
              disabled={isSaving}
            >
              {isSaving ? (
                <Ionicons name="hourglass-outline" size={24} color={colors.background} />
              ) : (
                <Ionicons name="download-outline" size={24} color={colors.background} />
              )}
              <Text style={[styles.actionButtonText, { color: colors.background }]}>
                {isSaving ? "Saving..." : "Save QR"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Scan QR Section */}
          {!showScanner ? (
            <View style={styles.scanSection}>
              <View style={[styles.scanCard, { backgroundColor: colors.surface }]}>
                <Ionicons name="scan-outline" size={60} color={colors.primary} />
                <Text style={[styles.scanTitle, { color: colors.text }]}>Scan QR Code</Text>
                <Text style={[styles.scanDescription, { color: colors.textSecondary }]}>
                  Scan QR codes from other Flikup users to connect with them and start chatting
                </Text>
                
                <CustomButton
                  text={ "Start Scanning"}
                  onPress={handleScanQR}
                  variant="filled"
                  style={styles.scanButton}
                  disabled={isRequestingPermission}
                />
              </View>

              {/* Recent Scans */}
              <View style={styles.recentScansSection}>
                <Text style={[styles.recentScansTitle, { color: colors.text }]}>How it works</Text>
                <View style={styles.howItWorksContainer}>
                  <View style={styles.howItWorksStep}>
                    <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                      <Text style={[styles.stepNumberText, { color: colors.background }]}>1</Text>
                    </View>
                    <Text style={[styles.stepText, { color: colors.text }]}>
                      Tap "Start Scanning" to open the camera
                    </Text>
                  </View>
                  <View style={styles.howItWorksStep}>
                    <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                      <Text style={[styles.stepNumberText, { color: colors.background }]}>2</Text>
                    </View>
                    <Text style={[styles.stepText, { color: colors.text }]}>
                      Point your camera at a Flikup QR code
                    </Text>
                  </View>
                  <View style={styles.howItWorksStep}>
                    <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                      <Text style={[styles.stepNumberText, { color: colors.background }]}>3</Text>
                    </View>
                    <Text style={[styles.stepText, { color: colors.text }]}>
                      Add the user to your contacts and start chatting
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.scannerContainer}>
              <QRCodeScanner
                onScan={handleScanResult}
                onClose={handleCloseScanner}
              />
            </View>
          )}
        </ScrollView>
      )}

      {/* Save Modal */}
      <QRCodeSaveModal
        visible={showSaveModal}
        isSaving={isSaving}
        onClose={handleCloseSaveModal}
        onRetry={handleRetrySave}
        error={saveError}
      />

      {/* Scan Result Modal */}
      <Modal
        visible={showScanResult}
        transparent
        animationType="fade"
        onRequestClose={handleCloseScanResult}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.scanResultModal, { backgroundColor: colors.background }]}>
            <View style={[styles.scanResultIcon, { backgroundColor: colors.primary + "20" }]}>
              <Ionicons name="person-add" size={48} color={colors.primary} />
            </View>
            
            <Text style={[styles.scanResultTitle, { color: colors.text }]}>User Found!</Text>
            
            {scannedData && (
              <View style={styles.scanResultInfo}>
                <Text style={[styles.scanResultName, { color: colors.text }]}>
                  {scannedData.name}
                </Text>
                <Text style={[styles.scanResultUsername, { color: colors.textSecondary }]}>
                  @{scannedData.username}
                </Text>
                <Text style={[styles.scanResultApp, { color: colors.textSecondary }]}>
                  {scannedData.app || 'Flikup'}
                </Text>
              </View>
            )}

            <View style={styles.scanResultButtons}>
              <TouchableOpacity
                style={[styles.scanResultButton, { backgroundColor: colors.primary }]}
                onPress={handleAddContact}
              >
                <Text style={[styles.scanResultButtonText, { color: colors.background }]}>
                  Add Contact
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.scanResultButton,
                  styles.cancelScanButton,
                  { borderColor: colors.border },
                ]}
                onPress={handleCloseScanResult}
              >
                <Text style={[styles.cancelScanButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default QrCode;

const Style = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    tabContainer: {
      flexDirection: "row",
      marginHorizontal: 20,
      marginVertical: 15,
      backgroundColor: colors.surface,
      borderRadius: 15,
      padding: 5,
    },
    tab: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
      gap: 8,
    },
    tabText: {
      fontSize: 16,
      fontFamily: FONTS.semiBold,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: 20,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    errorText: {
      fontSize: 16,
      textAlign: "center",
    },
    userInfoContainer: {
      marginVertical: 20,
      borderRadius: 20,
      overflow: "hidden",
      elevation: 5,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    userInfoGradient: {
      padding: 20,
      alignItems: "center",
    },
    userName: {
      fontSize: 24,
      fontFamily: FONTS.bold,
      color: colors.background,
      marginBottom: 5,
    },
    userUsername: {
      fontSize: 16,
      fontFamily: FONTS.regular,
      color: colors.background + "CC",
    },
    qrContainer: {
      marginVertical: 20,
      borderRadius: 20,
      overflow: "hidden",
      elevation: 3,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    qrGradient: {
      padding: 30,
      alignItems: "center",
    },
    qrWrapper: {
      padding: 20,
      backgroundColor: colors.background,
      borderRadius: 15,
      elevation: 2,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    qrDescription: {
      fontSize: 14,
      fontFamily: FONTS.regular,
      textAlign: "center",
      marginTop: 15,
      lineHeight: 20,
    },
    actionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 20,
      gap: 15,
    },
    actionButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 15,
      elevation: 2,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    actionButtonDisabled: {
      opacity: 0.6,
    },
    actionButtonText: {
      fontSize: 16,
      fontFamily: FONTS.semiBold,
      marginLeft: 8,
    },
    scanSection: {
      marginVertical: 20,
    },
    scanCard: {
      padding: 30,
      borderRadius: 20,
      alignItems: "center",
      elevation: 2,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    scanTitle: {
      fontSize: 24,
      fontFamily: FONTS.bold,
      marginTop: 15,
      marginBottom: 10,
      textAlign: "center",
    },
    scanDescription: {
      fontSize: 16,
      fontFamily: FONTS.regular,
      textAlign: "center",
      marginBottom: 25,
      lineHeight: 22,
    },
    scanButton: {
      marginTop: 10,
      paddingHorizontal: 10,
    },
    recentScansSection: {
      marginTop: 30,
    },
    recentScansTitle: {
      fontSize: 20,
      fontFamily: FONTS.bold,
      marginBottom: 20,
      textAlign: "center",
    },
    howItWorksContainer: {
      gap: 20,
    },
    howItWorksStep: {
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
    },
    stepNumber: {
      width: 30,
      height: 30,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
    },
    stepNumberText: {
      fontSize: 16,
      fontFamily: FONTS.bold,
    },
    stepText: {
      fontSize: 16,
      fontFamily: FONTS.regular,
      flex: 1,
      lineHeight: 22,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    scanResultModal: {
      width: "85%",
      padding: 30,
      borderRadius: 20,
      alignItems: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    scanResultIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    scanResultTitle: {
      fontSize: 24,
      fontFamily: FONTS.bold,
      marginBottom: 20,
      textAlign: "center",
    },
    scanResultInfo: {
      alignItems: "center",
      marginBottom: 25,
    },
    scanResultName: {
      fontSize: 20,
      fontFamily: FONTS.bold,
      marginBottom: 5,
    },
    scanResultUsername: {
      fontSize: 16,
      fontFamily: FONTS.regular,
    },
    scanResultApp: {
      fontSize: 14,
      fontFamily: FONTS.regular,
      marginTop: 5,
      opacity: 0.8,
    },
    scanResultButtons: {
      flexDirection: "row",
      gap: 15,
    },
    scanResultButton: {
      paddingHorizontal: 25,
      paddingVertical: 12,
      borderRadius: 25,
      minWidth: 120,
      alignItems: "center",
    },
    cancelScanButton: {
      backgroundColor: "transparent",
      borderWidth: 1,
    },
    scanResultButtonText: {
      fontSize: 16,
      fontFamily: FONTS.semiBold,
    },
    cancelScanButtonText: {
      fontSize: 16,
      fontFamily: FONTS.semiBold,
    },
    scannerContainer: {
      flex: 1,
      height: '100%',
    },
  });
};
