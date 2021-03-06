import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Alert,
} from "react-native";
import React from "react";
import config from "../../config";
//screen
import SchoolScreen from '../learnViews/SchoolScreen';
import CombinedScreen from '../learnViews/CombinedScreen';
// icon
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import dataSlice from "../../redux/data.slice";
import { Constants } from "../../Constants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { userRemaningSelector } from "../../redux/selector";

async function getWords(id) {
  const url = `${Constants.URL_SERVER}/words/${id}`;
  const jwt = await  AsyncStorage.getItem('acc_token');
  let config = {
    headers: {
       Authorization: "Bearer " + jwt,
    }
  };
  return await (await axios.get(url, config)).data.data;
}

export default function BlockBasicToeic({id, content, navigation, lessonId}) {
  const dispatch = useDispatch();
  const learnedLesson = useSelector(userRemaningSelector).learnedLesson;
  
  //# check if lesson were done
  const done = (learnedLesson.indexOf(lessonId) != -1) ? true : false;
  let tick = done ? <MaterialCommunityIcons
            name="check"
            style={{
              fontSize: 30,
            }}
          /> : " ";
  let style = !done ? styles.container : styles.containerDisable;

  const handleBlockBasicToeic = async () => {
    dispatch(dataSlice.actions.switchLoadingState())
    const words = await getWords(lessonId);

    if(words) {
      dispatch(dataSlice.actions.addWords(words));
      dispatch(dataSlice.actions.setLessonId(lessonId));
      dispatch(dataSlice.actions.resetCount());
      dispatch(dataSlice.actions.resetIndexWord());
      navigation.navigate("Combined");
      dispatch(dataSlice.actions.switchLoadingState())
    }
    else {
      Alert.alert('Error');
      dispatch(dataSlice.actions.switchLoadingState())
    }
  }
  return (
    <TouchableOpacity
      style={style}
      disabled={done}
      onPress={handleBlockBasicToeic}
    >
      <ImageBackground
        source={require("../../images/icons8-swastika-55.png")}
        style={styles.image}
      >
        <Text style={{ fontSize: 30 }}>{id}</Text>
      </ImageBackground>
      <Text style={styles.text}>{content}{tick}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginBottom: 15,
    width: 350,
    height: 90,
    borderRadius: 10,
    backgroundColor: config.disable,
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 2, // IOS
    shadowRadius: 3, //IOS
    flexDirection: "row",
    alignItems: "center",
  },
  containerDisable: {
    marginTop: 15,
    marginBottom: 15,
    width: 350,
    height: 90,
    borderRadius: 10,
    backgroundColor: config.greenDone,
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 2, // IOS
    shadowRadius: 3, //IOS
    flexDirection: "row",
    alignItems: "center",

  },
  image: {
    width: 50,
    height: 50,
    margin: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 30,
    margin: "auto",
  },
});
