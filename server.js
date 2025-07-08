const express = require("express");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/download", (req, res) => {
  const videoURL = req.body.videoURL?.trim();
  if (!videoURL || !videoURL.startsWith("http")) {
    return res.send("❌ Please enter a valid YouTube URL.");
  }

  const command = `python3 -m yt_dlp -o "%(title)s.%(ext)s" "${videoURL}"`;
  console.log("▶ Running command:", command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Error:", stderr || error.message);
      return res.send("❌ Failed to download. Please try again.");
    }

    console.log("✅ Output:", stdout);
    res.send("✅ Video download started successfully on the server.");
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
