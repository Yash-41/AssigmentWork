const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize Express
const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json()); // Replaces body-parser

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/crudDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Mongoose Schema and Model
const entrySchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String },
  jobTitle: { type: String },
});
const Entry = mongoose.model("Entry", entrySchema);



app.post("/entries", (req, res) => {
  const newEntry = new Entry(req.body);
  newEntry
    .save()
    .then((entry) => res.status(201).json(entry))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.get("/entries", (req, res) => {
  Entry.find()
    .then((entries) => res.status(200).json(entries))
    .catch((err) => res.status(500).json({ error: err.message }));
});


app.put("/entries/:id", (req, res) => {
  Entry.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updatedEntry) => res.status(200).json(updatedEntry))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.delete("/entries/:id", (req, res) => {
  Entry.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).send())
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.listen(PORT);
