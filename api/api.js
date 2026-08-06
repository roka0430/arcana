import express from "express";

const router = express.Router();

router.get("/subjects", (req, res) => {
  res.json([{ id: "math", name: "数学" }]);
});

export default router;
