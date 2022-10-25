const router = require("express").Router();
const {UserModel} = require("../models/User");
const bcrypt = require("bcrypt");
//Register

router.post("/register", async (req,res)=>{

        
        try {

            //generate new password 
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
           
            //create new user
            const newUser = new UserModel({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
            });

            //save user and respond
            await newUser.save();
            res.status(200).json(UserModel);
        }   catch(err){
            res.status(500).json(err)
        }
    }); 

    //login
    router.post("/login", async (req,res) => {

        try{
            const user = await UserModel.findOne({ email: req.body.email});
            !user && res.status(404).json("user not found");

            const validPassword = await bcrypt.compare(req.body.password, user.password)
            !validPassword && res.status(400).json("wrong password")

            res.status(200).json(user);
         }catch(err){
            res.status(500)

        }

    });

module.exports = router;