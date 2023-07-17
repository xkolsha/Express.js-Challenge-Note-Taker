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

// Import the existing notes from db.json
let notes = require("./db/db.json");

// Get all notes
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// Add a new note
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();
  notes.push(newNote);
  fs.writeFileSync("./db/db.json", JSON.stringify(notes));
  res.json(newNote);
});

// Start the server
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
