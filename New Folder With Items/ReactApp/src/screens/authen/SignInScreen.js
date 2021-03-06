import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import React, { useState } from 'react'
import config from '../../config';
import axios from 'axios';



const window = Dimensions.get('window');

async function loginUser(credentials) {
  return fetch('http://localhost:3000/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
 }

export default function SignInScreen(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // console.log(props.setLoginState);
  // async function sendLogin(email: string, password: string, setLoginState) {
  //   console.log(email, password);

  //   let res = await axios.post("http://localhost:3000/auth/signin", {
  //     email,
  //     password,
  //   });
  //   console.log(res.data);
  //   SecureStore.setItemAsync("jwt", res.data);
  //   await setLoginState(true);
  // }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.welcome}>
        <Text style={{ fontSize: 30 }}>Welcome back!</Text>
      </View>

      <View style={styles.inputView}>
        <TextInput
          editable={true}
          maxLength={40}
          // enablesReturnKeyAutomatically={true}
          keyboardType="email-address"
          placeholder="Email"
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          editable={true}
          maxLength={40}
          // enablesReturnKeyAutomatically={true}
          keyboardType="default"
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity>
          <Text style={{ fontSize: 20, color: config.primary }}>
            Forgot password?
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.viewButton}>
        <TouchableOpacity
          style={styles.signinButton}
          onPress={async () => { loginUser({email, password}); }}
        >
          <Text
            style={{
              fontSize: 25,
              padding: 10,
              color: "white",
              fontWeight: "bold",
            }}
          >
            Sign in
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate("SignUp")}>
          <Text style={{ fontSize: 18 }}>
            Don't you have account?{" "}
            <Text style={{ color: config.primary }}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* <Button
        title="click me"
        onPress={() => props.navigation.navigate("SignUp")}
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    // fontSize: 25,
  },
  inputView: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    // borderColor: "red",
    fontSize: 25,
    // marginLeft: 20,
    // marginRight: 20,
    marginBottom: window.height * 0.01,
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.12,
    shadowRadius: 60,
    width: window.width * 0.9,
  },
  viewButton: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  signinButton: {
    borderWidth: 1,
    width: window.width * 0.9,
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: config.primary,

  },
});