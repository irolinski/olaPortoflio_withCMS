import express from "express";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import cors from "cors";
import methodOverride from "method-override";

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
app.use(methodOverride("_method"));

// cors settings

app.use(cors());
app.options("*", cors());

// routes

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/slideshow", async (req, res, next) => {
  const slide = await client.query;
  res.render("slideshow");
});

app.get("/series", async (req, res, next) => {
  try {
    let allSeries = await client.query({ text: `SELECT * FROM "series";` });
    allSeries = allSeries.rows;
    res.render("series/series", { allSeries });
  } catch (error) {
    next(error);
  }
});

app.post("/series", async (req, res, next) => {
  const name = req.body.name;
  const cover = req.body.cover;

  let images = req.body;
  delete images.name;
  delete images.cover;

  const imgAmount: number = Object.keys(images).length;
  const urlArray: string[] = Object.values(images);

  const query_pt1 = `WITH inserted_row AS (
                    INSERT INTO "series" (name, cover)
                    VALUES ('${name}', '${cover}') 
                    RETURNING id 
                  )`;

  const imgeQueries = urlArray.map((imgUrl: string, i) => {
    if (i + 1 < imgAmount) {
      return `, photo_insert_${i} AS (
      INSERT INTO "photo" (url, series_id)
      SELECT '${imgUrl}', id
      FROM inserted_row
      RETURNING id
    )`;
    } else {
      return `
      INSERT INTO "photo" (url, series_id)
      SELECT '${imgUrl}', id
      FROM inserted_row;
      ;`;
    }
  });

  const query_pt2 = imgeQueries.join("");
  const queryText = query_pt1 + query_pt2;

  try {
    const q = await client.query({ text: queryText });
  } catch (error) {
    next(error);
  }

  res.redirect("series");
});

app.get("/series/new", (req, res) => {
  res.render("series/new");
});

// now on to adding actual editing;
app.get("/series/:id/edit", async (req, res, next) => {
  const { id } = req.params;
  let series = await client.query({
    text: `SELECT * FROM "series" WHERE id='${id}';`,
  });
  series = series.rows[0];

  let photos = await client.query({
    text: `SELECT * FROM "photo" WHERE series_id='${id}'`,
  });
  photos = photos.rows;

  res.render("series/edit", { series, photos });
});

app.put("/series/:id", async (req, res, next) => {
  const name = req.body.name;
  const cover = req.body.cover;
  const id = path.basename(req.path);

  let images = req.body;
  delete images.name;
  delete images.cover;

  const imgAmount: number = Object.keys(images).length;
  const urlArray: string[] = Object.values(images);

  console.log(urlArray);

  const query_pt1 = `UPDATE "series"
    SET 
    name = '${name}',
    cover = '${cover}'
    WHERE id = '${id}';

    DELETE FROM "photo"
    WHERE
    series_id = '${id}';
`;

  const imgQueries = urlArray.map((imgUrl: string, i) => {
    return `INSERT INTO "photo" (url, series_id)
      VALUES ('${imgUrl}', '${id}') ; `;
  });

  const query_pt2 = imgQueries.join("");
  const queryText = query_pt1 + query_pt2;

  try {
    const q = await client.query({ text: queryText });
  } catch (error) {
    next(error);
  }

  res.redirect("/series");
});

app.delete("/series/:id", async (req, res, next) => {
  const id = path.basename(req.path);

  const queryText = `DELETE FROM "photo" WHERE series_id = '${id}';
  DELETE FROM "series" WHERE id='${id}';`;

  try {
    const q = await client.query({ text: queryText });
  } catch (error) {
    next(error);
  }

  res.redirect("/series");
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
    next(error);
  }
});

// app.get("/api/profile", async (req, res, next) => {
//   const q = await client.query({ text: `SELECT * FROM PROFILE` });
//   res.send(JSON.stringify(q.rows));
// });

app.get("/api/slideshow", async (req, res, next) => {
  const q = await client.query({ text: `SELECT * FROM "slideshow"` });

  const slideArray = q.rows.map((obj: any) => {
    return obj.slide_url;
  });

  res.send(JSON.stringify(slideArray));
});

app.listen(3000, () =>
  console.log("🚀 Server ready at: http://localhost:3000")
);
