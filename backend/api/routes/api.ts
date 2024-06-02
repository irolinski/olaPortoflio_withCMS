import express from "express";
import { getAboutMeApi, getSeriesApi, getSlideshowApi } from "../controllers/api";
const router = express.Router();



router.get("/series", getSeriesApi);
  
  router.get("/slideshow", getSlideshowApi);
  
  router.get("/about-me", getAboutMeApi );
  
  module.exports = router;