import { View, Text, Button, StyleSheet } from "react-native";
import React from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace("/(auth)/login"); // Navigate to the login screen
    } catch (e) {
      console.error("Error logging out:", e);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
});
