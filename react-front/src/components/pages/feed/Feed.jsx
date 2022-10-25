import "./feed.css";
import Share from "../share/Share";
import Post from "../post/Post";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import {v4} from "uuid";

export default function Feed({username}){


    const[posts,setPosts] = useState([]);
    const{user} = useContext(AuthContext);
   
    const url=process.env.REACT_APP_BASE_URL

    useEffect(()=>{
        const fetchPosts = async ()=> {
            const res = username  
            ?  await axios.get(url + "/posts/profile/" + username)
            :  await axios.get(url +"/posts/timeline/" + user._id)
            console.log(res.data);
            setPosts(res.data.sort((p1,p2)=>{
                
                return new Date(p2.createdAt) - new Date(p1.createdAt);
            }))  
        };
        fetchPosts();
        
    },[username,user._id]);
    
    return(
        <div className="feed">     
        <div className="feedWrapper">
                {(!username || username === user.username) && <Share/>}
               {  posts.map((p)=>(
                    <Post  post={p} key={v4()}/>                                       // key={p._id}
                   
               ))}
                
            </div>
        </div>
    );
}