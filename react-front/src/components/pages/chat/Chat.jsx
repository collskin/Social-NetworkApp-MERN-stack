import axios from "axios";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import ChatOnline from "../chatOnline/ChatOnline";
import Conversation from "../conversation/Conversation";
import Message from "../message/Message";
import Topbar from "../topbar/Topbar";
import "./chat.css";
import {io} from "socket.io-client";
import {v4} from "uuid";


export default function Chat() {

    const url=process.env.REACT_APP_BASE_URL
    const [conversations, setConversations] = useState([]); 
    const {user}= useContext(AuthContext);
    const [currentChat,setCurrentChat] = useState(null);
    const [messages,setMessages] = useState([]);
    const [newMessage,setNewMessage] = useState([]);
    const [arrivalMessage,setArrivalMessage] = useState(null);
    const scrollRef = useRef();
    const socket = useRef();
    const [onlineUsers, setOnlineUsers] = useState([])
    const [friend, setFriend] = useState({})

    useEffect(()=>{
        if(currentChat){
        let friend = currentChat.members.find((member)=> member !== user._id);
        axios.get(url+ "/users?userId=" + friend).then(res=>{
            setFriend(res.data)
        }).catch(error=>console.log(error))
    }
    },[currentChat])
    
   
    useEffect(() => {
        socket.current = io("ws://localhost:8900/");
        socket.current.on("getMessage", (data) => {
            console.log(data);
            setArrivalMessage({ 
               
               
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            })
        })
    },[])

    useEffect(() => {
        
        arrivalMessage &&
          currentChat?.members.includes(arrivalMessage.sender) &&
          setMessages((prev) => [...prev, arrivalMessage]);
      }, [arrivalMessage, currentChat]);

    useEffect(() => {
        console.log(user);
        socket.current.emit("addUser", user._id);
        socket.current.on("getUsers", (users) => {
            
            setOnlineUsers(
                user.following.filter((f) => users.some((u) => u?.userId === f))
                );
                
        });
        
    },[user]);
    
    

    useEffect(() => {
        const getConversations = async () => {
          try {
            const res = await axios.get(url +"/conversations/" + user._id);
            setConversations(res.data);
          } catch (err) {
            console.log(err);
          }
        };
        getConversations();
      }, [user._id]);

      useEffect(()=>{
        const getMessages = async ()=>{
            try{
            const res = await axios.get(url+"/messages/"+currentChat?._id);
            setMessages(res.data);
        }catch(err){
                console.log(err)
            }
        };
        getMessages()
      },[currentChat])

      const handleSubmit = async (e)=>{
        e.preventDefault();
        console.log(arrivalMessage);
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id
        };
        const receiverId = currentChat.members.find((member)=> member !== user._id);
        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text: newMessage,
        })
        try{
            const res = await axios.post(url+"/messages", message);
            setMessages([...messages, res.data])
            setNewMessage("");
        }catch(err){
            console.log(err)
        }
      };
     

      useEffect(()=>{
        scrollRef.current?.scrollIntoView({behavior:"smooth"})
      },[messages])

      
     
  return (
    <>
    <Topbar/>
    <div className="chat">

        <div className="chatMenu">
            <div className="chatMenuWrapper">
            {conversations.map((c)=>(
                <div onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user} />
                </div>
            ))}
            </div>
        </div>
        <div className="chatBox">
            <div className="chatBoxWrapper">
                {
                    currentChat ?
                    <>
                <div className="chatBoxTop">
                    {messages.map ((m) =>(
                        <div ref={scrollRef} key={v4()}>
                        <Message message={m} own={m.sender === user._id} user={user} friend={friend}
                        />
                        </div>
                    ))}
                    
                
                </div>
                <div className="chatBoxBottom">
                    <textarea className="chatMessageInput" 
                    placeholder="write something" 
                    onChange={(e)=>setNewMessage(e.target.value)}
                    value={newMessage}
                    ></textarea>
                    <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                </div>
                </> : (<span className="noConversationText"> Open converstaion to start a chat</span>)}
            </div>
        </div>
        <div className="chatOnline">
            <div className="chatOnlineWrapper">
                <ChatOnline 
                onlineUsers={onlineUsers} 
                currentId={user._id} 
                setCurrentChat={setCurrentChat}/>
            </div>
        </div>

    </div>
    </>
  )
}
