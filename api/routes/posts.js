const router = require ("express").Router();
const {PostModel} = require("../models/Post");
const { UserModel } = require("../models/User");

//create a post

router.post("/", async(req,res)=>{

    const newPost = new PostModel(req.body);

    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);

    }catch(err){
        res.status(500).json(err)
    }

})

//update a post

router.put("/:id", async (req,res)=>{

    try{
    const post = await PostModel.findById(req.params.id);
    if(post.userId === req.body.userId){

        await post.updateOne({$set:req.body});
        res.status(200).json("The post has been updated");

    }else{
        res.status(403).json("you can update only your posts")
    }
    }catch(err){
        res.status(500).json(err);
    }
})

//delete a post

router.delete("/:id", async (req,res)=>{

    try{
    const post = await PostModel.findById(req.params.id);
    if(post.userId === req.body.userId){

        await post.deleteOne();
        res.status(200).json("The post has been deleted");

    }else{
        res.status(403).json("you can delete only your posts")
    }
    }catch(err){
        res.status(500).json(err);
    }
})

//like and dislike  a post

router.put("/:id/like", async(req,res)=>{
    try{
        const post = await PostModel.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            console.log(post);
            console.log(req.body.userId)
            res.status(200).json("The post has been liked")
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}});

            res.status(200).json("The post has been disliked");
        }

    }catch(err){
        res.status(500).json(err);
    }
})

//get a post

router.get("/:id", async(req,res)=>{
    try{

        const post = await PostModel.findById(req.params.id);
        res.status(200).json(post);

    }catch(err){
        res.status(500).json(err)
    }
})

//get timeline posts

router.get("/timeline/:userId", async(req,res)=>{
    try {
        const currentUser = await UserModel.findById(req.params.userId);
        const userPosts = await PostModel.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
          currentUser.following.map((friendId) => {
            return PostModel.find({ userId: friendId });
          })
        );
        
        res.status(200).json(userPosts.concat(...friendPosts))

    }catch(err){
        res.status(500).json(err);
    }
});

//get user's posts

router.get("/profile/:username", async (req, res) => {
    try {
      const user = await UserModel.findOne({ username: req.params.username });
      const posts = await PostModel.find({ userId: user._id });
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// add cover picture
    router.post("/img", async (req,res)=>{
    
    try{
        if(req.query.cover == 1){
            await UserModel.findOneAndUpdate({_id: req.body.userId}, {coverPicture:req.body.coverPicture});
            
        }else{
            await UserModel.findOneAndUpdate({_id: req.body.userId}, {profilePicture:req.body.profilePicture});
        }
        res.status(200);
    
    }catch(err){
        console.log(err)
    }

 })


module.exports = router;