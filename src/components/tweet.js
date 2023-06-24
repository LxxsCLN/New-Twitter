import { getAuth, } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React from "react"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore';


function Tweet(props) {

  const firebaseConfig = {
    apiKey: "AIzaSyBZjFRwHGznnJMPSDhAo-nFt5zVBcU6l3c",
    authDomain: "newtwitterlxxs.web.app",
    projectId: "newtwitterlxxs",
    storageBucket: "newtwitterlxxs.appspot.com",
    messagingSenderId: "845912882937",
    appId: "1:845912882937:web:d1d5fe3a1fe71bc14c6c28"
  };


  initializeApp(firebaseConfig);   
  const auth = getAuth();

  const [thistwt, setThisTwt] = useState(props.tweet)  
  
  const currentUser = auth.currentUser.uid;
  
  const navigate = useNavigate();
  const db = getFirestore();  


  const currentdate = new Date()
  const currentdateutc = currentdate.toUTCString()
  const originaldateutc = props.tweet.timestamp.toDate().toUTCString()
  const currentseconds = Date.parse(currentdateutc);
  const originalseconds = Date.parse(originaldateutc);
  const secdif = (currentseconds - originalseconds)/1000  

  const date2 = originaldateutc.slice(4, 11);   
  const date3 = originaldateutc.slice(4, 11) + "," + originaldateutc.slice(11, 16); 


  const [isLiked, setIsLiked] = useState(false)
  const [doesLike, setDoesLike] = useState(props.tweet.userlikes.includes(getAuth().currentUser.uid))
  const [doesRetweet, setDoesRetweet] = useState(props.tweet.userretweets.includes(auth.currentUser.uid))
  
  useEffect(()=>{
    const loadtwt = async() => {
      const docRef = doc(db, "Tweets", props.id);
      const docSnap = await getDoc(docRef);
      const tweet = docSnap.data();
      setThisTwt(tweet) 
      setDoesLike(tweet.userlikes.includes(getAuth().currentUser.uid))
      setDoesRetweet(tweet.userretweets.includes(getAuth().currentUser.uid))
    }
    loadtwt()      
  }, [isLiked])  

   
  async function likeTweetHere(id, likes, usrlikes){

    const doesLike = usrlikes.includes(getAuth().currentUser.uid)
    const newuserlikes = [...usrlikes] 
    const currTWT = doc(getFirestore(), "Tweets", id);
    let newlikes = likes;

    if (!doesLike){
      newlikes += 1;
      newuserlikes.push(getAuth().currentUser.uid)  
    } else {
      let index = usrlikes.indexOf(getAuth().currentUser.uid)
      newuserlikes.splice(index, 1); 
      newlikes -= 1; 
    }
    await updateDoc(currTWT, {
      likes: newlikes,
      userlikes: newuserlikes,
      });
    setIsLiked(!isLiked)
  }

  async function retweetHere(id, retweets, usrretweets){

    const doesRetweet = usrretweets.includes(getAuth().currentUser.uid)
    const newuserretweets = [...usrretweets] 
    const currTWT = doc(getFirestore(), "Tweets", id);
    let newretweets = retweets;

    if (!doesRetweet){
      newretweets += 1;
      newuserretweets.push(getAuth().currentUser.uid)  
    } else {
      let index = usrretweets.indexOf(getAuth().currentUser.uid)
      newuserretweets.splice(index, 1); 
      newretweets -= 1; 
    }
    await updateDoc(currTWT, {
      retweets: newretweets,
      userretweets: newuserretweets,
      });
    setIsLiked(!isLiked)
    
  }

  const classbutton = !doesLike ? "smalllogosdiv" : "smalllogosdiv scale-up-center";
  const classbutton2 = !doesRetweet ? "smalllogosdiv" : "smalllogosdiv scale-up-center";

 
    return (
    <div onClick={()=>{
      navigate(`/viewtweet/${props.id}`, { state: { tweetID: props.id }});
    }} className="tweet">  
      
      <img referrerPolicy="no-referrer" className="tweetuserimg" alt="" src={props.tweet.profilePicUrl}></img>
      
      <div className="toptweetdiv">
        <div className="nametimetweet">        
          <h4>{props.tweet.name}</h4>
          {props.tweet.isverified ? <img alt="" src={process.env.PUBLIC_URL + "verified.svg"} className="smalllogos verifiedlogo"></img> : null}
          {props.tweet.isverifiedgold ? <img alt="" src={process.env.PUBLIC_URL + "premiumverified.svg"} className="smalllogos verifiedlogo"></img> : null}
          <p className="timedif">@{props.tweet.at}</p> ·
          <p className="timedif">{secdif > (358 * 86400) ? date3 : secdif > 86400 ? date2 : secdif > 3600 ? Math.floor(secdif/3600)+"h" : secdif > 60 ? Math.floor(secdif/60)+"m" : secdif+"s"}</p>
        </div>

        {currentUser === props.tweet.author ? <div className="smalllogos" onClick={async(e)=>{
        e.stopPropagation()
        e.preventDefault()
        await props.deleteTweet(props.id);
        }} ><img className="smalllogos" alt="" src={process.env.PUBLIC_URL + "delete.svg"}></img></div> : null}

      </div>

      {props.tweet.tweet !== "" ? <p className="tweettext margin50">{props.tweet.tweet}</p> : null}
      

      {props.tweet.imgurl === "" ? null : <img className="onehund border16 margin50" alt="" src={props.tweet.imgurl}></img>}

      <div className="bottweetdiv">
        <div className="smalllogosdiv"> <img alt="" className="smalllogos" src={process.env.PUBLIC_URL + "comment.svg"}></img><p className="font13">{props.tweet.comments}</p></div>

        {doesRetweet ? 
          <div className={classbutton2} onClick={(e)=>{
            e.stopPropagation()
            
            retweetHere(props.id, thistwt.retweets, thistwt.userretweets)          
            }}>
          <img alt="" className="smalllogos" src={process.env.PUBLIC_URL + "retweeted.svg"}></img><p className="font13">{thistwt ? thistwt.retweets : props.tweet.retweets}</p>
          </div> :          
          <div className={classbutton2} onClick={(e)=>{
            e.stopPropagation()
            retweetHere(props.id, thistwt.retweets, thistwt.userretweets)          
            }}><img alt="" className="smalllogos" src={process.env.PUBLIC_URL + "notretweeted.svg"}></img><p className="font13">
            {thistwt ? thistwt.retweets : props.tweet.retweets}</p>
          </div>
        }

        {doesLike ?<div  className={classbutton} onClick={(e)=>{
          e.stopPropagation()          
          likeTweetHere(props.id, thistwt.likes, thistwt.userlikes)          
          }}><img alt="" className="smalllogos " src={process.env.PUBLIC_URL + "liked.svg"}></img><p className="font13">{thistwt ? thistwt.likes : thistwt.likes}</p>
        </div> : <div className={classbutton} onClick={(e)=>{
          e.stopPropagation()
          likeTweetHere(props.id, thistwt.likes, thistwt.userlikes)          
          }}><img alt="" className="smalllogos " src={process.env.PUBLIC_URL + "notliked.svg"}></img><p className="font13">{thistwt ? thistwt.likes : props.tweet.likes}</p>
        </div>}

        <p></p>
      </div>

    </div>
  );
}

export default React.memo(Tweet);;

