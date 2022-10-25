import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import "./chatonline.css"

export default function ChatOnline({onlineUsers,currentId,setCurrentChat}){
  
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const url=process.env.REACT_APP_BASE_URL
  const [friends,setFriends] = useState(null);
  const [onlineFriends, setOnlineFriends] = useState([])
  


  useEffect(()=>{

    const getFriends = async ()=>{
        const res = await axios.get(url +"/users/friends/"+ currentId);
        setFriends(res.data)
    };
    getFriends();
  },[currentId]);
  
  

  useEffect(() => {
    
   if(friends && friends.following){

    
    setOnlineFriends(friends?.following?.filter((f) => onlineUsers?.includes(f._id)));
   }else{
    setOnlineFriends([]);
   }
    
  }, [friends, onlineUsers])

    const handleClick = async (user)=>{
      try{
        const res = await axios.get(url +`/conversations/find/${currentId}/${user._id}`)
        setCurrentChat(res.data);
      }catch(err){
        console.log(err)
      }
    }

    return (
    <div className="chatOnline">
        {onlineFriends.map(o=>(

        
        <div className="chatOnlineFriend" key={o._id} onClick={()=>handleClick(o)}>
            <div className="chatOnlineImgContainer">
               
                <img className="chatOnlineImg" 
                src={o?.profilePicture 
                    ? PF + o.profilePicture  
                    : PF+"person/noavatar.jpg"} alt="" />
                
                
            
            <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">{o?.username}</span>
    </div>
    ))}
    </div> 
  )
}
