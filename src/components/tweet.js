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
import QuoteTweet from "./quotetweet";
import { firebaseConfig } from "../env";
function Tweet(props) {

  initializeApp(firebaseConfig);   
  const auth = getAuth();

  const [thistwt, setThisTwt] = useState(props.tweet)  
  const [quotedata, setquotedata] = useState()  
  
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

      if (props.tweet.isquote){
        const docRef = doc(db, "Tweets", props.tweet.quoteto);
        const docSnap = await getDoc(docRef);
        const tweet = docSnap.data();
        setquotedata(tweet)
      }
    }
    loadtwt().then(() => {
      let div = document.getElementById(`${props.id}`)      
      if (div) div.style.pointerEvents = 'auto';
    })    
  }, [isLiked])  

  let classbutton = !doesLike ? "smalllogosdiv" : "smalllogosdiv scale-up-center";
  let classbutton2 = !doesRetweet ? "smalllogosdiv" : "smalllogosdiv scale-up-center";
  let likesrc = !doesLike ? "notliked.svg" : "liked.svg"
  let retweetsrc = !doesRetweet ? "notretweeted.svg" : "retweeted.svg"
   
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

  const [hidden, setHidden] = useState(true)

  function hiddenHandler(){
    setHidden(!hidden)  
  }
 
    return (
    <div onClick={()=>{
      navigate(`/viewtweet/${props.id}`);
    }} className="tweet">  
      
      <img referrerPolicy="no-referrer" className="tweetuserimg" alt="" src={props.tweet.profilePicUrl || "https://i.redd.it/7ayjc8s4j2n61.png"}></img>
      
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
      

      {props.tweet.imgurl === "" ? null : <img className="onehund border16 margin50" alt="" src={props.tweet.imgurl} onClick={(e)=>{
        e.stopPropagation()
        e.preventDefault()
        navigate(`/viewtweet/${props.id}/viewimage`);
      }}></img>}

      
      {props.tweet.isquote ? null : <p></p>}

      {props.tweet.isquote ? <QuoteTweet quoteID={thistwt.quoteto} tweet={quotedata} issingle={false} /> : null}
      {props.tweet.tweet && props.tweet.imgurl ? <p></p> : null}
      <p></p>
      <p></p>
      <div className="bottweetdiv">

      

        <div className="smalllogosdiv"> <img alt="" className="smalllogos" src={process.env.PUBLIC_URL + "comment.svg"}></img><p className="font13">{props.tweet.comments}</p></div>

        <div className={classbutton2} onClick={(e)=>{
          e.stopPropagation()
          hiddenHandler()         
          }}>
        <img alt="" className="smalllogos" src={process.env.PUBLIC_URL + retweetsrc}></img><p className="font13">{thistwt ? thistwt.retweets : props.tweet.retweets}</p>
        </div>

        <div id={props.id} className={classbutton} onClick={(e)=>{
          e.stopPropagation()
          let div = document.getElementById(`${props.id}`);
          div.style.pointerEvents = "none"
          if (div.classList.contains("scale-up-center")){
            div.className = "smalllogosdiv"
            div.firstChild.src = "notliked.svg"
            div.lastChild.innerText = Number(div.lastChild.innerText) - 1
          } else {
            div.className = "smalllogosdiv scale-up-center"
            div.firstChild.src = "liked.svg"
            div.lastChild.innerText = Number(div.lastChild.innerText) + 1
          }
          likeTweetHere(props.id, thistwt.likes, thistwt.userlikes)          
          }}><img alt="" className="smalllogos " src={process.env.PUBLIC_URL + likesrc} onClick={() => {return false}}></img><p className="font13" onClick={() => {return false}}>{thistwt ? thistwt.likes : props.tweet.likes}</p>
        </div>

        <p></p>

      </div>

      {hidden ? null : <div onClick={(e)=>{
        e.stopPropagation()
        hiddenHandler()
      }} className="overlay">
        <div  className="typeofquotediv">

          <div className="smalllogosdiv" onClick={() =>{
            retweetHere(props.id, thistwt.retweets, thistwt.userretweets)
          }}>
            <img alt="" src={process.env.PUBLIC_URL + "retweet.svg"}></img>
            <p>{doesRetweet ? "Undo Retweet" : "Retweet"}</p></div>

          <div className="smalllogosdiv" onClick={(e)=>{
            e.stopPropagation()
            navigate(`/addtweet/quote/${props.id}`, true)
          }}>
            <img alt="" src={process.env.PUBLIC_URL + "quoteretweet.svg"}></img>
            <p>Quote Tweet</p></div>

          <button className="cancelquote" onClick={(e)=>{
            e.preventDefault()
            e.stopPropagation()
            hiddenHandler()
          }}>Cancel</button>

        </div>
      </div> }

    </div>
  );
}

export default React.memo(Tweet);;

