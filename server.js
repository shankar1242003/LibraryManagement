const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/connection"); // <-- Add this line
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static("public"));

// Routes
app.use("/api/books", require("./routes/books"));
app.use("/api/students", require("./routes/students"));
app.use("/api/issues", require("./routes/issues"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
