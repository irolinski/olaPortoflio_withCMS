import express from "express";
import { RequestWithSession } from "../../definitions";
import { getAboutMe, getMenu, getSlideshow, putAboutMe, putSlideshow, redirect2Main } from "../controllers/menu";
const router = express.Router();


router.get("/", redirect2Main);

router.get("/menu", getMenu );

router
  .route("/slideshow")
  .get(getSlideshow)
  .put(putSlideshow);

router
  .route("/about-me")
  .get(getAboutMe)
  .put(putAboutMe);

module.exports = router;
