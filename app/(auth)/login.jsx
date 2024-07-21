import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  Button,
  TouchableOpacity,
  Text,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Fontisto } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { auth } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) {
        const jsonValue = JSON.stringify(user);
        await AsyncStorage.setItem("authToken", jsonValue);
        router.replace("/(home)");
      }
    } catch (error) {
      alert("Sign in failed: " + error.message);
    }
    // if (error) Alert.alert(error.message)
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Fontisto name="hipchat" size={60} color="black" />
        <Text style={styles.headerText}>Login to EXPNS</Text>
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          style={styles.input}
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          style={styles.input}
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TouchableOpacity
          style={styles.button}
          disabled={loading}
          onPress={() => signInWithEmail()}
        >
          <Text style={styles.text}>Sign in</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TouchableOpacity onPress={() => router.replace("/(auth)/Signup")}>
          <Text>Don't hav account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 50,
  },
  headerText: {
    fontSize: 30,
    textAlign: "center",
  },
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#3281a8",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
  },
  text: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  input: {
    backgroundColor: "red",
    padding: 10,
  },
});
