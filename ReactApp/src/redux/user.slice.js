import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default createSlice({
  name: 'user',
  initialState: {
    loginState: false,
    timeout: null,
    dataReport: [],
    learnedLesson: [],
  },
  reducers: {
    changeLoginState: (state) => {
      state.loginState = !state.loginState;
    },
    setTimeout: (state, action) => {state.timeout = action.payload; },
    // addLessons: (state, action) => {state.lessons = action.payload},

    setDataReview: (state, action) => { state.dataReport = action.payload; },
    setLearnedLesson: (state, action) => { state.learnedLesson = action.payload }

    // clearJwt: state => {
    //   state.jwt = null;
    // },
    // incrementByAmount: (state, action) => {
    //   state.jwt += action.payload
    // }
  }
})
