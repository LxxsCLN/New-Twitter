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

  


  
  

  const app = initializeApp(firebaseConfig);  
  const provider = new GoogleAuthProvider();  
  const auth = getAuth();
  const navigate = useNavigate();
  const db = getFirestore();

  const currentUser = getAuth().currentUser.uid;
  const doesLike = props.tweet.userlikes.includes(getAuth().currentUser.uid)
  const likeClass = doesLike ? "likedtweetbutton" : "notlikedtweetbutton";

  const doesRetweet = props.tweet.userretweets.includes(getAuth().currentUser.uid)
  const retweetClass = doesRetweet ? "smalllogos retweetedtweetbutton" : "smalllogos notretweetedtweetbutton"; 

  const currentdate = new Date()
  const currentdateutc = currentdate.toUTCString()
  const originaldateutc = props.tweet.timestamp.toDate().toUTCString()
  const currentseconds = Date.parse(currentdateutc);
  const originalseconds = Date.parse(originaldateutc);
  const secdif = (currentseconds-originalseconds)/1000  

  useEffect(()=>{
    const loadtwt = async() => {
      const docRef = doc(getFirestore(), "Tweets", props.id);
      const docSnap = await getDoc(docRef);
      const tweet = docSnap.data();
      setThisTwt(tweet) 
    }
    loadtwt()      
  }, [])  

  return (
    <div onClick={()=>{
      navigate("/viewtweet", true)
      props.setsingletweet(props.id)
    }} className="tweet">  
      
      <img referrerPolicy="no-referrer" className="tweetuserimg" alt="" src={props.tweet.profilePicUrl}></img>

      <div className="toptweetdiv">
        <div className="nametimetweet">
        <h4>{props.tweet.name}</h4>
        <p className="timedif">@{props.tweet.name}</p> ·
        <p className="timedif">{secdif > 86400 ? Math.floor(secdif/86400)+"d" : secdif > 3600 ? Math.floor(secdif/3600)+"h" : secdif > 60 ? Math.floor(secdif/60)+"m" : secdif+"s"}</p>
        </div>
          {currentUser === props.tweet.author ? <button onClick={(e)=>{
          e.stopPropagation()
          e.preventDefault()
          props.deleteTweet(props.id)}} >Delete</button> : null}
      </div>

      <p className="tweettext">{props.tweet.tweet}</p>

      <div className="bottweetdiv">
        <p> <img alt="" className="smalllogos" src={process.env.PUBLIC_URL + "comment.svg"}></img> {props.tweet.comments}</p>
        {doesRetweet ? 
        <div onClick={(e)=>{
          e.stopPropagation()
          props.retweet(props.id, props.tweet.retweets, props.tweet.userretweets)          
          }}>
        <img alt="" className="smalllogos" src={process.env.PUBLIC_URL + "retweeted.svg"}></img>{thistwt ? thistwt.retweets : props.tweet.retweets}</div> : 
          
          <div onClick={(e)=>{
            e.stopPropagation()
            props.retweet(props.id, props.tweet.retweets, props.tweet.userretweets)          
            }}><img alt="" className="smalllogos" src={process.env.PUBLIC_URL + "notretweeted.svg"}></img>
            {thistwt ? thistwt.retweets : props.tweet.retweets}</div>}
        {doesLike ?<div onClick={(e)=>{
          e.stopPropagation()
          props.likeTweet(props.id, props.tweet.likes, props.tweet.userlikes)          
          }}><img alt="" className="smalllogos" src={process.env.PUBLIC_URL + "liked.svg"}></img>{thistwt ? thistwt.likes : props.tweet.likes}
        </div> : <div onClick={(e)=>{
          e.stopPropagation()
          props.likeTweet(props.id, props.tweet.likes, props.tweet.userlikes)          
          }}><img alt="" className="smalllogos" src={process.env.PUBLIC_URL + "notliked.svg"}></img>{thistwt ? thistwt.likes : props.tweet.likes}
        </div>}
        
        

        <p></p>
      </div>

    </div>
  );
}

export default Tweet;