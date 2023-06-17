import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React from "react"
import { useNavigate, } from "react-router-dom";
import { useEffect, useState } from "react";
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


function Tweet(props) {

  const firebaseConfig = {
    apiKey: "AIzaSyBZjFRwHGznnJMPSDhAo-nFt5zVBcU6l3c",
    authDomain: "newtwitterlxxs.firebaseapp.com",
    projectId: "newtwitterlxxs",
    storageBucket: "newtwitterlxxs.appspot.com",
    messagingSenderId: "845912882937",
    appId: "1:845912882937:web:d1d5fe3a1fe71bc14c6c28"
  };


  const [thistwt, setThisTwt] = useState()

  useEffect(()=>{

    const loadtwt = async() => {
      const docRef = doc(getFirestore(), "Tweets", props.id);
      const docSnap = await getDoc(docRef);
      const tweet = docSnap.data();
      const likes = tweet.likes
      setThisTwt(tweet)
    }

    loadtwt()
    
  }, [])



  

  
  const app = initializeApp(firebaseConfig);  
  const provider = new GoogleAuthProvider();  
  const auth = getAuth();
  const navigate = useNavigate();
  const db = getFirestore();
  
  // const [user, loading] = useAuthState(auth);

    return (
      <div onClick={()=>{
        navigate("/viewtweet", true)
        props.setsingletweet(props.id)
      }} className="tweet">

        <img alt="" src={props.tweet.profilePicUrl || ""}></img>
        <h4>{props.tweet.name}</h4>
        <p>{props.tweet.tweet}</p>
        <button onClick={(e)=>{
          e.stopPropagation()
          props.likeTweet(props.id, props.tweet.likes, props.tweet.userlikes)
          
        }} >Likes: {thistwt ? thistwt.likes : props.tweet.likes}</button>
        <p>Comments: {props.tweet.comments}</p>
        <p>Date: {props.tweet.timestamp.toMillis()}</p>

      </div>
    );
  }
  
  export default Tweet;