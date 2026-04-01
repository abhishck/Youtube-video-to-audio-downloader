import { exec } from "child_process";
import path from "path";
import { getLatestFile, ensureDownloadDir } from "../utils/fileHelper.js";

export const processDownload = (url) => {
  return new Promise((resolve, reject) => {
    console.log("⚙️ Service started");

    const downloadsDir = ensureDownloadDir();
    console.log("📁 Download folder:", downloadsDir);

    const outputTemplate = path.join(downloadsDir, "%(title).50s.%(ext)s");

    const command = `python -m yt_dlp -x --audio-format mp3 -o "${outputTemplate}" "${url}"`;

    console.log("🚀 Running command:", command);

    exec(command, { shell: true }, (error, stdout, stderr) => {
      console.log("📤 STDOUT:", stdout);
      console.log("⚠️ STDERR:", stderr);

      if (error) {
        console.error("❌ Exec Error:", error);
        return reject(stderr || error.message);
      }

      try {
        const latestFile = getLatestFile(downloadsDir);

        console.log("📄 Latest file:", latestFile);

        if (!latestFile) {
          return reject("No file downloaded");
        }

        resolve(latestFile);
      } catch (err) {
        console.error("❌ File error:", err);
        reject(err.message);
      }
    });
  });
};