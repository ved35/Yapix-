import { Icons } from "@/assets/assets";
import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import CustomTextInput from "@/components/CustomTextInput";
import { useTheme } from "@/context/ThemeContext";
import { useEditPrfileMutation } from "@/hooks/mutations/profileMutation";
import { EditFormData } from "@/interface/type";
import useAuthStore from "@/store/authStore";
import { editProfileSchema } from "@/validation/auth.schema";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ZodError } from "zod";

const EditProfile = () => {
  const styles = style();
  const { top } = useSafeAreaInsets();

  const editProfileMutation = useEditPrfileMutation();

  const [errors, setErrors] = useState<Partial<Record<keyof EditFormData, string>>>({});

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [formData, setFormData] = useState<EditFormData>({
    username: user?.username || "",
    name: user?.name || "",
    profile_picture: user?.profile_picture || "",
    email: user?.email || "",
  });

  const handleChange = (key: keyof EditFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validateForm = () => {
    try {
      editProfileSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<Record<keyof EditFormData, string>> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof EditFormData;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSave = async () => {
    if (validateForm()) {
      // Save logic here
      let data = {
        name: formData.name,
        username: formData.username,
      };
      const res = await editProfileMutation.mutateAsync(data);

      if (res?.success) {
        router.canGoBack() && router.back();
      }
    }
  };

  return (
    <View style={[styles.container,{paddingTop: top}]}>
      <View style={styles.contentContainer}>
        <CustomHeader title="Edit Profile" />
        <View style={styles.profilePicContainer}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/75.jpg" }}
            style={styles.profilePic}
          />
          <Pressable style={styles.editIconContainer}>
            <Image source={Icons.edit} style={[styles.editIcon]} />
          </Pressable>
        </View>

        <CustomTextInput
          label="Name"
          value={formData.name}
          onChangeText={(value) => handleChange("name", value)}
          autoCapitalize="none"
          autoCorrect={false}
          error={errors.name}
          containerStyle={styles.input}
        />
        <CustomTextInput
          label="Username"
          value={formData.username}
          onChangeText={(value) => handleChange("username", value)}
          autoCapitalize="none"
          autoCorrect={false}
          error={errors.username}
          containerStyle={styles.input}
        />
        <CustomTextInput
          label="Email"
          value={formData.email}
          editable={false}
          containerStyle={styles.input}
        />
        <CustomButton
          text="Save"
          style={styles.saveButton}
          onPress={handleSave}
          loading={editProfileMutation.isPending}
        />
      </View>
    </View>
  );
};

export default EditProfile;

const style = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: colors.background,
    },
    contentContainer: {
      width: "90%",
      flex: 1,
      alignItems: "center",
    },
    profilePicContainer: {
      marginBottom: 30,
      position: "relative",
      marginTop: 30,
    },
    profilePic: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 2,
    },
    editIconContainer: {
      position: "absolute",
      bottom: 5,
      right: 5,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 8,
    },
    editIcon: {
      width: 20,
      height: 20,
      tintColor: colors.primary,
    },
    input: {
      marginBottom: 10,
    },
    saveButton: {
      marginTop: "auto",
      width: "100%",
      marginBottom: 50,
    },
  });
};
