import express from "express";
const router = express.Router();
import path from "path";
import { deleteSeries, getEditSeries, getSeriesOrder, postSeries, putEditSeries, putSeriesOrder } from "../controllers/series";


router.post("/", postSeries);

router.get("/new", (req, res) => {
  res.render("series/new");
});

router
  .route("/order")
  .get(getSeriesOrder)
  .put(putSeriesOrder);

router.get("/:id/edit", getEditSeries);

router
  .route("/:id")
  .put(putEditSeries)
  .delete(deleteSeries);

module.exports = router;
