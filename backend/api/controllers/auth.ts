import express, { Request, Response } from "express";
import { RequestWithSession } from "../../definitions";
const bcrypt = require("bcrypt");

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

export const getRegister = (req: Request, res: Response, next: any) => {
  try {
    client.query(`SELECT * FROM "user"`, function (err: string, result: any) {
      const rowCount = result.rows.length;
      // if more than two users - admin and user are registered - redirect
      if (rowCount < 2) {
        res.render("auth/register");
      } else {
        req.flash(
          "error",
          "Sorry, but this is unavailable, contact admin if needed!"
        );
        res.redirect("/login");
      }
    });
  } catch (error) {
    next(error);
  }
};

export const postRegister = async (req: Request, res: Response, next: any) => {
  const { username, password, e_mail } = req.body;
  const hash = await bcrypt.hash(password, 12);
  const queryText = `INSERT INTO "user" (username, password, e_mail) VALUES (
      '${username}', '${hash}', '${e_mail}'
    )`;
  try {
    const q = client.query({ text: queryText });
    req.flash("success", "Registration successful. Now, log in!");
    res.redirect("/login");
  } catch (error) {
    next(error);
  }
};

export const getLogin = (req: Request, res: Response) => {
  res.render("auth/login");
};

export const postLogin = async (req: RequestWithSession, res: Response, next: any) => {
  const { username, password } = req.body;
  try {
    let user = await client.query({
      text: `SELECT * FROM "user" WHERE username = '${username}';`,
    });
    user = user.rows[0];
    if (user.length < 1) {
      req.flash('error', 'Invalid username and/or password!');
      res.redirect("/login")
    } else {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        req.session.user_authenticated = "true";
        req.flash('success', 'Login successful!');
        res.redirect("/menu");
      } else {
        req.flash('error', 'Invalid username and/or password!');
        res.redirect("/login");
      }
    }
  } catch (error) {
    next(error);
  }
};

export const getLogout = (req: RequestWithSession, res: Response) => {
  req.session.user_authenticated = null;
  req.flash('success', 'See you!')
  res.redirect("/login");
};
