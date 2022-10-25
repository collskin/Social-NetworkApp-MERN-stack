const express = require ("express");
const app = express ();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts")
const conversationRoute = require("./routes/conversations");
const messagesRoute = require ("./routes/messages");
const cors = require("cors");
const multer = require("multer");
const path = require("path");


dotenv.config();
app.use(cors());


const connectDB = () => {
    return mongoose.connect("mongodb+srv://collskin:andrijamongo@cluster0.qmbyl.mongodb.net/social?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  }
  
  const PORT = 8800;
  
  const start = async () => {
    try {
      await connectDB();
      app.listen(PORT, () =>
        console.log(`Server is listening on port ${PORT}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  start()

  // middleware
  app.use(express.json());
  app.use(helmet({crossOriginResourcePolicy: false}));
  app.use(morgan("common"));
  app.use("/images", express.static(path.join(__dirname,"/public/images")))
  
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "public/images");
      },
      filename: function (req, file, cb) {
        
        cb(null, req.body.name)
      },
    });


    const upload = multer({ storage: storage, dest: 'public/images' });
    app.post("/api/upload", upload.single("file"), (req, res) => {
     
  try {
    return res.status(200).json("File uploded successfully");
   
  } catch (err) {
    console.log(err);
  }
});

    app.use("/api/users" , userRoute);
    app.use("/api/auth" , authRoute);
    app.use("/api/posts", postRoute);
    app.use("/api/conversations", conversationRoute);
    app.use("/api/messages", messagesRoute);


app.listen(8801,() =>{
    console.log("Backend server is running!")
})