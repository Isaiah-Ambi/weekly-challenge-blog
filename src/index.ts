import express from 'express';
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import session from 'express-session';
import bcrypt from 'bcrypt';
import ejs from 'ejs';
import qs from 'qs';
import bodyParser from 'body-parser';


import userRoutes from './routes/users';
import blogRoutes from './routes/blog';



const app = express();

app.set('view engine', 'ejs');

app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret'
  }));
  
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const db = () => {
    try {
        mongoose.connect("mongodb://localhost:27017/blog");
        console.log("db connected");
    } catch (error) {
        console.log("error connnecting");
    }

}
db();



// app.get('', (req, res) =>{
//     res.render('index');
// })

app.use('/', blogRoutes);
app.use('/users', userRoutes);

app.listen(3000, () => {
    console.log("app listening on port 3000");
})