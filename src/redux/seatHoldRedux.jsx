// src/redux/seatHoldSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  timeLeft: 120, // 5 phút
  isHolding: false,
  lockedSeats: [],
};

const seatHoldSlice = createSlice({
  name: "seatHold",
  initialState,
  reducers: {
    startHold: (state, action) => {
      state.timeLeft = action.payload || 120; 
      state.isHolding = true;
    },
    tick: (state) => {
      if (state.timeLeft > 0) {
        state.timeLeft -= 1;
      } else {
        state.isHolding = false;
      }
    },
    resetHold: (state) => {
      state.timeLeft = 120;
      state.isHolding = false;
      state.lockedSeats = [];
    },
    lockSeats: (state, action) => {
      state.lockedSeats = action.payload;
    },
  },
});

export const { startHold, tick, resetHold, lockSeats } = seatHoldSlice.actions;
export default seatHoldSlice.reducer;
