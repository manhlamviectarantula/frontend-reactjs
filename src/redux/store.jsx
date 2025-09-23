import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userRedux";
import orderReducer from "./orderRedux";
import messageReducer from "./messageRedux";
import seatHoldReducer from "./seatHoldRedux"

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  version: 2,
  storage,
};

const appReducer = combineReducers({
  user: userReducer,
  order: orderReducer,
  message: messageReducer,
  seatHold: seatHoldReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'user/logoutSucess') {
    storage.removeItem('persist:root'); // Xoá localStorage persist
    return appReducer(undefined, action); // Reset toàn bộ state
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);
