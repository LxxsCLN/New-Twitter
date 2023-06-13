import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React from "react"
import { useNavigate, } from "react-router-dom";
import { useEffect, useState } from "react";
import Nav from "./nav";
import SingleTweet from "./singletweet";
import Comment from "./comment";

function ViewTweet(props) {
    return (
      <div className="ViewTweet">

        <Nav />
        <SingleTweet />
        <Comment />
        <Comment />
        <Comment />
      </div>
    );
  }
  
  export default ViewTweet;