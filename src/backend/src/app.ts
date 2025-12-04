import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import playlistRoutes from "./routes/playlist.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/playlists", playlistRoutes);

async function start() {
  await connectDB();
  app.listen(8080, () => console.log("Server running on port 8080"));
}

start();