import "./share.css";
import {PermMedia,Label,Room,EmojiEmotions, Cancel} from "@mui/icons-material";
import { AuthContext } from "../../../context/AuthContext";
import { useContext, useRef } from "react";
import { useState } from "react";
import axios from "axios";


export default function Share(){

  const {user} = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const url=process.env.REACT_APP_BASE_URL
  const desc = useRef();
  const [file,setFile] = useState(null);

  const submitHandler = async (e) =>{
    e.preventDefault()
    const newPost = {
      userId: user._id,
      desc: desc.current.value
    }
    if(file){
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      try{
          await axios.post(url + "/upload", data);
      }catch(err){
        console.log(err)
      }
      
    }
    try{
     await axios.post(url+"/posts",newPost);
      window.location.reload();
    }catch(err){
      
    }
  }





     return (
       <div className="share">
        <div className="shareWrapper">
          <div className="shareTop">

          <img src={user.profilePicture ? PF + user.profilePicture : PF +"person/noavatar.jpg"} alt="" className="shareProfileImg" /> 
          <input placeholder="What is in your mind ?" ref={desc} className="shareInput" />
          </div>
          <hr className="shareHr" />
          {file && (
            <div className="shareImgContainer">
              <img src={URL.createObjectURL(file)} alt="" className="shareImg" />
              <Cancel className="shareCancelImg" onClick={()=>setFile(null)} />
            </div>
          )}
            <form className="shareBottom" onSubmit={submitHandler}>
              <div className="shareOptions">
                <label htmlFor="file" className="shareOption">
                  <PermMedia htmlColor="red" className="shareIcon"/>
                  <span className="shareOptionText">Photo or Video</span>
                  <input style={{display:"none"}} type="file" id="file" accept=".png, .jpeg, .jpg" onChange={(e)=>setFile(e.target.files[0])} />
                </label>
                <div className="shareOption">
                  <Label htmlColor="green" className="shareIcon"/>
                  <span className="shareOptionText">Tag</span>
                </div>
                <div className="shareOption">
                  <Room htmlColor="red" className="shareIcon"/>
                  <span className="shareOptionText">Location</span>
                </div>
                <div className="shareOption">
                  <EmojiEmotions htmlColor="goldenrod" className="shareIcon"/>
                  <span className="shareOptionText">Emotions</span>
                </div>
              </div>
              <button className="shareButton" type="submit">Share</button>
          </form>
        </div>
       </div>
     );
   
 }
 