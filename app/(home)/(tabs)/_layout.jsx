import { Tabs } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { router } from "expo-router";
import { Button,View, StyleSheet } from "react-native";


export default function TabNavigator() {
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("authToken");
      let authToken = JSON.parse(value)._tokenResponse.idToken;
      if (!authToken) {
        router.replace("/(auth)");
        await AsyncStorage.clear();
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace("/(auth)/login"); 
    } catch (e) {
      console.error("Error logging out:", e);
    }
  };
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Add Expenses",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
          headerTitleAlign: "center",
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome5 name="user-alt" size={size} color={color} />
          ),
          headerTitleAlign: "center",
          headerRight: () => (
            <View style={styles.logoutButton}>
            <Button
              onPress={handleLogout}
              title="Logout"
              color="#000"
            />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}


const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 10, // Adjust the value as needed
  },
});