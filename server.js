// Import necessary packages
const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Create an instance of an Express.js app
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "./public")));

// Define the port the server should listen on
const PORT = process.env.PORT || 3000;

// Get all notes
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// Start the server
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
