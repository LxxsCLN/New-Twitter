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

function Comment(props) {

  const [thistwt, setThisTwt] = useState()

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

  useEffect(()=>{

    const loadtwt = async() => {
      const docRef = doc(getFirestore(), "Tweets", props.docid, "Comments", props.id);
      const docSnap = await getDoc(docRef);
      const tweet = docSnap.data();
      setThisTwt(tweet)
    }
    loadtwt()    
  }, [])
  
  const currentUser = getAuth().currentUser.uid;
  const doesLike = props.tweet.userlikes.includes(getAuth().currentUser.uid)
  const likeClass = doesLike ? "likedtweetbutton" : "notlikedtweetbutton";
  const doesRetweet = props.tweet.userretweets.includes(getAuth().currentUser.uid)
  const retweetClass = doesRetweet ? "retweetedtweetbutton" : "notretweetedtweetbutton"; 

  const date = props.tweet.timestamp.toDate().toDateString()
  const date2 = date.slice(4, 10) + "," + date.slice(10);    

  const hoursarray = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const hoursindex = props.tweet.timestamp.toDate().getHours()
  const minutes = props.tweet.timestamp.toDate().getMinutes()
  const realhour = hoursarray[hoursindex]
  const ampm = hoursindex < 12 ? " a.m. · " : " p.m. · "
  const finaldate = realhour + ":" + minutes + ampm + date2;

    return (
      <div className="comment">

        <img referrerPolicy="no-referrer" className="tweetuserimg" alt="" src={props.tweet.profilePicUrl}></img>
        <h4>{props.tweet.name}</h4>
        <p>{props.tweet.tweet}</p>
        <button className={retweetClass} onClick={(e)=>{
          e.stopPropagation()
          props.retweetComment(props.docid, props.id, props.tweet.retweets, props.tweet.userretweets)          
          }}>Retweets: {props.tweet.retweets}</button>
        <button className={likeClass} onClick={(e)=>{
          e.stopPropagation()
          props.likeComment(props.docid, props.id, props.tweet.likes, props.tweet.userlikes)
          
        }} >Likes: {thistwt ? thistwt.likes : props.tweet.likes}</button>
        <p>{finaldate}</p>

        {currentUser === props.tweet.author ? <button onClick={(e)=>{
        e.preventDefault()
        props.deleteComment(props.docid, props.id)}} >Delete</button> : null}

      </div>
    );
  }
  
  export default Comment;