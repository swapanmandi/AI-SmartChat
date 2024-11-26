import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice.js";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
