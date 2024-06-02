import express from "express";
const router = express.Router();
import path from "path";
import { deleteSeries, getEditSeries, getNewSeries, getSeriesOrder, postSeries, putEditSeries, putSeriesOrder } from "../controllers/series";
import isLoggedIn from "../utils/isLoggedIn";

router.get("/new", isLoggedIn, getNewSeries);

router.post("/", isLoggedIn, postSeries);

router
  .route("/order")
  .get(isLoggedIn, getSeriesOrder)
  .put(isLoggedIn, putSeriesOrder);

router.get("/:id/edit", getEditSeries);

router
  .route("/:id")
  .put(isLoggedIn, putEditSeries)
  .delete(isLoggedIn, deleteSeries);

module.exports = router;
