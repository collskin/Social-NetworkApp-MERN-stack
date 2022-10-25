import "./home.css"
import React,{useState, useContext} from "react";
import { useRef } from "react";
import {loginCall} from "../../../apiCalls"
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
export default function Home() {

  const [active,setActive] = useState(false);
  const url=process.env.REACT_APP_BASE_URL
  const usernameA = useRef();
  const email = useRef();
  const emailA = useRef();
  const password = useRef();
  const passwordA = useRef();
  const confirmpassword = useRef();
  const formRef = useRef();

  const {user,isFetching,error,dispatch}= useContext(AuthContext);

 const handleClick = (e)=>{
  e.preventDefault()
  loginCall({email:email.current.value,password:password.current.value}, dispatch);
  
 };

 const handleClickA = async (e)=>{
  e.preventDefault()
  
if (confirmpassword.current.value !== passwordA.current.value) {
   confirmpassword.current.setCustomValidity("Passwords don't match!");
   console.log(confirmpassword.current.value,passwordA.current.value)
    }else{
      const user = {
        username: usernameA.current.value,
        email: emailA.current.value,
        password: passwordA.current.value
      }
      try{
        await axios.post(url +"/auth/register", user);
        
        console.log(user);
      }catch(err){
        console.log(err);
      }
    }
    formRef.current.reset();
 };


  return (
    <div className="login-container">
    <div className={active ? "container" : "container right-panel-active"}  >
      <div className="form-container sign-up-container">
      <form action="none" onSubmit={handleClickA} ref={formRef}>
        <h1 className="h1Home" >Create Account</h1>
        <span className="spanHome">Lorem ipsum dolor, sit amet con</span>
        <input type="text" placeholder="Username" ref={usernameA} required/>
        <input type="email" placeholder="Email" ref={emailA} required/>
        <input type="password" placeholder="Password" ref={passwordA} required minLength={6}/>
        <input type="password" placeholder="Confirm Password" ref={confirmpassword} required/>
        <button className="btnHome" type="submit">{isFetching ? "loading" :"Sign Up" }</button>
      </form>
      </div>
      <div className="form-container sign-in-container">
        <form action="none" onSubmit={handleClick}>
          <h1 className="h1Home" >Sign in</h1>
          <span className="spanHome">Lorem ipsum dolor, sit amet con</span>
        <input type="email"  placeholder="Email" ref={email} required />
        <input type="password" minLength={6}  placeholder="Password" ref={password} required/>
        <button  className="btnHome" >Forgot password?</button>
        <button className="btnHome" type="submit" >{isFetching ? "loading" :"Sign In" }</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1 className="h1Home">Welcome back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" onClick={()=>setActive(prev=>!prev)}>Sign In</button>          
          </div>
          <div className="overlay-panel overlay-right">
            <h1 className="h1Home">Hello</h1>
            <p>Enter your personal details and create new account</p>
            <button className="ghost q" onClick={()=>setActive(prev=>!prev)} >Sign Up</button>
          </div>
        </div>
      </div>
    </div>
    </div>
    
  );
}