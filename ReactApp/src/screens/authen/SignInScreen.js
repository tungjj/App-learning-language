import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  TextInput,
  TouchableOpacity,
  Dimensions,
  AsyncStorageStatic,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import React, { useState } from 'react'
import config from '../../config';
import axios, { Axios } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Constants } from "../../Constants";
import { useDispatch, useSelector } from 'react-redux';
import userSlice from "../../redux/user.slice";
import dataSlice from './../../redux/data.slice';
import { coursesSelector, loadingStateSelector } from "../../redux/selector";
// import courseSlice from "../../redux/course.slice";
import IndicatorScreen from './../util/IndicatorScreen';
const window = Dimensions.get('window');

async function loginUser(email, password) {
  const url = `${Constants.URL_SERVER}/auth/signin`;

  const data = {email: email.toLowerCase(), password};
  return await axios.post(url, data);
}
export async function getCourses() {
  const url = `${Constants.URL_SERVER}/courses`;
  const jwt = await AsyncStorage.getItem('acc_token');
  let config = {
    headers: {
       Authorization: "Bearer " + jwt,
    }
  };
  return (await axios.get(url, config)).data.data;
}
export async function getTimeout() {
  const url = `${Constants.URL_SERVER}/users/user-timeout`;
  const jwt = await AsyncStorage.getItem('acc_token');
  let config = {
    headers: {
       Authorization: "Bearer " + jwt,
    }
  };
  return (await axios.get(url, config)).data.data;
}
export async function getData() {
  const url = `${Constants.URL_SERVER}/learnedwords/report`;
  const jwt = await AsyncStorage.getItem('acc_token');
  let config = {
    headers: {
       Authorization: "Bearer " + jwt,
    }
  };
  return (await axios.get(url, config)).data.data;
}
export async function getLearnedLesson() {
  const url = `${Constants.URL_SERVER}/users/user-learnedlesson`;
  const jwt = await AsyncStorage.getItem('acc_token');
  let config = {
    headers: {
       Authorization: "Bearer " + jwt,
    }
  };
  return (await axios.get(url, config)).data.data;
}
export default function SignInScreen(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const loadingState = useSelector(loadingStateSelector);
  const [loadingState, useLoadingState] = useState(false);

  const dispatch = useDispatch();
  
  const handleSignIn = async () => { 
    //# call log in API 
    useLoadingState(true);
    const res = await loginUser(email, password);

    //# handle success
    if(res.data.message == 'Success') {
      await AsyncStorage.setItem('acc_token', res.data.data.toString());
      let courses = await getCourses();
      let timeout = await getTimeout();
      const data =  await getData();
      const learnedLesson = await getLearnedLesson();

      await dispatch(userSlice.actions.setTimeout(timeout));
      await dispatch(dataSlice.actions.addCourses(courses));
      await dispatch(userSlice.actions.changeLoginState());
      await dispatch(userSlice.actions.setDataReview(data));
      await dispatch(userSlice.actions.setLearnedLesson(learnedLesson));
      await dispatch(dataSlice.actions.resetLoadingState());

      await useLoadingState(false);
    }
    //# handle fail
    else {
      useLoadingState(false);
      Alert.alert(`${res.data.data}`);
    }
  }

  return (
    (loadingState) ? (
      <IndicatorScreen/>
    ) : (

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
          onChangeText={(text) => {setPassword(text); console.log(text)}}
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
          onPress={handleSignIn}
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
    </SafeAreaView>
    )
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