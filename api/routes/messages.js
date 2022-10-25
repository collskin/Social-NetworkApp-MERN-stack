const router = require ("express").Router();
const {MessageModel} = require("../models/Message");


//add message
router.post("/", async(req,res)=>{
    const newMessage = new MessageModel(req.body)

    try{
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);

    }catch(err){
        res.status(500).json(err)
    }});

// get messages

router.get("/:conversationId", async(req,res)=>{
    try{
        const messages = await MessageModel.find({
            conversationId:req.params.conversationId,
        });
        res.status(200).json(messages)
    }catch(err){
        res.status(500).json(err);
    }
})






module.exports = router;