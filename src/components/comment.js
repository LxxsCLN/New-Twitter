import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React from "react"
import { useNavigate, } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";


function Comment(props) {

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
  

    return (
      <div className="comment">

        <img alt="" src={props.tweet.profilePicUrl || ""}></img>
        <h4>{props.tweet.name}</h4>
        <p>{props.tweet.tweet}</p>
        <button>Likes: {props.tweet.likes}</button>
        <p>Date: {111111}</p>

      </div>
    );
  }
  
  export default Comment;