import React, { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Your Render backend URL
  const API_URL = "https://youtube-video-to-audio-downloader-1.onrender.com";

  // Extract video ID
  const extractVideoId = (url) => {
    const regExp =
      /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Preview thumbnail
  const handlePreview = () => {
    setError("");
    const videoId = extractVideoId(url);

    if (!videoId) {
      setThumbnail("");
      setError("Invalid YouTube link");
      return;
    }

    setThumbnail(`https://img.youtube.com/vi/${videoId}/0.jpg`);
  };

  // Download audio
  const handleDownload = async () => {
    if (!url) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Backend error:", text);
        throw new Error("Download failed");
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("Empty file received");
      }

      // ✅ Get filename from backend
      let filename = "audio.mp3";
      const disposition = response.headers.get("content-disposition");

      if (disposition && disposition.includes("filename=")) {
        filename = disposition
          .split("filename=")[1]
          .replace(/"/g, "");
      }

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(downloadUrl);

    } catch (err) {
      console.error(err);
      setError("Download failed. Check backend setup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-700">
        <h1 className="text-xl font-semibold">YT Music</h1>
      </nav>

      {/* Main */}
      <div className="flex flex-1 flex-col justify-center items-center px-4 text-center">
        
        <h2 className="text-4xl font-bold mb-4">
          YouTube to MP3 Converter
        </h2>

        <p className="text-gray-400 mb-8">
          Paste a link, preview, and download audio
        </p>

        {/* Input */}
        <div className="w-full max-w-xl flex gap-3 bg-gray-900 p-3 rounded-xl border border-gray-700 shadow-lg">
          <input
            type="text"
            placeholder="Paste YouTube link..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
          />

          <button
            onClick={handlePreview}
            className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg font-medium"
          >
            Preview
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 mt-4">{error}</p>
        )}

        {/* Thumbnail + Download */}
        {thumbnail && (
          <div className="mt-8 bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-lg max-w-xl w-full">
            <img
              src={thumbnail}
              alt="Thumbnail"
              className="rounded-lg w-full mb-4"
            />

            <button
              onClick={handleDownload}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg font-medium w-full transition"
            >
              {loading ? "Downloading..." : "Download MP3"}
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-4 border-t border-gray-800">
        © {new Date().getFullYear()} YT Music
      </footer>
    </div>
  );
}