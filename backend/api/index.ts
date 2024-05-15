import express from "express";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import cors from "cors";

const app = express();


// https://community.render.com/t/error-after-deployment-has-been-blocked-by-cors-policy/6439


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

app.use(cors(
  //{ origin: "https://photoportfolio-cms-demo-nmy4lc8nd-igs-projects-d8fb5f34.vercel.app/"}
))
app.options('*', cors())


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/series", async (req, res, next) => {
  const q = await client.query({ text: `SELECT * FROM SERIES` });
  res.send(JSON.stringify(q.rows));
});

app.get("/api/profile", async (req, res, next) => {
  const q = await client.query({ text: `SELECT * FROM PROFILE` });
  res.send(JSON.stringify(q.rows))
})

app.listen(3000, () =>
  console.log("🚀 Server ready at: http://localhost:3000")
);
