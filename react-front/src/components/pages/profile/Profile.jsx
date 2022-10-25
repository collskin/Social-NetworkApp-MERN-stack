import "./profile.css";
import Topbar from "../topbar/Topbar";
import Feed from "../feed/Feed";
import Rightbar from "../rightbar/Rightbar";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import {Link} from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

export default function Profile() {

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const url=process.env.REACT_APP_BASE_URL;
  const {user} = useContext(AuthContext);
  const [currentUser,setCurrentUser] = useState({}); 
  const username = useParams().username;
  const [file,setFile] = useState(null);
  const [cover,setCover] = useState(null);
  const [profile,setProfile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`${url}/users?username=${username}`);
      setCurrentUser(res.data);
    };
    fetchUser();
  }, [username]);

  const coverHandler = async (e) =>{
    e.preventDefault()
    const fileName = Date.now() + cover.name;
    const newImg = {
      userId: currentUser._id,
      coverPicture: fileName,
    }
    if(cover){
      const data = new FormData();
      data.append("name", fileName);
      data.append("file", cover);
      try{
          await axios.post(url + "/upload", data);
      }catch(err){
        console.log(err)
      }
      
    }
    try{
     await axios.post(url+"/posts/img?cover=1",newImg);
     // window.location.reload();
    }catch(err){
      
    }
  }
  const profilepicHandler = async (e) =>{
    e.preventDefault()
    const fileName = Date.now() + profile.name;
    const newImg1 = {
      userId: currentUser._id,
      profilePicture: fileName,
    }
    if(profile){
      const data = new FormData();
      data.append("name", fileName);
      data.append("file", profile);
      
      try{
          await axios.post(url + "/upload", data);
      }catch(err){
        console.log(err)
      }
      
    }
    try{
     await axios.post(url+"/posts/img?cover=0",newImg1);
     // window.location.reload();
    }catch(err){
      
    }
  }

  return (
    
    <>
      <Topbar />
      <div className="profile">
      <div className="profileRight">
        <div className="profileRightTop">
            <div className="profileCover">
            <label htmlFor="profileCover" className="shareCover">
            <img src={currentUser.coverPicture ? PF+currentUser.coverPicture : PF+"person/nocover.jpg"}  alt="" className="profileCoverImg" />
            {user._id == currentUser._id && <input style={{display:"none"}} type="file" id="profileCover" accept=".png, .jpeg, .jpg" onChange={(e)=>setCover(e.target.files[0])} />}
            </label>
            <label htmlFor="profileImg" className="shareImg">
            <img src={currentUser.profilePicture ? PF+currentUser.profilePicture : PF+"person/noavatar.jpg"}  alt="" className="profileUserImg" />
            {user._id == currentUser._id && <input style={{display:"none"}} type="file" id="profileImg" accept=".png, .jpeg, .jpg" onChange={(e)=>setProfile(e.target.files[0])} />}
            </label>
            
            {user._id == currentUser._id && <div className="buttonSub">
            <button className="changeCover" type="submit" onClick={coverHandler}>Change cover picture</button>
            <button className="changeImg" type="submit" onClick={profilepicHandler}>Change profile picture</button>
            </div>}
              
           
            </div>
            <div className="profileInfo">
                <h4 className="profileInfoName">{currentUser.username}</h4>
                <span className="profileInfoDesc">{currentUser.desc}</span>
            </div>
        </div>
        <div className="profileRightBottom">
            <Feed username={username}/>
            <Rightbar user={currentUser}/>
            </div> 
        </div> 
      </div> 
    </>
  );
}
