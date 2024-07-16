import express from "express";
import "express-async-errors";
import morgan from "morgan";
import Joi from "joi";

const app = express();
const port = 3000;

app.use(morgan("dev"));
app.use(express.json());

type Planet = {
  id: number;
  name: string;
};

type Planets = Planet[];

let planets: Planets = [
  { id: 1, name: "Earth" },
  { id: 2, name: "Mars" },
];

app.get("/api/planets", (req, res) => {
  res.status(200).json(planets);
});

app.get("/api/planets/:id", (req, res) => {
  const { id } = req.params;
  const planet = planets.find((p) => p.id === Number(id));
  if (planet) {
    res.status(200).json(planet);
  } else {
    res.status(404).json({ msg: "Planet not found" });
  }
});

const planetSchema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
});

app.post("/api/planets", (req, res) => {
  const { error, value } = planetSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  } else {
    planets = [...planets, value];

    res
      .status(201)
      .json({ msg: "The planet has been created!", planet: value });
  }
});

app.put("/api/planets/:id", (req, res) => {
  const { id } = req.params;
  const { error, value } = Joi.object({
    name: Joi.string().required(),
  }).validate(req.body);

  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  let planet = planets.find((p) => p.id === Number(id));
  if (planet) {
    planet.name = value.name;
    res.status(200).json({ msg: "The planet has been updated!", planet });
  } else {
    res.status(404).json({ msg: "Planet not found" });
  }
});

app.delete("/api/planets/:id", (req, res) => {
  const { id } = req.params;
  const initialLength = planets.length;
  planets = planets.filter((p) => p.id !== Number(id));

  if (planets.length < initialLength) {
    res.status(200).json({ msg: "The planet has been deleted!" });
  } else {
    res.status(404).json({ msg: "Planet not found" });
  }
});

app.listen(port, () => {
  console.log(`Express app listening on http://localhost:${port}`);
});
