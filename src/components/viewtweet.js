import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React from "react"
import { useNavigate, } from "react-router-dom";
import { useEffect, useState } from "react";
import Nav from "./nav";
import SingleTweet from "./singletweet";
import Comment from "./comment";

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



function ViewTweet(props) {

  const [tweet, setTweet] = useState()
  const [comms, setComms] = useState()

  const handleChange = (event) => {
    setTweet(event.target.value);
  };


  

  useEffect(()=>{
    
    const loadTweets = async () => {
      const querySnapshot = await getDocs(collection(getFirestore(), "Tweets"), orderBy('timestamp', 'desc'), limit(20));      
      let thistwt = "";      
      querySnapshot.forEach( async(doc) => {
        const data = doc.data()
        if (doc.id === props.thisTweet){
          thistwt = <SingleTweet key={uniqid()} tweet={data} id={doc.id} handleChange={handleChange} />
          loadComments(doc.id)
        }
      });      
      setTweet(thistwt)      
    }

    const loadComments = async (docid) => {
      let comments1 = []
      const queryComments = await getDocs(collection(getFirestore(), "Tweets", docid, "Comments"), orderBy('timestamp', 'desc'), limit(10));
      queryComments.forEach((doc2) => {
       const data2 = doc2.data()
       comments1.push(<Comment tweet={data2} key={uniqid()} />)
     }) 
     setComms(comments1)
    }

    loadTweets() 
  }, [])

   
    return (
                
      <div className="ViewTweet">
        <Nav />
        {tweet}
        {comms}
      </div>
    );
  }
  
  export default ViewTweet;