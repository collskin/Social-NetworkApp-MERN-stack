import axios from "axios";
import { useEffect, useState } from "react"
import "./conversation.css"

export default function Conversation({conversation, currentUser}) {

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const url=process.env.REACT_APP_BASE_URL
  const [user,setUser] = useState(null);
 
  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios(url+"/users?userId=" + friendId);
        setUser(res.data);
       
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [ conversation, currentUser]);

 

  return (
    <div className="conversation" >
        <img src={user?.profilePicture ? PF + user?.profilePicture : PF+"person/noavatar.jpg"} alt="" className="conversationImg" />
        <span className="conversationName">{user?.username}</span>
    </div>
  )
}
