import express from "express";
import path from "path";
import routes from "./api/routes.js";

const app = express();
const PORT = 3002;

app.use(express.json());
app.use(express.static("public"));
app.use("/api", routes);

app.get("/study/:id", (req, res) => {
  res.sendFile(path.resolve("public/study/index.html"));
});

app.listen(PORT);
