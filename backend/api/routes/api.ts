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


router.get("/series", async (req, res, next) => {
    try {
      const q = await client.query({
        text: `SELECT * FROM "series" ORDER BY sequence;`,
      });
      const seriesData: object[] = await Promise.all(
        q.rows.map(async (r: { id: number; slides: string[] }) => {
          const urlArray: string[] = [];
          const p = await client.query({
            text: `SELECT * FROM "photo" WHERE series_id = $1`,
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
  
  router.get("/slideshow", async (req, res, next) => {
    try {
      const q = await client.query({ text: `SELECT * FROM "slideshow"` });
      const slideArray = q.rows.map((obj: any) => {
        return obj.slide_url;
      });
      res.send(JSON.stringify(slideArray));
    } catch (error) {
      next(error);
    }
  });
  
  router.get("/about-me", async (req, res, next) => {
    try {
      const q = await client.query({
        text: `SELECT * FROM "profile" WHERE role = 'client' `,
      });
      const profileArray = q.rows[0];
      res.send(JSON.stringify(profileArray));
    } catch (error) {
      next(error);
    }
  });
  
  module.exports = router;