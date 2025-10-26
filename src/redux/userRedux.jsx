import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    // isFetching: false,
    error: false,
    mesError: '',
    onlineUsers: [],
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
      state.error = false;
      state.mesError = '';
    },
    loginFailure: (state, action) => {
      state.isFetching = false;
      state.mesError = action.payload
      state.error = true;
    },
    logoutSucess: (state) => {
      state.currentUser = null
    },
    updateUser: (state, action) => {
      state.currentUser.user = { ...state.currentUser.user, ...action.payload }
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logoutSucess, updateUser, setOnlineUsers } = userSlice.actions;
export default userSlice.reducer;