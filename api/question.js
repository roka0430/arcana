import express from "express";
import { load } from "js-yaml";
import fs from "fs";

const router = express.Router();
const questions = load(fs.readFileSync("./data/questions.yaml", "utf-8"));

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const question = questions.find((q) => q.id === parseInt(id));

  if (!question) {
    return res.status(404).json({
      error: "id not found",
    });
  }

  res.json(question);
});

router.get("/", (req, res) => {
  res.json(questions);
});

export default router;
