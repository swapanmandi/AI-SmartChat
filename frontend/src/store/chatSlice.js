import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatId: "",
  aiChatId: "",
  messages: [],
  aiMessages: [],
  unreadMessages: [],
  chats: [],
  isLoading: false,
  oneOnOneChatInfo: null,
  currentChatInfo: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatId: (state, action) => {
      state.chatId = action.payload;
    },
    setAiChatId: (state, action) => {
      state.aiChatId = action.payload;
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
    setCurrentChatInfo: (state, action) => {
      state.currentChatInfo = action.payload;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
  },
});

export const {
  setChatId,
  setAiChatId,
  setMessages,
  setAiMessages,
  setIsLoading,
  setOneOnOneChatInfo,
  addMessage,
  addAiMessage,
  addUnreadMessage,
  setUnreadMessages,
  deleteMessage,
  setCurrentChatInfo,
  setChats,
} = chatSlice.actions;
export default chatSlice.reducer;
