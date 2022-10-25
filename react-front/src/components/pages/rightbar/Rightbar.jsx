import "./rightbar.css";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import {Link} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import {Add, Remove} from "@mui/icons-material"

export default function Rightbar({ user }) {

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const url = process.env.REACT_APP_BASE_URL;
  const[friends,setFriends]= useState([]);
  const {user:currentUser, dispatch} = useContext(AuthContext)
  const [followed, setFollowed] = useState(currentUser.following.includes(user?._id));
  const [createConv, setCreateConv] = useState([])

  
  useEffect (()=>{
    const createConversation = async ()=>{
      try{
        const friendId = friends.find(user._id);
        console.log('5555')
        if(friends ){
          console.log('333')
         const convo = await axios.post(url + "/conversations", {senderId:user._id, receiverId: friendId})
         setCreateConv(convo.data)
        }else{
          console.log("conversation already created");
        }

      }catch(err){
        console.log(err);
      }
    };
    createConversation()
  },[])


  useEffect(()=>{
    const getFriends = async ()=>{
      try{
        console.log(user);
        if(user?._id){
          const friendList = await axios.get(url + "/users/friends/" + user?._id);
        setFriends(friendList.data);
        console.log(friendList);
        }
        
      }catch(err){
        console.log(err);
      }
    };
    getFriends();
  }, [user]);


  useEffect(()=>{
    setFollowed(currentUser.following.includes(user?._id));

  }, [currentUser, user?._id]);

  const handleClick = async ()=>{
    try
    { if(followed){
      
      await axios.put(url + "/users/"+user._id+"/unfollow", {userId:currentUser._id})
      dispatch({type:"UNFOLLOW",payload:user._id})
      console.log(followed)
      
    }else{
      await axios.put(url + "/users/"+user._id+"/follow",{userId:currentUser._id})
      dispatch({type:"FOLLOW",payload:user._id})

      
      const convo = await axios.post(url + "/conversations/", {senderId:user._id, receiverId: currentUser._id })
      console.log(convo)
         setCreateConv(convo.data);
         
    }

    }catch(err)
    {
      console.log(err)
    }
    setFollowed(!followed)
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user?.username !== currentUser?.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
           {followed? "Unfollow": "Follow"}
           {followed? <Remove/> : <Add/>}
          
          </button>
        )}
      <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user?.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user?.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">{user?.relationship === 1
                ? "Single"
                : user?.relationship === 1
                ? "Married"
                : "-"}</span>
          </div>
        </div>
        <h4 className="rightbarTitle">Followers</h4>
        <div className="rightbarFollowings">
          {friends.followers && friends.followers.map((friend,i) => (
            <Link to={"/profile/"+friend.username} style={{textDecoration:"none"}} key={i}>
            <div className="rightbarFollowing">
            <img
              src={friend.profilePicture 
                ? PF+friend.profilePicture 
                : PF+"person/noavatar.jpg"}
                alt=""
                className="rightbarFollowingImg"
                />
            <span className="rightbarFollowingName">{friend.username}</span>
          </div>
                </Link>
              ))}
        </div>
        <h4 className="rightbarTitle">Following</h4>
        <div className="rightbarFollowings">
          {friends.following && friends.following.map((friend,i) => (
            <Link to={"/profile/"+friend.username} style={{textDecoration:"none"}} key={i}>
            <div className="rightbarFollowing">
            <img
              src={friend.profilePicture 
                ? PF+friend.profilePicture 
                : PF+"person/noavatar.jpg"}
                alt=""
                className="rightbarFollowingImg"
                />
            <span className="rightbarFollowingName">{friend.username}</span>
          </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}