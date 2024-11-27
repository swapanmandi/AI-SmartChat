import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatId: "",
  aiChatId:"",
  messages: [],
  aiMessages: [],
  unreadMessages: [],
  isLoading: false,
  roomInfo: null,
  oneOnOneChatInfo: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatId: (state, action) => {
      state.chatId = action.payload;
    },
    setAiChatId: (state, action)=>{
      state.aiChatId = action.payload
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setAiMessages: (state, action) => {
      state.aiMessages = action.payload;
    },

    setUnreadMessages: (state, action) => {
      state.unreadMessages = action.payload;
    },
    addUnreadMessage: (state, action) => {
      state.unreadMessages.push(action.payload); // Add a single unread message
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setRoomInfo: (state, action) => {
      state.roomInfo = action.payload;
    },
    setOneOnOneChatInfo: (state, action) => {
      state.oneOnOneChatInfo = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload); // Add a single message
    },
    addAiMessage: (state, action) => {
      state.aiMessages.push(action.payload); // Add a single AI message
    },
    deleteMessage: (state, action) => {
      state.messages = state.messages.filter(
        (msg) => msg._id !== action.payload
      ); // Remove a message by ID
    },
  },
});

export const {
  setChatId,
  setAiChatId,
  setMessages,
  setAiMessages,
  setIsLoading,
  setRoomInfo,
  setOneOnOneChatInfo,
  addMessage,
  addAiMessage,
  addUnreadMessage,
  setUnreadMessages,
  deleteMessage,
} = chatSlice.actions;
export default chatSlice.reducer;
