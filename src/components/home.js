import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React from "react"
import { useNavigate, } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Nav from "./nav";
import Tweet from "./tweet";
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

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

import { getMessaging, getToken, onMessage } from 'firebase/messaging';


function Home(props) {
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
  const db = getFirestore();

  let tweetinput = useRef("");
  
  const [isLiked, setIsLiked] = useState(false)
 
  async function likeTweet(id, likes, usrlikes){

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

  const handleChange = (event) => {
    tweetinput.current = event.target.value;
  };

  async function submitTweet(){
    try {
      await addDoc(collection(getFirestore(), "Tweets"), {
        author: getAuth().currentUser.uid,
        tweet: tweetinput.current,
        name: getAuth().currentUser.displayName,
        profilePicUrl: getAuth().currentUser.photoURL || null,
        timestamp: serverTimestamp(),
        likes: 0,
        comments: 0,
        userlikes: [],
      });
    }
    catch(error) {
      console.error('Error writing new message to Firebase Database', error);
    }
    tweetinput.current = ""
    setIsLiked(!isLiked)
  } 

  const [tweetsarray, setTweetsArray] = useState([]);


useEffect(()=>{
  const loadTweets = async () => {
    let twarr = []
    const tweetQuery = await getDocs(query(collection(getFirestore(), "Tweets"), orderBy("timestamp", "desc"), limit(20)))
    tweetQuery.forEach((doc) => {
      const data = doc.data()      
      twarr.push(<Tweet key={uniqid()} tweet={data} id={doc.id} setsingletweet={props.setsingletweet} likeTweet={likeTweet} />)
    });
    setTweetsArray(twarr)
  }
  loadTweets()
}, [isLiked])


  return (
    
    <div className="Home">
      <Nav submitTweet={submitTweet} handleChange={handleChange} />
      {tweetsarray}
      </div>
  );
}

export default Home;