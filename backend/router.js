const { Router } = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const run = require("./gemini-api");

const router = Router();

// Configure Multer to store uploaded files in the 'uploads' directory
const upload = multer({ dest: "uploads/" });

router.post("/prompt-post", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await run(prompt);
    res.json(response);
  } catch (error) {
    console.error("Error in /prompt-post route:", error);
    if (error.response && error.response.data) {
      // Handle specific error types from the Generative AI service
      if (error.response.data.errorDetails) {
        const errorDetails = error.response.data.errorDetails[0];
        if (errorDetails.reason === "API_KEY_INVALID") {
          return res.status(403).json({ error: "Invalid API key" });
        }
      }
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Read the uploaded file
    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Process the file content using the run function
    const response = await run(fileContent);

    // Optionally delete the uploaded file after processing
    // fs.unlinkSync(filePath);

    res.json({ summary: response });
  } catch (error) {
    console.error("Error in /upload route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
