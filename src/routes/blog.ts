import { Express, Request, Response, Router, NextFunction } from 'express';
import Blog from '../models/blogModel';
import User from '../models/userModel';
import isAuthenticated from '../middleware/isAuthenticated';

declare module 'express-session' {
    export interface SessionData {
      user: { [key: string]: any };
    }
}

const router = Router();



router.get('/', async (req, res) => {
    try {
        const blogPosts = await Blog.find({});

        res.json(blogPosts);
    } catch (err) {
        res.status(404).send("error");
    }
    
})

router.get('/create', isAuthenticated, async (req, res) => {
    console.log(req.session.user);
    res.render('create');
})

// router.get('/create', (req, res) => {
//     console.log(req.session.user);
//     res.redirect('/users/login')
// })

router.post('/create', async (req, res) => {
    const userId = req.session.user;
    const user = await User.findOne({_id:userId});
    if(user) {
        // console.log(user)
        const post = {title: req.body.title, content:req.body.content,author: user.username}
        console.log(post)
        try {
            const newPost = new Blog(post);
            await newPost.save();
            res.send(newPost);
        } catch (err) {
            res.send("error");
        }
    }
})

router.delete('/delete/:id', async (req, res) => {
    const blogId = req.params.id;

    try {
        await Blog.findByIdAndDelete({_id:blogId});
        // Blog.deleteOne(post);
        res.send("post deleted succefully");
    } catch (err) {
        res.send("something went wrong");
    }
})

export default router;