const mongoose = require("mongoose")

const ConversationtSchema = new mongoose.Schema(
    {
    members:{
        type:Array,
    }
    
},
{timestamps:true}
);

const ConversationModel = mongoose.model("Conversation", ConversationtSchema);

module.exports= {ConversationModel};