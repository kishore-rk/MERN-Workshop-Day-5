const express = require('express')
const app = express()
app.use(express.json())

require('dotenv').config();
const mongoose = require('mongoose')

const port = 3000;
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
app.put('/posts/:id/comment', async(req,res)=>{
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
//route for getting all comments on a post
app.get('/posts/:id/comments', async (req,res) => {
    
    const id = req.params.id;
    //handling the exception - if id not found
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send(`Post not found at the id ${id}`);      
    }
    // if id present in the database
    const rk = await Post.findById(id);  
    const comment_id = rk.comments        
    res.send(comment_id)
})
//route for getting all likes on a post
app.get('/posts/:id/likes', async (req,res) => {
    
    const id = req.params.id;
    //handling the exception - if id not found
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send(`Post not found at the id ${id}`);      
    }
    // if id present in the database
    const rk = await Post.findById(id);      
    const no_of_likes = Number(rk.likes);    
    res.send({no_of_likes});
})

// if above specified route is not called
app.use((req,res)=>{
    res.send(`invalid route. please enter a valid route\n` + instruct)
})

//instructions if any wrong route entered
const instruct = `
    GET:
    1. to GET all posts : http://localhost:${port}/posts
    2. to GET post with id : http://localhost:${port}/posts/:id
    3. to GET comments of a post with id : http://localhost:${port}/posts/:id/comments
    4. to GET likes of a post with id : http://localhost:${port}/posts/:id/likes

    POST:
    1. to create a post : http://localhost:${port}/posts

    DELETE:
    1. to DELETE a post with id : http://localhost:${port}/posts/:id

    PUT/UPDATE:
    1. to UPDATE the caption with id : http://localhost:${port}/posts/:id
    2. to like a post :  http://localhost:${port}/posts/:id/like
    3. to unlike a post : http://localhost:${port}/posts/:id/unlike
    4. to commenting a post : http://localhost:${port}/posts/:id/comment

 `

//establishment of connection

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log("Connected to the database!");
    })
})
