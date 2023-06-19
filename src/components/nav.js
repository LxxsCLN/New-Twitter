import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React from "react"
import { useNavigate, } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

function Nav(props) {
  const firebaseConfig = {
    apiKey: "AIzaSyBZjFRwHGznnJMPSDhAo-nFt5zVBcU6l3c",
    authDomain: "newtwitterlxxs.web.app",
    projectId: "newtwitterlxxs",
    storageBucket: "newtwitterlxxs.appspot.com",
    messagingSenderId: "845912882937",
    appId: "1:845912882937:web:d1d5fe3a1fe71bc14c6c28"
  };
  const app = initializeApp(firebaseConfig); 
  const auth = getAuth();

  
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const empty = useRef("")

  function handleClick(){
    empty.current.value = ""
  }
  
const shadow = !props.back ? "shadow nav" : "nav"
    return (
      <div className={shadow}>
          {props.back ? <div onClick={()=>{
            navigate("/home", true)
          }} className="backsvgdiv"><img  className="backsvg" alt="" src={process.env.PUBLIC_URL + "back.svg"}></img></div>  : <img referrerPolicy="no-referrer" src={user ? user.photoURL : process.env.PUBLIC_URL + "white.png"} alt="" className="userlogo"></img>}
        
        <img onClick={()=>{
            navigate("/home", true)
          }} alt="" src={process.env.PUBLIC_URL + "logo.png"} className="homelogo"></img>


        {props.back ? <div className="width28"></div> : <div className="logoutbutton" onClick={()=>{
          signOut(getAuth());
          navigate("/", true)
        }}><img alt="" src={process.env.PUBLIC_URL + "logout.svg"}></img></div> }
          

         

      </div>
    );
  }
  
  export default Nav;