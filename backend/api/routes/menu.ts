import express from "express";
const router = express.Router();

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

router.get("/", (req, res, next) => {
  res.redirect("/menu");
});

router.get("/menu", async (req, res, next) => {
  try {
    let allSeries = await client.query({
      text: `SELECT * FROM "series" ORDER BY sequence;`,
    });
    allSeries = allSeries.rows;
    res.render("series", { allSeries });
  } catch (error) {
    next(error);
  }
});

router
  .route("/slideshow")
  .get(async (req, res, next) => {
    try {
      const q = await client.query({ text: `SELECT * FROM "slideshow"` });
      const slides = q.rows;
      res.render("slideshow", { slides });
    } catch (error) {
      next(error);
    }
  })
  .put(async (req, res, next) => {
    const images = req.body;
    const urlArray: string[] = Object.values(images);
    const imgAmount = Object.keys(urlArray).length;

    const query_pt1 = `DELETE FROM "slideshow"; `;

    const imgQueries = urlArray.map((imgUrl: string) => {
      return `INSERT INTO "slideshow" (slide_url)
        VALUES ('${imgUrl}'); `;
    });

    const query_pt2 = imgQueries.join("");
    const queryText = query_pt1 + query_pt2;

    try {
      const q = await client.query({ text: queryText });
    } catch (error) {
      next(error);
    }
    res.redirect("/menu");
  });

router
  .route("/about-me")
  .get(async (req, res, next) => {
    try {
      let abt = await client.query({
        text: `SELECT * FROM "profile" WHERE role = 'client'`,
      });
      abt = abt.rows[0];
      res.render("about-me", { abt });
    } catch (error) {
      next(error);
    }
  })
  .put(async (req, res, next) => {
    const { profile_picture_url, phone_num, e_mail, instagram_url } = req.body;
    let { description } = req.body;
    if (description.includes(`'`)) {
      description = description.replaceAll(`'`, `''`);
    }
    const queryText = `UPDATE "profile" SET profile_picture_url = '${profile_picture_url}', description = '${description}', phone_num = '${phone_num}', e_mail = '${e_mail}',  instagram_url = '${instagram_url}' WHERE role = 'client';`;
    try {
      const q = await client.query({ text: queryText });
      res.redirect("/menu");
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
