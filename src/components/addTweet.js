import {  getAuth, } from "firebase/auth";
import React from "react"
import { useNavigate, } from "react-router-dom";
import {  useRef } from "react";


import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import Nav from "./nav";


function AddTweet() {

    const navigate = useNavigate();

    const handleChange = (event) => {
        tweetinput.current = event.target.value;
      };

    let tweetinput = useRef("");      
    const empty = useRef("")    

    async function submitTweet(){
      
        try {
          const docRef = doc(getFirestore(), "Users", getAuth().currentUser.uid);
          const docSnap = await getDoc(docRef);
          const authordata = docSnap.data()

          await addDoc(collection(getFirestore(), "Tweets"), {
            author: getAuth().currentUser.uid,
            tweet: tweetinput.current,
            name: authordata.name,
            at: authordata.at,
            profilePicUrl: getAuth().currentUser.photoURL || null,
            timestamp: serverTimestamp(),
            likes: 0,
            retweets: 0,
            comments: 0,
            commentsarray: [],
            userlikes: [],
            userretweets: [],
            iscomment: false,
            isverified: authordata.isverified,
            isverifiedgold: authordata.isverifiedgold,
          });
          navigate("/home", true)
        }
        catch(error) {
          console.error('Error writing new message to Firebase Database', error);
        }
        tweetinput.current = ""
        
      } 
  
    return (
      <div>
        <Nav back={true} />


        <form className="writetweet">
        <img className=" tweetuserimg tweetuserimgsingle span3rows" alt="" src={getAuth().currentUser.photoURL}></img>
        <div className="everyone">Everyone <img alt="" src={process.env.PUBLIC_URL + "bottomarrow.svg"} className="smalllogos"></img></div>
        <button className="submittweet replybutton" onClick={(e) => {
          e.preventDefault()
          if (tweetinput.current === "") return;
          submitTweet()
        }}>Tweet</button>
        <textarea rows={3} className="tweetinput span2cols" placeholder="What is happening?!" onChange={(e) => {
            handleChange(e)
        }} ref={empty}></textarea>        
        <div className="everyonecanreply span3cols"><img alt="" src={process.env.PUBLIC_URL + "world.svg"} className="smalllogos"></img>Everyone can reply</div>
      </form>  

      

      </div>
    )
  }
  
  export default AddTweet;