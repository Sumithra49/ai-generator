const { Router } = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const run = require("./gemini-api");

const router = Router();

// Configure Multer to store uploaded files in the 'uploads' directory
const upload = multer({ dest: "uploads/" });

// Route to handle text prompt
router.post("/prompt-post", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Invalid prompt" });
    }
    const response = await run(prompt);
    res.json(response);
  } catch (error) {
    console.error("Error processing /prompt-post request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to handle file uploads
rrouter.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const response = await processFile(file); // Replace with actual file processing logic
    res.json({ summary: response });
  } catch (error) {
    console.error("Error processing /upload request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
