import express from "express";
import cors from "cors";
import { generateData } from "./dataGenerator.js";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/generate", (req, res) => {
  const { seed, page, region, errorCount } = req.query;
  const data = generateData(seed, parseInt(page), region, parseInt(errorCount));
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
