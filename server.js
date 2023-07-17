// Import necessary packages
const express = require("express"); // Import the Express.js framework
const path = require("path"); // Import the path module
const fs = require("fs"); // Import the file system module
const { v4: uuidv4 } = require("uuid"); // Import the UUID package for generating unique IDs

// Create an instance of an Express.js app
const app = express();

// Use express middleware to parse incoming request bodies
app.use(express.json()); // Parse JSON data in the request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data in the request body

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "./public")));

// Import the existing notes from db.json
let notes = require("./db/db.json");

// Get all notes
app.get("/api/notes", (req, res) => {
  res.json(notes); // Send the 'notes' array as a JSON response
});

// Add a new note
app.post("/api/notes", (req, res) => {
  const newNote = req.body; // Get the new note data from the request body
  newNote.id = uuidv4(); // Generate a unique ID for the note using UUID
  notes.push(newNote); // Add the new note to the 'notes' array
  fs.writeFileSync("./db/db.json", JSON.stringify(notes)); // Write the updated 'notes' array to db.json file
  res.json(newNote); // Send the newly created note as a JSON response
});

// Delete a note
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id; // Get the ID of the note to be deleted from the request parameters
  const noteIndex = notes.findIndex((note) => note.id === id); // Find the index of the note with the matching ID
  if (noteIndex !== -1) {
    notes.splice(noteIndex, 1); // Remove the note from the 'notes' array
    fs.writeFileSync("./db/db.json", JSON.stringify(notes)); // Write the updated 'notes' array to db.json file
    res.json({ message: `Deleted note with id ${id}` }); // Send a JSON response indicating successful deletion
  } else {
    res.status(404).json({ message: `No note found with id ${id}` }); // Send a JSON response indicating note not found
  }
});

// Send the notes.html file when '/notes' is requested
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html")); // Send the 'notes.html' file
});

// Send the index.html file for all other requests
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html")); // Send the 'index.html' file
});

// Define the port the server should listen on
const PORT = process.env.PORT || 3000; // Use the PORT environment variable if available, or default to port 3000

// Start the server
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
