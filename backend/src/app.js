import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import { initializeSocketIO } from "./utils/socket.js";
import chatRouter from "./routes/chat.route.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import roomRouter from "./routes/room.routes.js";
import messageRouter from "./routes/message.routes.js";
import aiRoomMessageRouter from "./routes/aiRoomChat.routes.js";

const app = express();

const server = createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

app.set("io", io);
const __dirname = dirname(fileURLToPath(import.meta.url));

initializeSocketIO(io);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(cookieParser());

//route declarations
app.use("api/v1/chat-app/users", userRouter);
app.use("api/v1//chat-app/chats", chatRouter);
app.use("api/v1/chat-app/messages", messageRouter);
app.use("/room", roomRouter, aiRoomMessageRouter);

export { server };
