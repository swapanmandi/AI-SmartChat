import cookie from "cookie";
import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError.js";
import { User } from "../models/user.model.js";
import { Server, Socket } from "socket.io";

const mountJoinChatEvent = (socket) => {
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`${chatId} is opened`)
  });
};

const mountTypingEvent = (socket) => {
  socket.on("typing", (chatId) => {
    socket.in(chatId).emit("typing", chatId);
  });
};

const mountStoppedTypingEvent = (socket) => {
  socket.on("stoppedTyping", (chatId) => {
    socket.in(chatId).emit("stoppedTyping", chatId);
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
        ApiError(400, "Un-authorized Access! Access Token is Missing.");
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findById(decodedToken._id).select(
        " -password -refreshToken "
      );

      if (!user) {
        ApiError(404, "Un-authorized Access! Access Token is Missing.");
      }

      socket.user = user;


      socket.join(user?._id.toString());
      socket.emit("connected", () =>{
        console.log(`user ${user?.fullName} is connected`)
      });

      mountJoinChatEvent(socket);
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
    }
  });

};

const emitSocketEvent = (req, roomId, event, payload) => {
  req.app.get("io").in(roomId).emit(event, payload);
};

export { emitSocketEvent, initializeSocketIO };
