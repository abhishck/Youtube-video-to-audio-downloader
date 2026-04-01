import express from "express";
import cors from "cors";
import downloadRoutes from "./routes/downloadRoutes.js";

const app = express();

app.use(cors({
  origin: "https://youtube-video-to-audio-downloader.vercel.app/"
}));
app.use(express.json());

// Global request logger
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

app.use("/api", downloadRoutes);

export default app;