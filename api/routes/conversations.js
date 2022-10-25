const router = require ("express").Router();
const {ConversationModel} = require("../models/Conversation");


// new conv
router.post("/", async (req,res)=>{
 
    const conversations = await ConversationModel.find({})
    const conversation = await conversations.find(con=>{
        let con1 = con.members.some(it=>it===req.body.receiverId);
        let con2 = con.members.some(it=>it===req.body.senderId); 
        return(con1 && con2);
    })
    const newConversation = ConversationModel({
        members:[req.body.senderId, req.body.receiverId],
    });
    try{
        console.log(conversation);
        if(conversation){
            return
        }
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    }catch(err){
        res.status(500).json(err);
    }
});

//get conv from user

router.get("/:userId", async(req,res)=>{
    try{
        const conversation = await ConversationModel.find({
            members:{$in:[req.params.userId]}
        });
        res.status(200).json(conversation);

    }catch(err){
        res.status(500).json(err)
    }
})

// get conversation that includes two usersIds

router.get("/find/:firstUserId/:secondUserId", async(req,res)=>{
    try{
        const conversation = await ConversationModel.findOne({
            members:{$all:[req.params.firstUserId, req.params.secondUserId]}
        });
        res.status(200).json(conversation);
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router;