import { GoogleAuthProvider, getAuth,} from "firebase/auth";
import { initializeApp } from "firebase/app";
import React from "react"
import { useNavigate, } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getFirestore,
  doc,
  getDoc,
} from 'firebase/firestore';

function Comment(props) {

  const [thistwt, setThisTwt] = useState()

  const firebaseConfig = {
    apiKey: "AIzaSyBZjFRwHGznnJMPSDhAo-nFt5zVBcU6l3c",
    authDomain: "newtwitterlxxs.web.app",
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

  const currentdate = new Date()
  const currentdateutc = currentdate.toUTCString()
  const originaldateutc = props.tweet.timestamp.toDate().toUTCString()
  const currentseconds = Date.parse(currentdateutc);
  const originalseconds = Date.parse(originaldateutc);
  const secdif = (currentseconds-originalseconds)/1000

    return (



<div className="tweet">  
      
      <img referrerPolicy="no-referrer" className="tweetuserimg" alt="" src={props.tweet.profilePicUrl}></img>

      <div className="toptweetdiv">
        <div className="nametimetweet">
        <h4>{props.tweet.name}</h4>
        {props.tweet.isverified ? <img alt="" src={process.env.PUBLIC_URL + "verified.svg"} className="smalllogos verifiedlogo"></img> : null}
        {props.tweet.isverifiedgold ? <img alt="" src={process.env.PUBLIC_URL + "premiumverified.svg"} className="smalllogos verifiedlogo"></img> : null}
        <p className="timedif">@{props.tweet.name}</p> ·
        <p className="timedif">{secdif > 86400 ? Math.floor(secdif/86400)+"d" : secdif > 3600 ? Math.floor(secdif/3600)+"h" : secdif > 60 ? Math.floor(secdif/60)+"m" : secdif+"s"}</p>
        </div>
          {currentUser === props.tweet.author ? <div onClick={(e)=>{
          e.stopPropagation()
          e.preventDefault()
          props.deleteComment(props.docid, props.id)}}><img className="smalllogos" alt="" src={process.env.PUBLIC_URL + "delete.svg"}></img></div> : null}
      </div>

      <p className="tweettext">{props.tweet.tweet}</p>

      <div className="bottweetdiv">
      <div className="smalllogosdiv lowopacity">
          <img alt="" className="smalllogos" src={process.env.PUBLIC_URL + "comment.svg"}></img><p className="font13">0</p>
          </div>
        {doesRetweet ? 
          <div className="smalllogosdiv" onClick={(e)=>{
            e.stopPropagation()
            props.retweetComment(props.docid, props.id, props.tweet.retweets, props.tweet.userretweets)            
            }}>
          <img alt="" className="smalllogos" src={process.env.PUBLIC_URL + "retweeted.svg"}></img><p className="font13">{thistwt ? thistwt.retweets : props.tweet.retweets}</p>
          </div> :          
          <div className="smalllogosdiv" onClick={(e)=>{
            e.stopPropagation()
            props.retweetComment(props.docid, props.id, props.tweet.retweets, props.tweet.userretweets)            
            }}><img alt="" className="smalllogos" src={process.env.PUBLIC_URL + "notretweeted.svg"}></img><p className="font13">
            {thistwt ? thistwt.retweets : props.tweet.retweets}</p>
          </div>
        }

        {doesLike ?<div className="smalllogosdiv" onClick={(e)=>{
          e.stopPropagation()
          props.likeComment(props.docid, props.id, props.tweet.likes, props.tweet.userlikes)  
          }}><img alt="" className="smalllogos" src={process.env.PUBLIC_URL + "liked.svg"}></img><p className="font13">{thistwt ? thistwt.likes : props.tweet.likes}</p>
        </div> : <div className="smalllogosdiv" onClick={(e)=>{
          e.stopPropagation()
          props.likeComment(props.docid, props.id, props.tweet.likes, props.tweet.userlikes)
          }}><img alt="" className="smalllogos" src={process.env.PUBLIC_URL + "notliked.svg"}></img><p className="font13">{thistwt ? thistwt.likes : props.tweet.likes}</p>
        </div>} 
        <p></p>
      </div>

    </div>


      
    );
  }
  
  export default Comment;