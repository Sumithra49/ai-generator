const express = require("express");
const cors = require("cors");

const router = require("./router");
require("dotenv/config");
const app = express();
app.use(express.json());
app.use(cors());
const port = 5000;
require("./gemini-api");
app.use("/api", router);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
