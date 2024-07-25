import express,{ Express, Request, Response, Router, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from '../models/userModel';
import Bodyparser from 'body-parser';
import bcrypt from 'bcrypt';
import session from 'express-session';
import bodyParser from 'body-parser';

function isAuthenticated (req:Request, res:Response, next:NextFunction) {
    if (req.session.user){ 
        next();
    }
    else {
        res.redirect('/login')
    }
}


declare module 'express-session' {
    export interface SessionData {
      user: { [key: string]: any };
    }
}
  
const app = express();
const router = Router();


// app.use(express.bodyParser);
// registration route
router.get('/register', (req, res) => {
    res.render('register');
})

router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = {username: req.body.name, email:req.body.email, password:hashedPassword};
        const newUser = new User(user);
        await newUser.save();
        // res.status(201).send()
        res.status(201).send({message: "User added successfully"});
    } catch (error) {
        res.status(500).send();
    }

})

router.get('/login', (req, res) => {
    res.render('login');
})
router.post('/login', express.urlencoded({ extended: false }), async (req:Request, res:Response, next:NextFunction) => {
    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    // console.log(req.body);
    const user = await User.findOne({email: req.body.email});
    // console.log(user);
    if (!user) {
        return res.status(400).send("cannot find user");
    }
    try {     
        if(await bcrypt.compare(req.body.password, user.password)) {
            req.session.regenerate(function (err) {
                if (err) {
                    console.log("wrong password");
                    next(err)
                }
                // store user information in session, typically a user id
                req.session.user = user._id
                // save the session before redirection to ensure page
                // load does not happen before session is saved
                req.session.save(function (err) {
                  if (err) return next(err)
                  console.log("login successfull");
                  res.redirect('/create');
                })
              })
        } else {
            res.send('not allowed');
        }
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/', async (req, res) => {
    const users = await User.find({});
    res.json(users);
})

router.delete('/deleteall', async(req, res) => {
    try {
        await User.deleteMany({});
        res.send("user's deleted");
    } catch(err) {
        res.send("something went wrong");
    }
})

export default router;