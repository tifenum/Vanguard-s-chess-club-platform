import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors"; // Import CORS middleware

dotenv.config();

import apiRouter from "./api";

const app = express();
app.use(cors());

app.use(express.json());

app.use("/static",
    express.static("dist/public"),
    express.static("src/public")
);

app.use("/api", apiRouter);

app.get("/", async (req, res) => {
    res.sendFile(path.resolve("src/public/pages/report/index1.html"));
});
app.get("/chessusername", async (req, res) => {
    res.sendFile(path.resolve("src/public/pages/report/index.html"));
});
app.get("/privacy", async (req, res) => {
    res.sendFile(path.resolve("src/public/pages/privacy/index.html"));
});

app.listen(4000, () => {
    console.log("Server running on port 4000.");
});
