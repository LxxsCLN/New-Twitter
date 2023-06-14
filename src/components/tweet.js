import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React from "react"
import { useNavigate, } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";


function Tweet(props) {

  const firebaseConfig = {
    apiKey: "AIzaSyBZjFRwHGznnJMPSDhAo-nFt5zVBcU6l3c",
    authDomain: "newtwitterlxxs.firebaseapp.com",
    projectId: "newtwitterlxxs",
    storageBucket: "newtwitterlxxs.appspot.com",
    messagingSenderId: "845912882937",
    appId: "1:845912882937:web:d1d5fe3a1fe71bc14c6c28"
  };

  const app = initializeApp(firebaseConfig);  
  const provider = new GoogleAuthProvider();  
  const auth = getAuth();
  const navigate = useNavigate();
  
  // const [user, loading] = useAuthState(auth);

    return (
      <div onClick={()=>{
        navigate("/viewtweet", true)
      }} className="tweet">

        <img alt="" src={props.tweet.profilePicUrl || ""}></img>
        <h4>{props.tweet.name}</h4>
        <p>{props.tweet.tweet}</p>
        <button>Likes: {props.tweet.likes}</button>
        <p>Comments: {props.tweet.comments}</p>
        <p>Date: {props.tweet.timestamp.toMillis()}</p>

      </div>
    );
  }
  
  export default Tweet;