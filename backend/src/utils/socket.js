import cookie from "cookie";
import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError.js";
import { User } from "../models/user.model.js";

const mountJoinChatEvent = (socket) => {
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`${chatId} is opened a chat`);
  });
};

const mountJoinAiChatEvent = (socket) => {
  socket.on("joinAiChat", (aiChatId) => {
    socket.join(aiChatId);
    console.log(`${aiChatId} is opened for ai chat`);
  });
};

const mountTypingEvent = (socket) => {
  socket.on("startTyping", (chatId) => {
    // Emit the "typing" event to the specific chat room
    socket.in(chatId).emit("messageTyping", chatId);
    console.log(chatId, "is typing in chat..");
  });
};

const mountStoppedTypingEvent = (socket) => {
  socket.on("stoppedTyping", (chatId) => {
    // Emit the "stoppedTyping" event to the specific chat room
    socket.to(chatId).emit("stoppedTyping", chatId);
    console.log("stopped typing in chat", chatId);
  });
};

const initializeSocketIO = (io) => {
  return io.on("connection", async (socket) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

      let token = cookies?.accessToken;

      if (!token) {
        token = socket.handshake.auth?.token;
      }

      if (!token) {
        throw new ApiError(
          400,
          "Un-authorized Access! Access Token is Missing."
        );
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findById(decodedToken._id).select(
        " -password -refreshToken "
      );

      if (!user) {
        throw new ApiError(
          404,
          "Un-authorized Access! Access Token is Missing."
        );
      }

      socket.user = user;

      socket.join(user?._id.toString());
      socket.emit(
        "connected",
        console.log(`user ${user?.fullName} is connected`)
      );

      mountJoinChatEvent(socket);
      mountJoinAiChatEvent(socket);
      mountTypingEvent(socket);
      mountStoppedTypingEvent(socket);

      socket.on("disconnect", () => {
        console.log("User has disconnected.");

        if (socket.user?._id) {
          socket.leave(socket.user?._id);
        }
      });
    } catch (error) {
      socket.emit(
        "SocketError",
        error?.message || "Error while connect to socket."
      );
      return;
    }
  });
};

const emitSocketEvent = (req, userId, event, payload) => {
  req.app.get("io").in(userId).emit(event, payload);
};

export { emitSocketEvent, initializeSocketIO };
