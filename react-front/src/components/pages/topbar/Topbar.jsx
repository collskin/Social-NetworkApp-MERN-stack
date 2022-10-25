import "./topbar.css"
import { Search } from "@mui/icons-material";
import {Link, useNavigate} from "react-router-dom"
import { useContext, useState, useEffect,useRef } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { useOnClickOutside } from "../helper";


export default function Topbar() {

    const ref = useRef();
    const {user,dispatch} = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const url=process.env.REACT_APP_BASE_URL
    const [search,setSearch] = useState([]);
    const navigate = useNavigate();
    const [open,setOpen] = useState(false);

    useOnClickOutside(ref,()=>setOpen(false))


    

    const handleSearch = async (e)=>{
        const res = await axios.get(url + "/users/search/?name="+ e.target.value);
        console.log(res.data);
        setSearch(res.data);
        setOpen(true);
    }

    const handleLogout = ()=>{
        dispatch({type:"LOGOUT",payload:null});
        window.localStorage.removeItem("user");
        navigate("/register");
    }

    return(
        <div className="homepage">
            <div className="topbarContainer">
                <div className="topbarLeft">
                    <Link to="/" style={{ textDecoration: "none" }}>
                    <span className="logo">Social Network</span>
                    </Link>
                </div>
                <div className="topbarCenter">
                    <div className="searchbar" ref={ref}>
                        <Search className="searchIcon"/>
                        <input type="text" placeholder="Search for friends" className="searchInput" onChange={handleSearch}/>
                        {search.length>0 && open && 
                            
                            
                            <div className="searchContainer">
                            {search.map(item=>{
                            return (<div className="searchDiv" onClick={()=>navigate("/profile/" + item.username)}>{item.username}</div>)
                            })}

                            </div>}
                        
                    </div>
                </div>
                <div className="topbarRight">
                    <div className="topbarButtons">
                    <Link to={"/chat"}>
                        <button className="topbarBtn3">Chat</button>
                        </Link>
                        <Link to={`/profile/${user.username}`} >
                        <button className="topbarBtn1">Profile</button>
                        </Link>
                        
                        <button className="topbarBtn2" onClick={handleLogout}>Log out</button >
                        
                        <Link to={`/profile/${user.username}`} className="linkImg">
                        <img src={user.profilePicture ? PF + user.profilePicture  : PF+"person/noavatar.jpg"}
                         alt="" className="topbarImg" />
                         </Link>
                    </div>
                </div>
            </div>

        </div>
    );
}