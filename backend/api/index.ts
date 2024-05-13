import express from "express";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";

const app = express();
const cors = require("cors");

const { Client } = require("pg");
require("dotenv").config({
  override: true,
});

const client = new Client(process.env.DATABASE_URL);

(async () => {
  await client.connect();
  try {
    const results = await client.query("SELECT NOW()");
  } catch (err) {
    console.error("error executing query:", err);
  }
})();

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/test", async (req, res, next) => {
  const q = await client.query({ text: `SELECT * FROM PHOTOS` });
  res.send(JSON.stringify(q.rows));
});

app.listen(3000, () =>
  console.log("🚀 Server ready at: http://localhost:3000")
);
