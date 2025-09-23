import { createSlice } from "@reduxjs/toolkit";

const message = createSlice({
  name: "message",
  initialState: {
    messages: [],
    users: [],
    selectedUser: null,
  },
  reducers: {
    getUserSidebarAdmin: (state, action) => {
      state.users = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    getMessage: (state, action) => {
      state.messages = action.payload;
    },
    sendMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setNewMessages: (state, action) => {
      state.messages.push(action.payload);
    }
  },
});

export const { getMessage, sendMessage, getUserSidebarAdmin, setSelectedUser, setNewMessages } = message.actions;
export default message.reducer;