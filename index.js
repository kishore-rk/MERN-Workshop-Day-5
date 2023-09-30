const express = require('express')
const app = express()
app.use(express.json())
const mongoose = require('mongoose')
//Schema 
const postSchema = new mongoose.Schema({
    image : String,
    caption : String,
    comments : {
        type :[String],
        default :[]
    },
    likes:{
        type :Number,
        default: 0
    },

})

//model in db
const Post  = mongoose.model('Post', postSchema)
//get post
app.get('/posts', async (req,res) => {
    const post = await Post.find({})
    res.send(post)
})

// get post by id
app.get('/posts/:id', async (req,res) => {
    
    const id = req.params.id;
    //handling the exception - if id not found
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send(`Post not found at the id ${id}`);      
    }
    // if id present in the database
    const rk = await Post.findById(id);          
    res.send(rk)
})

// post a insta_post
app.post('/posts', async(req,res) =>{
    const { image, caption } = req.body;
    const post = new Post({
        image : image,
        caption : caption
    })
    await post.save();
    res.send(post);
})

//put in the insta_post (i.e.) caption
app.put('/posts/:id', async(req,res) =>{
    const id = req.params.id;
    const caption = req.body.caption;
    
    //handling the exception - if id not found
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send(`Post not found at the id ${id}`);      
    }

    // if id present in the database
    const post = await Post.findById(id)
    post.caption =caption;
    const savepost = await post.save();
    res.send(savepost)
    

});

//deleting a post
app.delete('/posts/:id', async(req,res)=>{
    const id = req.params.id;
    //handling the exception - if id not found
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send(`Post not found at the id ${id}`);      
    }

    // if id present in the database
    const post = await Post.findByIdAndDelete(id);
    res.send("Post deleted")

})

// liking a post
app.put('/posts/:id/like', async(req,res)=>{
    const id = req.params.id;
    //handling the exception - if id not found
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send(`Post not found at the id ${id}`);      
    }

    // if id present in the database
    const post = await Post.findById(id)

    post.likes = post.likes+ 1;
    const savepost = await post.save();
    res.send(savepost)

})
//unliking a post
app.put('/posts/:id/unlike', async(req,res)=>{
    const id = req.params.id;
    //handling the exception - if id not found
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send(`Post not found at the id ${id}`);      
    }

    // if id present in the database
    const post = await Post.findById(id)

    if(post.likes > 0){
        post.likes -= 1;
        const savepost = await post.save();
        res.send(savepost)
    }else{
        res.send(`like count is zero by default`);
    }

})
// commenting on a post
app.put('/posts/:id/comments', async(req,res)=>{
    const id = req.params.id;
    //handling the exception - if id not found
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send(`Post not found at the id ${id}`);      
    }

    // if id present in the database
    const comment = req.body.comments;

    const post = await Post.findById(id)

    post.comments.push(comment);
    const savepost = await post.save();
    res.send(savepost)

})
const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    mongoose.connect("mongodb+srv://kishorev2425:HelloWorld321@cluster0.l5urqqz.mongodb.net/").then(() => {
        console.log("Connected to the database!");
    })
})

/* check list
1) create a route for getting all posts - completed
2) create a route for getting a single post - completed
3) create a route for creating a post - completed
4) create a route for updating a post - completed
5) create a route for deleting a post - completed
6) create a route for liking a post - completed
7) create a route for unliking a post - completed
8) create a route for commenting on a post - completed
9) create a route for getting all comments on a post
10) create a route for getting all likes on a post
*/