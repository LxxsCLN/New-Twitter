import { GoogleAuthProvider, getAuth, } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React from "react"
import { useNavigate, } from "react-router-dom";
import {  useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

function SingleTweet(props) {

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
    const docRef = doc(getFirestore(), "Tweets", props.id);
    const docSnap = await getDoc(docRef);
    const tweet2 = docSnap.data();

    const userRef = doc(getFirestore(), "Users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    const userdata = userSnap.data();

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
        userlikes: [],
        isverified: userdata.isverified,
        isverifiedgold: userdata.isverifiedgold,
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
  const [user, loading] = useAuthState(auth);
  const currentUser = getAuth().currentUser.uid;
  const doesLike = props.tweet.userlikes.includes(getAuth().currentUser.uid)
  const doesRetweet = props.tweet.userretweets.includes(getAuth().currentUser.uid)

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
             
        <img className=" tweetuserimg tweetuserimgsingle " alt="" src={props.authordata.profilePicUrl}></img>

        <div className="toptweetdiv">
        <div className="singletweetname">{props.authordata.name}   {props.tweet.isverified ? <img alt="" src={process.env.PUBLIC_URL + "verified.svg"} className="smalllogos verifiedlogo"></img> : null}
        {props.tweet.isverifiedgold ? <img alt="" src={process.env.PUBLIC_URL + "premiumverified.svg"} className="smalllogos verifiedlogo"></img> : null}</div>
        {currentUser === props.tweet.author ? <div onClick={(e)=>{
        e.preventDefault()
        props.deleteTweet(props.id)
        navigate("/home", true)
        }} ><img className="smalllogos" alt="" src={process.env.PUBLIC_URL + "delete.svg"}></img></div> : null}
        
        </div>
        <p className="timedif">@{props.authordata.at}</p>
        <p className="singletweettext spantwocolumn">{props.tweet.tweet}</p>
        <p className="finaldate spantwocolumn">{finaldate}</p>
        
          <div className="bottweetdiv bottweetdiv2 spantwocolumn">
          <div className="smalllogosdiv"> <img alt="" className="smalllogos2" src={process.env.PUBLIC_URL + "comment.svg"}></img><p className="font14">{props.tweet.comments}</p></div>


        {doesRetweet ? 
          <div className="smalllogosdiv" onClick={(e)=>{
            e.stopPropagation()
            props.retweet(props.id, props.tweet.retweets, props.tweet.userretweets)          
            }}>
          <img alt="" className="smalllogos2" src={process.env.PUBLIC_URL + "retweeted.svg"}></img><p className="font14">{props.tweet.retweets}</p>
          </div> :          
          <div className="smalllogosdiv" onClick={(e)=>{
            e.stopPropagation()
            props.retweet(props.id, props.tweet.retweets, props.tweet.userretweets)          
            }}><img alt="" className="smalllogos2" src={process.env.PUBLIC_URL + "notretweeted.svg"}></img><p className="font14">
            {props.tweet.retweets}</p>
          </div>
        }

         

{doesLike ?<div className="smalllogosdiv" onClick={(e)=>{
          e.stopPropagation()
          props.likeTweet(props.id, props.tweet.likes, props.tweet.userlikes)          
          }}><img alt="" className="smalllogos2" src={process.env.PUBLIC_URL + "liked.svg"}></img><p className="font14">{props.tweet.likes}</p>
        </div> : <div className="smalllogosdiv" onClick={(e)=>{
          e.stopPropagation()
          props.likeTweet(props.id, props.tweet.likes, props.tweet.userlikes)          
          }}><img alt="" className="smalllogos2" src={process.env.PUBLIC_URL + "notliked.svg"}></img><p className="font14">{props.tweet.likes}</p>
        </div>} 
          
          </div>
        </div>

        <form className="replyform">
        <img className=" tweetuserimg tweetuserimgsingle " alt="" src={user.photoURL}></img>
          <input ref={empty} onChange={handleChange} className="commentinput" placeholder="Tweet your reply!"></input>
          <button className="replybutton" onClick={(e)=>{
            e.preventDefault()
            if (tweetinput.current === "") return
            handleClick()
            addComment()
          } } >Reply</button>
        </form>


    </div>
  );
}

export default SingleTweet;