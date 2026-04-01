import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { getLatestFile, ensureDownloadDir } from "../utils/fileHelper.js";

export const processDownload = (url) => {
  return new Promise((resolve, reject) => {
    const downloadsDir = ensureDownloadDir();

    const outputTemplate = path.join(downloadsDir, "%(title)s.%(ext)s");

    const command = `python -m yt_dlp -x --audio-format mp3 -o "${outputTemplate}" "${url}"`;

    console.log("🚀 Running command:", command);

    exec(command, { shell: true }, (error, stdout, stderr) => {
      console.log("STDOUT:", stdout);
      console.log("STDERR:", stderr);

      if (error) {
        return reject(stderr || error.message);
      }

      try {
        let filePath = getLatestFile(downloadsDir);

        console.log("📄 Original file:", filePath);

        // 🔥 Rename to first 3 words
        const ext = path.extname(filePath);
        const baseName = path.basename(filePath, ext);

        const words = baseName.split(" ").slice(0, 3).join(" ");

        const newFilePath = path.join(downloadsDir, `${words}${ext}`);

        fs.renameSync(filePath, newFilePath);

        console.log("✏️ Renamed to:", newFilePath);

        resolve(newFilePath);

      } catch (err) {
        reject(err.message);
      }
    });
  });
};