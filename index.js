import express from "express";
import * as routes from "./api/routes.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

for (const [name, route] of Object.entries(routes)) {
  app.use(`/api/${name}`, route);
}

app.listen(PORT);
