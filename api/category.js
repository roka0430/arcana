import express from "express";
import fs from "fs";
import { load } from "js-yaml";

const INDEX_FILE = "./data/test/index.yaml";
const CATEGORY_DIR = "./data/test/categories";

const router = express.Router();
const indexData = load(fs.readFileSync(INDEX_FILE, "utf-8"));

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const category = indexData.find((category) => category.id === id);

  if (!category) {
    return res.status(404).json({
      error: "category not found.",
    });
  }

  try {
    const data = load(fs.readFileSync(`${CATEGORY_DIR}/${id}.yaml`, "utf-8"));

    res.json({
      id: category.id,
      name: category.name,
      ...data,
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).json({
        error: "category data not found.",
      });
    }
    return res.status(500).json({
      error: "failed to read category",
    });
  }
});

router.get("/", (req, res) => {
  res.json(indexData);
});

export default router;
