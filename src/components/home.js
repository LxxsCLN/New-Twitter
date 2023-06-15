import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React from "react"
import { useNavigate, } from "react-router-dom";
import { useEffect, useState } from "react";
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


  
  const [tweet, setTweet] = useState("");

  async function likeTweet(id, likes, usrlikes){
    const doesLike = usrlikes.includes(getAuth().currentUser.uid)
    const newuserlikes = [...usrlikes] 
    const currTWT = doc(db, "Tweets", id);
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
  }

  const handleChange = (event) => {
    setTweet(event.target.value);
  };

  async function submitTweet(){
    try {
      await addDoc(collection(getFirestore(), "Tweets"), {
        author: getAuth().currentUser.uid,
        tweet: tweet,
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
  } 

  const [tweetsarray, setTweetsArray] = useState([]);

useEffect(()=>{
  const loadTweets = async () => {
    let twarr = []
    const querySnapshot = await getDocs(collection(getFirestore(), "Tweets"), orderBy('timestamp', 'desc'), limit(20));
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      twarr.push(<Tweet key={uniqid()} tweet={data} id={doc.id} setsingletweet={props.setsingletweet} likeTweet={likeTweet} />)
    });
    setTweetsArray(twarr)
  }
  loadTweets()
},[])


  return (
    
    <div className="Home">
      <Nav />
      {tweetsarray}
      <form className="writetweet">
        <input className="tweetinput" placeholder="What is happening?!" onChange={handleChange}></input>
        <button className="submittweet" onClick={submitTweet}>Tweet</button>
      </form>
    </div>
  );
}

export default Home;