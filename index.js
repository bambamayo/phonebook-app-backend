require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Person = require("./models/person");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

//----- GET ALL PERSONS -----
app.get("/api/persons", async (req, res) => {
  let persons;
  try {
    persons = await Person.find({});
  } catch (error) {
    return res.status(404).json({ error: "Could not find persons" });
  }

  res.json({
    message: "Persons fetched successfully",
    data: persons,
  });
});

//----- GET A SINGLE PERSON BY ID -----
app.get("/api/persons/:id", async (req, res) => {
  const personId = req.params.id;
  let person;
  try {
    person = await Person.findById(personId);
  } catch (error) {
    return res.status(500).json({
      message: "could not find person at this time, please try again",
    });
  }

  if (!person) {
    return res
      .status(404)
      .json({ message: "Person with specified id could not be found" });
  }

  res.json({
    message: "person found successfully",
    data: person,
  });
});

//-----CREATE NEW PERSON -------
app.post("/api/persons", async (req, res) => {
  const newPerson = req.body;
  if (!newPerson.name || !newPerson.number) {
    return res
      .status(400)
      .json({ error: "name or number field cannot be left empty" });
  }

  const createdPerson = new Person({
    ...newPerson,
  });
  let person;
  try {
    person = await createdPerson.save();
  } catch (error) {
    return res.status(500).json({ error: "Could not person at this time" });
  }

  res.json({ data: person });
});

//---- EDIT PERSON -----
app.put("/api/persons/:id", async (req, res) => {
  const personId = req.params.id;

  try {
    const person = await Person.findByIdAndUpdate(personId, req.body, {
      new: true,
    });

    if (!person) {
      return res.status(404).json({ message: "Invalid person ID" });
    }

    return res.status(200).json({
      message: "Person updates successfully",
      data: person,
    });
  } catch (error) {
    return res.status(500).json({
      message: "could not delete person, please try again",
    });
  }
});

//----- DELETE PERSON -------
app.delete("/api/persons/:id", async (req, res) => {
  const personId = req.params.id;

  let personToDelete;
  try {
    personToDelete = await Person.findById(personId);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Could not delete person please try again" });
  }

  if (!personToDelete) {
    return res.status(404).json({
      message: "Could not find person with specified id",
    });
  }

  let deletedPerson;
  try {
    deletedPerson = await personToDelete.remove();
  } catch (error) {
    console.log("second");
    return res
      .status(500)
      .json({ message: "Could not delete person please try again" });
  }

  res.status(204).end();
});

app.use((req, res, next) => {
  res.status(404).json({ error: "endpoint not defined" });
  next();
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  )
  .catch((err) => console.log(err));
