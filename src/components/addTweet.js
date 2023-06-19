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
import Nav from "./nav";


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

          const docRef = doc(getFirestore(), "Users", getAuth().currentUser.uid);
          const docSnap = await getDoc(docRef);
          const authordata = docSnap.data()

          await addDoc(collection(getFirestore(), "Tweets"), {
            author: getAuth().currentUser.uid,
            tweet: tweetinput.current,
            name: getAuth().currentUser.displayName,
            profilePicUrl: getAuth().currentUser.photoURL || null,
            timestamp: serverTimestamp(),
            likes: 0,
            retweets: 0,
            comments: 0,
            userlikes: [],
            userretweets: [],
            isverified: authordata.isverified,
            isverifiedgold: authordata.isverifiedgold,
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
        <Nav back={true} />


        <form className="writetweet">
        <img className=" tweetuserimg tweetuserimgsingle span3rows" alt="" src={getAuth().currentUser.photoURL}></img>
        <div className="everyone">Everyone <img alt="" src={process.env.PUBLIC_URL + "bottomarrow.svg"} className="smalllogos"></img></div>
        <button className="submittweet replybutton" onClick={(e) => {
          e.preventDefault()
          if (tweetinput.current === "") return;
          submitTweet()
          handleClick()
        }}>Tweet</button>
        <textarea rows={3} className="tweetinput span2cols" placeholder="What is happening?!" onChange={(e) => {
            handleChange(e)
        }} ref={empty}></textarea>        
        <div className="everyonecanreply span3cols"><img alt="" src={process.env.PUBLIC_URL + "world.svg"} className="smalllogos"></img>Everyone can reply</div>
      </form>  

      

      </div>
    )
  }
  
  export default AddTweet;