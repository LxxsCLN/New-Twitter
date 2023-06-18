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
  const [isLiked, setIsLiked] = useState(false)
  const db = getFirestore();

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
  

  async function retweet(id, retweets, usrretweets){

    const doesLike = usrretweets.includes(getAuth().currentUser.uid)
    const newuserretweets = [...usrretweets] 
    const currTWT = doc(getFirestore(), "Tweets", id);
    let newretweets = retweets;

    if (!doesLike){
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


  async function likeComment(docid, id, likes, usrlikes){

    const doesLike = usrlikes.includes(getAuth().currentUser.uid)
    const newuserlikes = [...usrlikes] 
    const currTWT = doc(getFirestore(), "Tweets", docid, "Comments", id);
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

  async function retweetComment(docid, id, retweets, usrretweets){

    const doesRetweet = usrretweets.includes(getAuth().currentUser.uid)
    const newuserretweets = [...usrretweets] 
    const currTWT = doc(getFirestore(), "Tweets", docid, "Comments", id);
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

  async function deleteTweet(id){
    await deleteDoc(doc(db, "Tweets", id));
    setIsLiked(!isLiked)
  }
 
  const [tweet, setTweet] = useState()
  const [comms, setComms] = useState()

  const handleChange = (event) => {
    setTweet(event.target.value);
  };


  async function deleteComment(docid, id){
    const docRef = doc(getFirestore(), "Tweets", docid);
    const docSnap = await getDoc(docRef);
    const tweet2 = docSnap.data();

    await deleteDoc(doc(db, "Tweets", docid, "Comments", id));

    await updateDoc(docRef, {
      comments: tweet2.comments - 1
    });
    
    setIsLiked(!isLiked)
  }



  useEffect(()=>{
    
    const loadTweets = async () => {
      const querySnapshot = await getDocs(collection(getFirestore(), "Tweets"), orderBy('timestamp', 'desc'), limit(20));      
      let thistwt = "";      
      querySnapshot.forEach( async(doc) => {
        const data = doc.data()
        if (doc.id === props.thisTweet){
          thistwt = <SingleTweet retweet={retweet} likeTweet={likeTweet} key={uniqid()} tweet={data} id={doc.id} handleChange={handleChange} isLiked={isLiked} setIsLiked={setIsLiked} deleteTweet={deleteTweet} />
          loadComments(doc.id)
        }
      });      
      setTweet(thistwt)      
    }

    const loadComments = async (docid) => {
      let comments1 = []
      const queryComments = await getDocs(query(collection(getFirestore(), "Tweets", docid, "Comments"), orderBy('timestamp', 'desc'), limit(10)));
      queryComments.forEach((doc2) => {
       const data2 = doc2.data()
       comments1.push(<Comment retweetComment={retweetComment} tweet={data2} key={uniqid()} id={doc2.id} docid={docid} likeComment={likeComment} deleteComment={deleteComment} />)
     }) 
     setComms(comments1)
    }

    loadTweets() 

  }, [isLiked])

   
    return (
                
      <div className="ViewTweet">
        <Nav back={true} />
        {tweet}
        {comms}
      </div>
    );
  }
  
  export default ViewTweet;