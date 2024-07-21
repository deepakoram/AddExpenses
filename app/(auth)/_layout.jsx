import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, Stack, router } from "expo-router";
import { useEffect, useState } from "react";

export default function AuthLayout() {
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('authToken');
      if (value) {
        const authToken = JSON.parse(value)?._tokenResponse?.idToken;
        // console.log(authToken);
        if (authToken) {
          router.replace('/(home)');
        } else {
          router.replace('/(auth)');
        }
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    // Optionally, you can render a loading spinner or placeholder here
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="Signup" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
