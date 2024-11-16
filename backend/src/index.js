import dotenv from "dotenv";
import { server } from "./app.js";
import connecDB from "./db/index.js"

dotenv.config({
  path: "./.env",
});

connecDB();

server.listen(8000 || process.env.PORT, () => {
  console.log(`Server is running on PORT: ${8000 || process.env.PORT}`);
})
