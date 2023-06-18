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
  initializeApp(firebaseConfig);   
  const auth = getAuth();


  const [thistwt, setThisTwt] = useState()  
  
  const currentUser = auth.currentUser.uid;
  const doesLike = props.tweet.userlikes.includes(auth.currentUser.uid)
  const doesRetweet = props.tweet.userretweets.includes(auth.currentUser.uid)
  
  const navigate = useNavigate();
  const db = getFirestore();  

  const currentdate = new Date()
  const currentdateutc = currentdate.toUTCString()
  const originaldateutc = props.tweet.timestamp.toDate().toUTCString()
  const currentseconds = Date.parse(currentdateutc);
  const originalseconds = Date.parse(originaldateutc);
  const secdif = (currentseconds-originalseconds)/1000  

  const date2 = originaldateutc.slice(4, 11);   
  const date3 = originaldateutc.slice(4, 11) + "," + originaldateutc.slice(11, 16); 

  useEffect(()=>{
    const loadtwt = async() => {
      const docRef = doc(db, "Tweets", props.id);
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
        <p className="timedif">{secdif > (358 * 86400) ? date3 : secdif > 86400 ? date2 : secdif > 3600 ? Math.floor(secdif/3600)+"h" : secdif > 60 ? Math.floor(secdif/60)+"m" : secdif+"s"}</p>
        </div>

          {currentUser === props.tweet.author ? <div className="smalllogos" onClick={(e)=>{
          e.stopPropagation()
          e.preventDefault()
          props.deleteTweet(props.id)}} ><img className="smalllogos" alt="" src={process.env.PUBLIC_URL + "delete.svg"}></img></div> : null}

      </div>

      <p className="tweettext">{props.tweet.tweet}</p>

      <div className="bottweetdiv">
        <div className="smalllogosdiv"> <img alt="" className="smalllogos" src={process.env.PUBLIC_URL + "comment.svg"}></img><p className="font13">{props.tweet.comments}</p></div>

        {doesRetweet ? 
          <div className="smalllogosdiv" onClick={(e)=>{
            e.stopPropagation()
            
            props.retweet(props.id, props.tweet.retweets, props.tweet.userretweets)          
            }}>
          <img alt="" className="smalllogos" src={process.env.PUBLIC_URL + "retweeted.svg"}></img><p className="font13">{thistwt ? thistwt.retweets : props.tweet.retweets}</p>
          </div> :          
          <div className="smalllogosdiv" onClick={(e)=>{
            e.stopPropagation()
            props.retweet(props.id, props.tweet.retweets, props.tweet.userretweets)          
            }}><img alt="" className="smalllogos" src={process.env.PUBLIC_URL + "notretweeted.svg"}></img><p className="font13">
            {thistwt ? thistwt.retweets : props.tweet.retweets}</p>
          </div>
        }


        {doesLike ?<div  className="smalllogosdiv" onClick={(e)=>{
          e.stopPropagation()          
          props.likeTweet(props.id, props.tweet.likes, props.tweet.userlikes)          
          }}><img alt="" className="smalllogos " src={process.env.PUBLIC_URL + "liked.svg"}></img><p className="font13">{thistwt ? thistwt.likes : props.tweet.likes}</p>
        </div> : <div className="smalllogosdiv" onClick={(e)=>{
          e.stopPropagation()
          props.likeTweet(props.id, props.tweet.likes, props.tweet.userlikes)          
          }}><img alt="" className="smalllogos " src={process.env.PUBLIC_URL + "notliked.svg"}></img><p className="font13">{thistwt ? thistwt.likes : props.tweet.likes}</p>
        </div>}
        
        

        <p></p>
      </div>

    </div>
  );
}

export default Tweet;