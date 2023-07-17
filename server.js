// Import necessary packages
const express = require("express"); // Import the Express.js framework
const path = require("path"); // Import the path module
const fs = require("fs"); // Import the file system module
const { v4: uuidv4 } = require("uuid"); // Import the UUID package for generating unique IDs

// Create an instance of an Express.js app
const app = express();

// Use express middleware to parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "./public")));

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

// Delete a note
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const noteIndex = notes.findIndex((note) => note.id === id);
  if (noteIndex !== -1) {
    notes.splice(noteIndex, 1);
    fs.writeFileSync("./db/db.json", JSON.stringify(notes));
    res.json({ message: `Deleted note with id ${id}` });
  } else {
    res.status(404).json({ message: `No note found with id ${id}` });
  }
});

// Send the notes.html file when '/notes' is requested
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Send the index.html file for all other requests
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Define the port the server should listen on
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
