import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React from "react"
import { useNavigate, } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";


import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';


function AddTweet() {

    const navigate = useNavigate();

    const handleChange = (event) => {
        tweetinput.current = event.target.value;
      };

    let tweetinput = useRef("");      
    const empty = useRef("")

    function handleClick(){
        
      empty.current.value = ""
    }

    async function submitTweet(){
        try {
          await addDoc(collection(getFirestore(), "Tweets"), {
            author: getAuth().currentUser.uid,
            tweet: tweetinput.current,
            name: getAuth().currentUser.displayName,
            profilePicUrl: getAuth().currentUser.photoURL || null,
            timestamp: serverTimestamp(),
            likes: 0,
            comments: 0,
            userlikes: [],
          });
        }
        catch(error) {
          console.error('Error writing new message to Firebase Database', error);
        }
        tweetinput.current = ""
        navigate("/home", true)
      } 
  
    return (
      <div>
        <form className="writetweet">
        <input className="tweetinput" placeholder="What is happening?!" onChange={(e) => {
            handleChange(e)
        }} ref={empty}></input>
        <button className="submittweet" onClick={(e) => {
          e.preventDefault()
          if (tweetinput.current === "") return;
          submitTweet()
          handleClick()
        } }>Tweet</button>
      </form>  
      </div>
    )
  }
  
  export default AddTweet;