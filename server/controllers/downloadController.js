import { processDownload } from "../services/downloadService.js";

export const downloadAudio = async (req, res) => {
  try {
    const { url } = req.body;

    console.log("🎯 Controller received URL:", url);

    if (!url) {
      console.log("❌ No URL provided");
      return res.status(400).json({ message: "URL is required" });
    }

    const filePath = await processDownload(url);

    console.log("✅ File ready:", filePath);

    res.download(filePath, (err) => {
      if (err) {
        console.error("❌ Error sending file:", err);
      } else {
        console.log("📤 File sent successfully");
      }
    });

  } catch (error) {
    console.error("🔥 Controller Error:", error);
    res.status(500).json({ message: error.toString() });
  }
};