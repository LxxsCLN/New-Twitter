import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React from "react"
import { useNavigate, } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

function Nav(props) {
  const firebaseConfig = {
    apiKey: "AIzaSyBZjFRwHGznnJMPSDhAo-nFt5zVBcU6l3c",
    authDomain: "newtwitterlxxs.firebaseapp.com",
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
  

    return (
      <div className="nav">
        <div className="topnav">
        <img src={user ? user.photoURL : ""} alt="" className="userlogo"></img> 
        <img alt="" src={process.env.PUBLIC_URL + "logo.png"} className="homelogo"></img>
        
        <button className="logoutbutton" onClick={()=>{
          signOut(getAuth());
          navigate("/")
        }}>Log out</button>  
        </div>



        {/* {props.isSingleTweet ? null : <form className="writetweet">
        <input className="tweetinput" placeholder="What is happening?!" onChange={props.handleChange} ref={empty}></input>
        <button className="submittweet" onClick={(e) => {
          e.preventDefault()
          props.submitTweet()
          handleClick()
        } }>Tweet</button>
      </form>  } */}

          

      </div>
    );
  }
  
  export default Nav;