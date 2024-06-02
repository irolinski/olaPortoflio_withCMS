import express from "express";
import { RequestWithSession } from "../../definitions";
import { getAboutMe, getMenu, getSlideshow, putAboutMe, putSlideshow, redirect2Main } from "../controllers/menu";
import isLoggedIn from "../utils/isLoggedIn";
const router = express.Router();


router.get("/", redirect2Main);

router.get("/menu", isLoggedIn, getMenu );

router
  .route("/slideshow")
  .get(isLoggedIn, getSlideshow)
  .put(isLoggedIn, putSlideshow);

router
  .route("/about-me")
  .get(isLoggedIn, getAboutMe)
  .put(isLoggedIn, putAboutMe);

module.exports = router;
