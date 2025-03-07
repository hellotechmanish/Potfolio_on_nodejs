const express = require("express");
const app = express();
const path = require("path");
const mailer = require("./controler/mailer");
require('dotenv').config();

// const port = process.env.port;

const PORT = process.env.PORT || 10000;

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (if any)
app.use(express.static(path.join(__dirname, "public")));


// Use mailer routes
app.use("/mail", mailer);

// Render the home page
app.get("/", (req, res) => {
  res.render("frontend/index"); // Assuming the file is named "home.ejs"
});
// Start the server
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

// Use 0.0.0.0 instead of localhost
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});