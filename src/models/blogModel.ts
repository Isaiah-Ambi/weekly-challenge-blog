import { Schema, model } from 'mongoose';


// blog model
const blogSchema = new Schema ({
    title: {type: String, required: true},
    content:{type: String, required: true},
    created:{type:Date, default: Date.now},
    modified:{type:Date, default: Date.now},
    author:{type:String},
    comments:[{username:String,posted:Date,content:String}],
    meta: {
        votes: Number,
        favs: Number
    }
});

const Blog = model("blog", blogSchema)

export default Blog;