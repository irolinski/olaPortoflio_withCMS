import express from "express";
const router = express.Router();
import path from "path";

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

router.post("/", async (req, res, next) => {
  let name = req.body.name;
  if (name.includes(`'`)) {
    name = name.replaceAll(`'`, `''`);
  }

  const cover = req.body.cover;

  let images = req.body;
  delete images.name;
  delete images.cover;

  const imgAmount: number = Object.keys(images).length;
  const urlArray: string[] = Object.values(images);

  const query_pt1 = `WITH inserted_row AS (
    INSERT INTO "series" (name, cover, sequence)
    VALUES ('${name}', '${cover}', nextval('series_order') )
    RETURNING id 
    )`;

  const imgeQueries = urlArray.map((imgUrl: string, i: number) => {
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

  res.redirect("/menu");
});

router.get("/new", (req, res) => {
  res.render("series/new");
});

router
  .route("/order")
  .get(async (req, res, next) => {
    try {
      let allSeries = await client.query({
        text: `SELECT * FROM "series" ORDER BY sequence;`,
      });
      allSeries = allSeries.rows;
      res.render("series/order", { allSeries });
    } catch (error) {
      next(error);
    }
  })
  .put(async (req, res, next) => {
    const orderedIds = req.body.orderedIds.split(`,`);
    const queryText = orderedIds
      .map((id: number, o: number) => {
        return `UPDATE "series" SET sequence = ${o + 1} WHERE id = '${id}'; `;
      })
      .join("");
    try {
      const q = await client.query({ text: queryText });
      res.redirect("/menu");
    } catch (error) {
      next(error);
    }
  });

router.get("/:id/edit", async (req, res, next) => {
  const { id } = req.params;
  try {
    let series = await client.query({
      text: `SELECT * FROM "series" WHERE id='${id}';`,
    });
    series = series.rows[0];

    let photos = await client.query({
      text: `SELECT * FROM "photo" WHERE series_id='${id}'`,
    });
    photos = photos.rows;

    res.render("series/edit", { series, photos });
  } catch (error) {
    next(error);
  }
});

router
  .route("/:id")
  .put(async (req, res, next) => {
    let name = req.body.name;
    if (name.includes(`'`)) {
      name = name.replaceAll(`'`, `''`);
    }
    const cover = req.body.cover;
    const id = path.basename(req.path);

    let images = req.body;
    delete images.name;
    delete images.cover;
    delete images.sequence;

    const imgAmount: number = Object.keys(images).length;
    const urlArray: string[] = Object.values(images);

    const query_pt1 = `UPDATE "series"
    SET 
    name = '${name}',
    cover = '${cover}'
    WHERE id = '${id}';
  
    DELETE FROM "photo"
    WHERE
    series_id = '${id}';
    `;

    const imgQueries = urlArray.map((imgUrl: string, i: number) => {
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

    res.redirect("/menu");
  })
  .delete(async (req, res, next) => {
    const id = path.basename(req.path);

    const queryText = `DELETE FROM "photo" WHERE series_id = '${id}';
    DELETE FROM "series" WHERE id='${id}';`;

    try {
      const q = await client.query({ text: queryText });
    } catch (error) {
      next(error);
    }

    res.redirect("/menu");
  });

module.exports = router;
