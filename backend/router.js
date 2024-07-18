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
    const response = await run(prompt);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to handle file uploads
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Read the uploaded file
    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Process the file content using the run function
    const response = await run(fileContent);

    // Do not delete the uploaded file
    // fs.unlinkSync(filePath);

    res.json({ summary: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
