import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import config from "../../config";
// icon
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { indexWordSelector, wordsSelector } from "../../redux/selector";

export function ConvertWord(word) {
  if(word.meaning) {
    return word;
  } else {
    return {
      learnedword_id: word.learnedword_id,
      example: word.word_example,
      id: word.word_id,
      lessonId: word.word_lessonId,
      linkAudio: word.word_linkAudio,
      linkImage: word.word_linkImage,
      meaning: word.word_meaning,
      numberCharacter: word.word_numberCharacter,
      placeholder: word.word_placeholder,
      pronunciation: word.word_pronunciation,
      type: word.word_type,
      word: word.word_word,
    }
  }
}

export default function BlockType(props) {
  const [modalVisible, setModalVisible] = useState(false);

  const words = useSelector(wordsSelector);
  const indexWord = useSelector(indexWordSelector);
  const word = ConvertWord(words[indexWord]);

  const createBackButtonAlert = () =>
    Alert.alert("Are you sure?", "If you quit, the process will be deleted.", [
      {
        text: "Cancel",
        // onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => navigation.navigate("Home") },
    ]);

  const keyboardVerticalOffset = Platform.OS === "ios" ? 40 : 0;
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Please fill in the word</Text>
      <Text style={styles.meaning}>{word.meaning}</Text>
      {/* <ScrollView style={{flex: 5}}> */}
      <View style={styles.textInput}>
        <TextInput
          editable
          maxLength={word.numberCharacter}
          style={styles.input}
          isFocused="true"
          placeholder={word.placeholder}
          keyboardType="default"
          onChangeText={(textInput) => {
            const numberCharacter = word.numberCharacter;
            if (textInput.length == numberCharacter) {
              props.setDisableButton(false);
              props.setTypeWord({ textInput: textInput.toLowerCase() });
            } else props.setDisableButton(true);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // justifyContent: "flex-end",
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    flex: 1,
  },
  header: {
    flex: 0.6,
    fontSize: 20,
    textAlign: "center",
  },
  meaning: {
    flex: 2,
    fontSize: 30,
    textAlign: "center",
  },
  textInput: {
    flex: 5,
  },
  buttonNextView: {
    flex: 1.8,
    marginBottom: 50,
    // marginBottom: 'auto',
    alignItems: "center",
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

  process: {
    flex: 2,
    fontSize: 40,
    textAlign: "center",
    marginRight: 20,
  },
  input: {
    borderWidth: 1,
    width: 300,
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 30,
  },
});
