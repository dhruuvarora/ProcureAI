import express from "express";
import dotenv from "dotenv";
import moduleRouter from "./modules";
import { pollInbox } from "./utils/imapReader";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/v1" , moduleRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on:  http://localhost:${PORT}`);
});

setInterval(() => {
  console.log("Checking Gmail inbox...");
  pollInbox();
}, 15000); // every 15 seconds

export default app;