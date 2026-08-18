import express from "express";
import path from "path";
import routes from "./api/routes.js";

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use("/api", routes);

app.get("/study/:id", (req, res) => {
  res.sendFile(path.resolve("public/study/index.html"));
});

app.get("/edit/:id", (req, res) => {
  res.sendFile(path.resolve("public/edit/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
