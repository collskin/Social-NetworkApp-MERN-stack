const {UserModel} = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");


//update user
router.put("/:id", async(req,res)=>{
    if(req.body.userId == req.params.id || req.body.isAdmin){

        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(err){
                return res.status(500).json(err);
            }
        }
        try {
            const user = await UserModel.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account has been updated")
        }catch(err){
            return res.status(500).json(err);
        }

    } else{
        return res.status(403).json("You can update only your account!")
    }
})
//delete user
router.delete("/:id", async(req,res)=>{
    if(req.body.userId == req.params.id || req.body.isAdmin){

        
        try {
            const user = await UserModel.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted")
        }catch(err){
            return res.status(500).json(err);
        }

    } else{
        return res.status(403).json("You can delete only your account!")
    }
});
//get a user
router.get("/", async(req,res)=>{
    const userId = req.query.userId;
    const username = req.query.username;
    try{
        const user = userId 
        ? await UserModel.findById(userId) 
        : await UserModel.findOne({username: username});
        const {password,updateAt, ...other} = user._doc
         res.status(200).json(other)
    }catch(err){
        res.status(500).json(err);
    }

});
// get friend following
router.get("/friends/:userId", async (req,res)=>{
    try{
        const user = await UserModel.findById(req.params.userId);
        let following = await Promise.all(
            user.following.map(friendId=>{
                return UserModel.findById(friendId)
            })
        )
        let followers = await Promise.all(
            user.followers.map(friendId=>{
                return UserModel.findById(friendId)
            })
     )

        following =  following.map(friend=>{

            const{_id,username,profilePicture} = friend;
            return ({_id,username,profilePicture});
        });

        followers =  followers.map(friend=>{

            const{_id,username,profilePicture} = friend;
            return ({_id,username,profilePicture});
        });
        let friendList = {following,followers};
        res.status(200).json(friendList);
    }catch(err){
        res.status(500).json(err)
    }
})



//follow a user

router.put("/:id/follow", async (req,res)=>{

    if(req.body.userId !== req.params.id){

        try{
                const user = await UserModel.findById(req.params.id);
                const currentUser = await UserModel.findById(req.body.userId);
               
                if(!user.followers.includes(req.body.userId)){

                    await user.updateOne({$push: {followers: req.body.userId }});
                    await currentUser.updateOne({$push: {following: req.params.id }});
                    res.status(200).json("User has been followed");

                }else
                {
                    res.status(403).json("You are already following this user");
                }

        }catch(err)
        {
            res.status(500).json(err);
        }

    }else
    {
        res.status(403).json("You can't follow yourself")
    }
});

//unfollow a user

router.put("/:id/unfollow", async (req,res)=>{

    if(req.body.userId !== req.params.id){

        try{
                const user = await UserModel.findById(req.params.id);
                const currentUser = await UserModel.findById(req.body.userId);
               
                if(user.followers.includes(req.body.userId)){

                    await user.updateOne({$pull: {followers: req.body.userId }});
                    await currentUser.updateOne({$pull: {following: req.params.id }});
                    res.status(200).json("User has been unfollowed");

                }else
                {
                    res.status(403).json("You don't follow this user");
                }

        }catch(err)
        {
            res.status(500).json(err);
        }

    }else
    {
        res.status(403).json("You can't unfollow yourself")
    }
});

 // search users
 router.get("/search", async(req,res)=>{
    try{
        const {name} = req.query
        const regex = new RegExp(name, 'i') // i for case insensitive
        const results = await UserModel.find({username: {$regex: regex}})
        res.send(results);
    }catch(err){
        res.status(500).json(err);
    }
});
// search for user in chat
router.get("/search/chat", async(req,res)=>{
    try{
        
        const {name, id} = req.query
        const user = await UserModel.findById({_id: id});
        const {following} = user;
        let foundFollowing = [];
        for (let item of following){
            const foll = await UserModel.findById({_id: item})
            foundFollowing.push(foll)
            
        }
        const filtered = foundFollowing.filter(item=>item.username.toLowerCase().includes(name.toLowerCase()))
        res.send(filtered);

    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
  
  }
})





module.exports = router;