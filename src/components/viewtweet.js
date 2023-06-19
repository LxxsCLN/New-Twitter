import { getAuth} from "firebase/auth";
import React from "react"
import { useEffect, useState } from "react";
import Nav from "./nav";
import SingleTweet from "./singletweet";
import Comment from "./comment";

import uniqid from 'uniqid';

import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from 'firebase/firestore';

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

      const singletwt = doc(getFirestore(), "Tweets", props.thisTweet); 
      const singletwtSnap = await getDoc(singletwt);
      const singletwtdata = singletwtSnap.data() 

      const author = doc(getFirestore(), "Users", singletwtdata.author); 
      const docSnap = await getDoc(author);
      const authordata = docSnap.data() 

      let thistwt = <SingleTweet retweet={retweet} authordata={authordata} likeTweet={likeTweet} key={uniqid()} tweet={singletwtdata} id={singletwtSnap.id} handleChange={handleChange} isLiked={isLiked} setIsLiked={setIsLiked} deleteTweet={deleteTweet} />
      setTweet(thistwt) 
      loadComments(singletwtSnap.id)        
    }

    const loadComments = async (docid) => {
      let comments1 = []
      const queryComments = await getDocs(query(collection(getFirestore(), "Tweets", docid, "Comments"), orderBy('timestamp', 'desc'), limit(16)));
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