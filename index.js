import express from "express";
import router from "./api/api.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.use("/api", router);

app.listen(PORT);
