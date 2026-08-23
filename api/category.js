import express from "express";
import fs from "fs";
import { load, dump } from "js-yaml";

const INDEX_FILE = "./data/test/index.yaml";
const CATEGORY_DIR = "./data/test/categories";

const router = express.Router();

const DEFAULT_CATEGORY_DATA = {
  blank_count: 0,
  subjects: [],
};

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const indexData = load(fs.readFileSync(INDEX_FILE, "utf-8"));
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
      error: "failed to read category.",
    });
  }
});

router.get("/", (req, res) => {
  const indexData = load(fs.readFileSync(INDEX_FILE, "utf-8"));
  res.json(indexData);
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;

  try {
    const indexData = load(fs.readFileSync(INDEX_FILE, "utf-8"));
    const category = indexData.find((category) => category.id === id);

    if (!category) {
      return res.status(404).json({
        error: "category not found.",
      });
    }

    category.name = name;
    fs.writeFileSync(INDEX_FILE, dump(indexData), "utf-8");
  } catch (error) {
    res.status(500).json({
      error: "failed to save category.",
    });
  }
});

router.put("/", (req, res) => {
  const { id, name, ...data } = req.body;
  const path = `${CATEGORY_DIR}/${id}.yaml`;

  if (!fs.existsSync(path)) {
    return res.status(404).json({
      error: "category data not found.",
    });
  }

  try {
    fs.writeFileSync(path, dump(data), "utf-8");

    res.status(200).json({
      message: "category saved.",
    });
  } catch (error) {
    res.status(500).json({
      error: "failed to save category.",
    });
  }
});

router.post("/", (req, res) => {
  const { name } = req.body;

  try {
    const indexData = load(fs.readFileSync(INDEX_FILE, "utf-8"));

    let id = 1;
    while (indexData.some((category) => category.id === id)) id++;

    indexData.push({ id, name });
    fs.writeFileSync(INDEX_FILE, dump(indexData), "utf-8");

    fs.writeFileSync(`${CATEGORY_DIR}/${id}.yaml`, dump(DEFAULT_CATEGORY_DATA), "utf-8");

    res.status(201).json({
      id,
      name,
      ...DEFAULT_CATEGORY_DATA,
    });
  } catch (error) {
    res.status(500).json({
      error: "failed to create category.",
    });
  }
});

export default router;
