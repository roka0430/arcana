import express from "express";
import fs from "fs";
import { load } from "js-yaml";

const router = express.Router();
const questions = load(fs.readFileSync("data/questions.yaml", "utf-8"));

router.get("/subjects", (req, res) => {
  const subjects = questions.map((q) => ({ id: q.id, name: q.subject_name }));
  subjects.sort((a, b) => a.name.localeCompare(b.name));
  res.json(subjects);
});

export default router;
