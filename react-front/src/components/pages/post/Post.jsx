import "./post.css";
import {MoreVert} from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {format} from "timeago.js";
import {Link} from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

export default function Post({post}) {

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const url=process.env.REACT_APP_BASE_URL
    const [like,setLike] = useState(post.likes.length);
    const [isLiked,setIsLiked] = useState(false);
    const [user,setUser] = useState({});
    const {user:currentUser} = useContext(AuthContext);

    useEffect(()=>{
        setIsLiked(post.likes.includes(currentUser._id))
    },[currentUser._id,post.likes]);

    const likeHandler =()=>{
        try{
            axios.put(url +"/posts/"+post._id+"/like", {userId:currentUser._id})
        }
        catch(err){
            console.log(err);
        }
        setLike(isLiked? like-1 : like+1)
        setIsLiked(!isLiked)
    }

    useEffect(() => {
        const fetchUser = async () => {
          const res = await axios.get(`${url}/users?userId=${post.userId}`);
          setUser(res.data);
        };
        fetchUser();
      }, [post.userId]);

      
   //   console.log(PF + post.img);

   
  return (
    <div className="post">
        <div className="postWrapper">
            <div className="postTop">
                <div className="postTopLeft">
                    <Link to={`/profile/${user.username}`}>
                    <img src={user.profilePicture ? PF + user.profilePicture : PF +"person/noavatar.jpg"} alt="" className="postProfileImg" />
                    </Link>
                    <span className="postUsername">{user.username}</span>
                    <span className="postDate">{format(post.createdAt)}</span>
                </div>
                <div className="postTopRight">
                    <MoreVert />
                </div>
            </div>
            <div className="postCenter">
                <span className="postText">{[post?.desc]}</span>
                <img src={PF + post.img} alt="" className="postImg" />
            </div>
            <div className="postBottom">
                <div className="postBottomLeft">
                    <img src={PF + "like.png"} alt="" className="likeIcon" onClick={likeHandler}/>
                    <span className="postLikeCounter">{like} people like it</span>
                </div>
                <div className="postBottomRight">
                    <span className="postCommentText">{post.comment}</span>
                </div>
            </div>
        </div>
    </div>
  )
}
