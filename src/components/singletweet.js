import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React from "react"
import { useNavigate, } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
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

  let tweetinput = useRef("");
  
  // const [tweet, setTweet] = useState("");

  const handleChange = (event) => {
    tweetinput.current = event.target.value;
  };

  const empty = useRef("")

  function handleClick(){
    empty.current.value = ""
  }

  // const [isLiked, setIsLiked] = useState(false)
  
  async function addComment(e){
    e.preventDefault()
    const docRef = doc(getFirestore(), "Tweets", props.id);
      const docSnap = await getDoc(docRef);
      const tweet2 = docSnap.data();
    try {
      await addDoc(collection(getFirestore(), "Tweets", props.id, "Comments"), {
        author: getAuth().currentUser.uid,
        tweet: tweetinput.current,
        name: getAuth().currentUser.displayName,
        profilePicUrl: getAuth().currentUser.photoURL || null,
        timestamp: serverTimestamp(),
        likes: 0,
        retweets: 0,
        userretweets: [],
        userlikes: []
      });
    }
    catch(error) {
      console.error('Error writing new message to Firebase Database', error);
    }
    await updateDoc(docRef, {
      comments: tweet2.comments + 1
      });
      tweetinput.current = ""
      props.setIsLiked(!props.isLiked)
  }

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
    <div>
    <div className="singletweet">       
             
        <img className=" tweetuserimg tweetuserimgsingle " alt="" src={props.tweet.profilePicUrl}></img>

        <div className="toptweetdiv">
        <p className="singletweetname">{props.tweet.name}</p>
        {currentUser === props.tweet.author ? <button onClick={(e)=>{
        e.preventDefault()
        props.deleteTweet(props.id)
        navigate("/home", true)
        }} >Delete</button> : null}
        
        </div>
        <p className="timedif">@{props.tweet.name}</p>
        <p className="singletweettext spantwocolumn">{props.tweet.tweet}</p>
        <p className="finaldate spantwocolumn">{finaldate}</p>
        
          <div className="bottweetdiv bottweetdiv2 spantwocolumn">
        <p>Comments: {props.tweet.comments}</p>
          <button className={retweetClass} onClick={(e)=>{
            e.stopPropagation()
            props.retweet(props.id, props.tweet.retweets, props.tweet.userretweets)          
            }}>Retweets: {props.tweet.retweets}</button>
          <button className={likeClass} onClick={(e)=>{
            e.stopPropagation()
            props.likeTweet(props.id, props.tweet.likes, props.tweet.userlikes)            
          }} >Likes: {props.tweet.likes}</button>    
          
          </div>
        </div>

        <form>
          <input ref={empty} onChange={handleChange} className="commentinput" placeholder="Escribe tu comentario..."></input>
          <button onClick={(e)=>{
            handleClick(e)
            addComment(e)
          } } >Comentar</button>
        </form>


    </div>
  );
}

export default SingleTweet;