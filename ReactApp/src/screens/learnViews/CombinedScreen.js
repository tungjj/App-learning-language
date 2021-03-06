import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
// import Block
import BlockSchool from "../util/BlockSchool";
import BlockListen from "../util/BlockListen";
import BlockType from "../util/BlockType";
import BlockTopBar from "../util/BlockTopBar";
import SumaryScreen from "./../../sumary/SumaryScreen"
//import config
import config from "../../config";
import { useDispatch, useSelector } from "react-redux";
import { buttonStateSelector, countSelector, indexWord, indexWordSelector, loadingStateSelector, wordsSelector } from "../../redux/selector";
import dataSlice from "../../redux/data.slice";
// indicator
import {MaterialIndicator} from "react-native-indicators";

const newWord = {
  word: "student",
  meaning: "a person who is studying at a university or college",
  type: "noun",
  example: "a graduate student",
  pronunciation: "/ˈstuːdnt/",
  image: "",
  length: 7,
  placeholder: "s-----t",
};

function RenderBlock(props) {
  if( props.indexWord < props.words.length) {
    if (props.state % 3 == 0)
      return <BlockSchool setDisableButton={props.setDisableButton} />;
    if (props.state % 3 == 1)
      return (
        <BlockType
          setDisableButton={props.setDisableButton}
          setTypeWord={props.setTypeWord}
        />
      );
    else return <BlockListen setDisableButton={props.setDisableButton}/>;

  } else {
    return <SumaryScreen/>
  }
}

export default function CombinedScreen(props) {
  // const words =  props.route.params.words;
  const [backOverview, setBackOverview] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  const [typeWord, setTypeWord] = useState({ textInput: ""});

  const dispatch = useDispatch();
  const buttonState= useSelector(buttonStateSelector);
  const count1 = useSelector(countSelector);
  const indexWord = useSelector(indexWordSelector);
  const words = useSelector(wordsSelector);
  const loadingState = useSelector(loadingStateSelector);
  // console.log(words1[indexWord]);
  
  //# initial for start session learn
  // useEffect(()=>{
  //   dispatch(dataSlice.actions.resetCount());
  //   dispatch(dataSlice.actions.resetIndexWord());
  // }, [])
  
  function increaseIndexWord() {
    dispatch(dataSlice.actions.addIndexWord()); 
  }
  async function handleNextButton() {
    if(count1%3 == 1 && typeWord.textInput == words[indexWord].word){
      Alert.alert(
        "Correct",
        `${words[indexWord].word}: ${words[indexWord].meaning}`,
        
          { text: "OK", onPress: () =>{
            // setCount(count1 + 1);
            dispatch(dataSlice.actions.addCount());

            setDisableButton(true);
          } },
      );
    }
    if(count1%3 == 1 && typeWord.textInput != words[indexWord].word) {
      Alert.alert("Incorrect", `${words[indexWord].word}: ${words[indexWord].meaning}`, [
        {
          text: "OK",
          onPress: () => {

            setDisableButton(true);
          },
        },
      ]);
    }
    else {
      // setCount(count1+1);
      await dispatch(dataSlice.actions.addCount());
      setDisableButton(true);
      if((count1)%3 == 2 && (count1) !=0) {
        dispatch(dataSlice.actions.addIndexWord())
      }
    }
  }
  return (
    (indexWord == words.length) ? (
      <SumaryScreen navigation={props.navigation}/>
    ) 
    : (
    <SafeAreaView style={styles.container}>
      <BlockTopBar style={styles.topBar} navigation={props.navigation} />

      <View style={styles.viewBlock}>
        <RenderBlock
          setDisableButton={setDisableButton}
          state={count1}
          words={words}
          setTypeWord={setTypeWord}
          indexWord={indexWord}
        />
      </View>

      <View 
        style={styles.buttonNextView}
        isHidden={backOverview}
      >
        
          <TouchableOpacity
            style={disableButton ? styles.buttonNextDisable : styles.buttonNext}
            disabled={disableButton}
            onPress={() => handleNextButton()}
            isHidden={backOverview}
          >
            <Text style={{ fontSize: 34, padding: 20 }}>Next</Text>
          </TouchableOpacity>
        
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // keyboardVerticalOffset="20"
        style={{ marginTop: 10 }}
      ></KeyboardAvoidingView>
    </SafeAreaView>
  ));
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flex: 2,
  },
  viewBlock: {
    flex: 5,
  },
  buttonNextView: {
    flex: 0.8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonNextDisable: {
    width: 340,
    backgroundColor: config.disable,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: config.backgroundColor,
  },
  buttonNext: {
    width: 340,
    backgroundColor: config.primary,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
  },
});
