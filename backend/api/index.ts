import express from "express";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import cors from "cors";

const app = express();

// postgress initalization

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

// ejs set-up
const ejsMate = require("ejs-mate");

app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");

// express settings

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

// cors settings

app.use(cors());
app.options("*", cors());

// routes

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/slideshow", async (req, res, next) => {
  res.render("slideshow");
});

app.get("/series", (req, res) => {
  res.render("series");
});

app.post("/series", async (req, res) => {
  const name = req.body.name;
  const cover = req.body.cover;

  let images = req.body;
  delete images.name;
  delete images.cover;

  const imgAmount = Object.keys(images).length;
  const urlArray = Object.values(images);

  let queryText = `WITH inserted_row AS (
                    INSERT INTO "series" (name, cover) VALUES ('${name}', '${cover}') RETURNING id 
                  )`;

  let imgs = urlArray.map((i: any) => {
    return `INSERT INTO "photo" (url, series_id) SELECT '${i}', id 
    FROM inserted_row; `;
  });

  const imagesQuery = imgs.join("");

  queryText += imagesQuery;

  console.log(queryText);

  const q = await client.query({ text: queryText });
});

app.get("/series/new", (req, res) => {
  res.render("series/new");
});

app.get("/series/:id/edit", (req, res) => {
  res.render("series/series");
});

app.get("/about-me", async (req, res, next) => {
  res.render("series/about-me");
});

// api w/ json for the front-end

app.get("/api/series", async (req, res, next) => {
  try {
    const q = await client.query({ text: `SELECT * FROM "series";` });
    const seriesData: object[] = await Promise.all(
      q.rows.map(async (r: { id: number; slides: string[] }) => {
        const urlArray: string[] = [];
        const p = await client.query({
          text: `select * from "photo" where series_id = $1`,
          values: [r.id],
        });
        p.rows.map((u: { url: string }) => {
          urlArray.push(u.url);
        });
        r.slides = urlArray;
        return r;
      })
    );
    res.send(seriesData);
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
});

app.get("/api/profile", async (req, res, next) => {
  const q = await client.query({ text: `SELECT * FROM PROFILE` });
  res.send(JSON.stringify(q.rows));
});

app.listen(3000, () =>
  console.log("🚀 Server ready at: http://localhost:3000")
);
