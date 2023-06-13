import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React from "react"
import { useNavigate, } from "react-router-dom";
import { useEffect, useState } from "react";
import Nav from "./nav";
import Tweet from "./tweet";

function Home() {
  
    return (
      
      <div className="Home">
        <Nav />
        <Tweet />
        <Tweet />
        <Tweet />
      </div>
    );
  }
  
  export default Home;