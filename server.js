const express = require("express");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/download", (req, res) => {
  const videoURL = req.body.videoURL;

  if (!videoURL) {
    return res.send("❌ Please enter a valid YouTube URL.");
  }

  // Correct yt-dlp command for Linux (Render)
  const command = `yt-dlp -o "%(title)s.%(ext)s" ${videoURL}`;
  console.log("▶ Running command:", command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Error:", error);
      return res.send("❌ Failed to download. Please try again.");
    }

    console.log("✅ Video downloaded successfully!");
    res.send("✅ Video download started successfully on the server.");
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
