import { useEffect, useState } from "react";
import { Alert, Linking, Platform } from "react-native";
import {
  check,
  checkNotifications,
  Permission,
  PERMISSIONS,
  PermissionStatus,
  request,
  requestNotifications,
  RESULTS,
} from "react-native-permissions";

const CAMERA_PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
});

const MICROPHONE_PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.MICROPHONE,
  android: PERMISSIONS.ANDROID.RECORD_AUDIO,
});

export const handleNotificationPermission = async () => {
  try {
    const { status } = await checkNotifications();

    if (status === "granted") {
      return "granted";
    } else if (status === "blocked") {
      return "blocked";
    } else if (status === "unavailable") {
      return "unavailable";
    } else {
      const { status } = await requestNotifications(["alert", "badge", "sound"]);
      return status;
    }
  } catch (error) {}
};

interface permissionHookResult {
  status: PermissionStatus;
  requestPermissions: () => Promise<PermissionStatus>;
  checkPermissions: () => Promise<PermissionStatus>;
}

const usePermission = (permission: Permission): permissionHookResult => {
  const [status, setStatus] = useState<PermissionStatus>(RESULTS.DENIED as PermissionStatus);

  const checkPermissions = async (): Promise<PermissionStatus> => {
    try {
      const result = await check(permission);
      setStatus(result as PermissionStatus);
      return result as PermissionStatus;
    } catch (error) {
      return RESULTS.DENIED as PermissionStatus;
    }
  };

  const requestPermission = async (): Promise<PermissionStatus> => {
    try {
      const result = await request(permission);
      setStatus(result as PermissionStatus);

      if (result === RESULTS.BLOCKED) {
        Alert.alert(
          "Permission Required",
          "Please enable this permission in you device setting to use this feature.",
          [
            {
              text: "Ok",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
      }
      return result as PermissionStatus;
    } catch (error) {
      return RESULTS.DENIED as PermissionStatus;
    }
  };

  useEffect(() => {
    const checkAndRequestPermission = async () => {
      const currentStatus = await checkPermissions();

      if (currentStatus !== RESULTS.GRANTED) {
        await requestPermission();
      }
    };
    checkAndRequestPermission();
  }, []);

  return {
    status,
    checkPermissions,
    requestPermissions: requestPermission,
  };
};
