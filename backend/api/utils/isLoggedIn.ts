import { Response } from "express";
import { RequestWithSession } from "../../definitions";

export default function isLoggedIn(req: RequestWithSession, res: Response, next: any) {
  if (req.session.user_authenticated !== "true") {
    return res.redirect("/login");
  }
  next();
}
