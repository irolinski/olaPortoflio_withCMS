import { error } from "console";
import express from "express";
const router = express.Router();
import path from "path";
import { RequestWithSession } from "../../definitions";
import { getLogin, getLogout, getRegister, postLogin, postRegister } from "../controllers/auth";
const bcrypt = require("bcrypt");

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

// session init

const session = require("express-session");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

router.route("/register")
  .get(getRegister)
  .post(postRegister);


router.route("/login")
  .get(getLogin)
  .post(postLogin);

router.get("/logout", getLogout)

module.exports = router;
