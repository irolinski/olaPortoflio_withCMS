import { RequestWithSession } from "../../definitions";


export default function isLoggedIn(req: RequestWithSession, res, next) {
    if (req.session.user_authenticated !== 'true') {

        return res.redirect('/home');
    }
    next ();
}

