import "./message.css"
import {format} from "timeago.js"

export default function Message({message,own,user,friend}) {

  
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  let userImg = user && user.profilePicture ? PF + user.profilePicture : PF +"person/noavatar.jpg"
  let friendImg = friend && friend.profilePicture ? PF + friend.profilePicture : PF +"person/noavatar.jpg"



  return (
    <div className={own ? "message own" : "message"}>
        <div className="messageTop">
            <img className="messageImg" src={own ?  userImg : friendImg} alt="" />
            <p className="messageText">{message.text}</p>
        </div>
        <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  )
}
