import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React from "react"
import { useNavigate, } from "react-router-dom";
import { useEffect, useState } from "react";
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
  

    return (
      <div className="nav">
        <h1>Logo</h1>
        <h1>New Twitter</h1>
        <p>{user ? user.displayName : ""}</p>
        <img src={user ? user.photoURL : ""} alt=""></img> 
        <button onClick={()=>{
          signOut(getAuth());
          navigate("/")
        }}>Logout</button>       
      </div>
    );
  }
  
  export default Nav;