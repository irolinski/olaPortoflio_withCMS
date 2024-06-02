
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
        console.log("Row count: %d", rowCount);

        // if more than two users - admin and user are registered - throw err
        if (rowCount < 2) {
          res.render("auth/register");
        } else {
          throw new Error("Forbidden");
        }
      });
    } catch (error) {
      next(error);
    }
}
  
export const postRegister = async (req: Request, res: Response, next: any) => {
    const { username, password, e_mail } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const queryText = `INSERT INTO "user" (username, password, e_mail) VALUES (
      '${username}', '${hash}', '${e_mail}'
    )`;
    try {
      const q = client.query({ text: queryText });
    } catch (error) {
      next(error);
    }
}
  
export const getLogin = (req: Request, res: Response) => {
    res.render("auth/login");
}
  
export const postLogin = async (req: RequestWithSession, res: Response, next: any) => {
    const { username, password } = req.body;
    try {
      let user = await client.query({
        text: `SELECT * FROM "user" WHERE username = '${username}';`,
      });
      user = user.rows[0];
      if (user.length < 1) {
        throw new Error("Invalid username and/or password");
      } else {
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
          console.log("yes");
          req.session.user_authenticated = 'true'; 
          res.redirect('/');
        } else {
          // throw new Error("Invalid username and/or password");
          res.redirect("login");
        }
      }
    } catch (error) {
      next(error);
    }
}
  

export const getLogout = (req: RequestWithSession, res: Response) => {
    req.session.user_authenticated = null; 
    res.redirect("/login")
  }