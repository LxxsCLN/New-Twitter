import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React from "react"
import { useNavigate, } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import uniqid from 'uniqid';

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

function SingleTweet(props) {

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

  const db = getFirestore();

  const [tweet, setTweet] = useState("");

  const handleChange = (event) => {
    setTweet(event.target.value);
  };
  
  async function addComment(){
    try {
      await addDoc(collection(getFirestore(), "Tweets", props.id, "Comments"), {
        author: getAuth().currentUser.uid,
        tweet: tweet,
        name: getAuth().currentUser.displayName,
        profilePicUrl: getAuth().currentUser.photoURL || null,
        timestamp: serverTimestamp(),
        likes: 0,
        userlikes: []
      });
    }
    catch(error) {
      console.error('Error writing new message to Firebase Database', error);
    }
  }

  
  return (
    <div className="SingleTweet">

             
        <img alt="" src={props.tweet.profilePicUrl || ""}></img>
        <h4>{props.tweet.name}</h4>
        <p>{props.tweet.tweet}</p>
        <button>Likes: {props.tweet.likes}</button>
        <p>Comments: {props.tweet.comments}</p>
        <p>Date: {props.tweet.timestamp.toMillis()}</p>
        <form>
          <input onChange={handleChange} className="commentinput" placeholder="Escribe tu comentario..."></input>
          <button onClick={addComment} >Comentar</button>
        </form>


    </div>
  );
}

export default SingleTweet;