import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Fontisto } from "@expo/vector-icons";
import { auth, db } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc } from "firebase/firestore";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) {
        await setDoc(doc(db, "users", user?.user?.uid), {
          email: user?.user?.email,
          id: user?.user?.uid,
          userName: userName,
        });
        const jsonValue = JSON.stringify(user);
        await AsyncStorage.setItem("authToken", jsonValue);
        router.replace("/(home)");
      }
    } catch (error) {
      alert("Sign up failed");
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Fontisto name="hipchat" size={60} color="black" />
        <Text style={styles.headerText}>Sign up to EXPNS</Text>
      </View>
      <View style={[styles.verticallySpaced, styles.mt5]}>
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
      <View style={[styles.verticallySpaced, styles.mt5]}>
        <TextInput
          style={styles.input}
          label="User Name"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setUserName(text)}
          value={userName}
          placeholder="Enter name"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt5]}>
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
          onPress={() => signUpWithEmail()}
        >
          <Text style={styles.text}>Sign up</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <Text>Already signed up? Login</Text>
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
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
});
