const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>`);
});

app.get("/api/persons", (req, res) => {
  res.json({ data: persons });
});

app.get("/api/persons/:id", (req, res) => {
  const personId = Number(req.params.id);
  const person = persons.find((person) => person.id === personId);
  if (!person) {
    return res
      .status(404)
      .json({ error: `Person with id of ${personId} not found` });
  }
  res.json({ data: person });
});

app.post("/api/persons", (req, res) => {
  const newPerson = req.body;
  if (!newPerson.name || !newPerson.number) {
    return res
      .status(400)
      .json({ error: "name or number field cannot be left empty" });
  }
  const nameExist = persons.find(
    (person) => person.name.toLowerCase() === newPerson.name.toLowerCase()
  );
  if (nameExist) {
    return res
      .status(400)
      .json({ error: `${nameExist.name} is already present in the phonebook` });
  }
  const person = {
    ...newPerson,
    id: Math.floor(Math.random() * 300),
  };
  persons = persons.concat(person);
  res.json({ data: person });
});

app.use((req, res, next) => {
  res.status(404).json({ error: "endpoint not defined" });
  next();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
