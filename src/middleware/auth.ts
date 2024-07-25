import { Express, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';
import User from '../models/userModel';


declare module 'express-session' {
    export interface SessionData {
      user: { [key: string]: any };
    }
}

const authenticate = async (req:Request, res:Response, next:NextFunction) => {
    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    const user = await User.findOne({name: req.body.user});
    if (!user) {
        return res.status(400).send("cannot find user");
    }
    try {     
        if(await bcrypt.compare(req.body.pass, user.password)) {
            req.session.regenerate(function (err) {
                if (err) next(err)
                // store user information in session, typically a user id
                req.session.user = user._id
                // save the session before redirection to ensure page
                // load does not happen before session is saved
                req.session.save(function (err) {
                  if (err) return next(err)
                  res.redirect('/pages')
                })
              })
        } else {
            res.send('not allowed');
        }
    } catch (error) {
        res.status(500).send()
    }
}