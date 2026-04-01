import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ensureDownloadDir = () => {
  const dir = path.join(__dirname, "../downloads");

  if (!fs.existsSync(dir)) {
    console.log("📁 Creating downloads folder...");
    fs.mkdirSync(dir);
  }

  return dir;
};

export const getLatestFile = (dir) => {
  const files = fs.readdirSync(dir);

  console.log("📂 Files found:", files);

  if (!files.length) {
    throw new Error("No files found");
  }

  const latest = files
    .map(file => ({
      name: file,
      time: fs.statSync(path.join(dir, file)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time)[0];

  return path.join(dir, latest.name);
};