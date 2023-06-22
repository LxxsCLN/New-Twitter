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
  const [tweet, setTweet] = useState()
  const [comms, setComms] = useState()

  const handleChange = (event) => {
    setTweet(event.target.value);
  };

  async function deleteTweet(id){
    const orgtweet = doc(getFirestore(), "Tweets", id); 
    const tweetSnap = await getDoc(orgtweet);
    const tweetdata = tweetSnap.data() 
    if (tweetdata.comments > 0){
      tweetdata.commentsarray.forEach((com) => {
        deleteTweet(com) 
      })  
    }
    await deleteDoc(doc(db, "Tweets", id));
  }

  async function updateParentTweet(id){
    const orgtweet = doc(getFirestore(), "Tweets", id); 
    const tweetSnap = await getDoc(orgtweet);
    const tweetdata = tweetSnap.data() 
    if (tweetdata.iscomment){
      const parentTwt = doc(getFirestore(), "Tweets", tweetdata.parentid);
      const parentSnap = await getDoc(parentTwt);
      const parentdata = parentSnap.data() 
      const newcommentsarray = parentdata.commentsarray.filter(item => item !== id)
      await updateDoc(parentTwt, {
        comments: parentdata.comments - 1,
        commentsarray: newcommentsarray,
      });
    }
    await deleteTweet(id)
  }

  async function deleteComment(docid, id){
    const docRef = doc(getFirestore(), "Tweets", docid);
    const docSnap = await getDoc(docRef);
    const tweet2 = docSnap.data();
    const newcomments = tweet2.commentsarray.filter(item => item !== id)

    await updateDoc(docRef, {
      comments: tweet2.comments - 1,
      commentsarray: newcomments,
    });
    await deleteTweet(id)
    setIsLiked(!isLiked)
  }

  useEffect(()=>{

    function compare( a, b ) {
      if ( a.props.tweet.timestamp.seconds > b.props.tweet.timestamp.seconds ){
        return -1;
      }
      if ( a.props.tweet.timestamp.seconds < b.props.tweet.timestamp.seconds ){
        return 1;
      }
      return 0;
    }
    
    const loadTweets = async () => {

      const singletwt = doc(getFirestore(), "Tweets", props.thisTweet); 
      const singletwtSnap = await getDoc(singletwt);
      const singletwtdata = singletwtSnap.data() 

      let thistwt = <SingleTweet updateParentTweet={updateParentTweet} key={uniqid()} tweet={singletwtdata} id={singletwtSnap.id} handleChange={handleChange} isLiked={isLiked} setIsLiked={setIsLiked} deleteTweet={deleteTweet} />
      setTweet(thistwt) 
      if (singletwtdata.commentsarray.length > 0){
        loadComments(singletwtSnap.id, singletwtdata) 
      } else {
        setComms([])
      }
             
    }

    const loadComments = async (docid, docdata) => {
      let comments1 = []
      let counter = 0;       
      
      docdata.commentsarray.forEach(async(elem) => {
        const singletwt = doc(getFirestore(), "Tweets", elem); 
        const singletwtSnap = await getDoc(singletwt);
        const singletwtdata = singletwtSnap.data() 
        comments1.push(<Comment tweet={singletwtdata} key={uniqid()} id={singletwtSnap.id} docid={docid} deleteComment={deleteComment} setsingletweet={props.setsingletweet} />)        
        counter++;
        if (counter >= docdata.commentsarray.length){
          let newarr = comments1.sort(compare)
          setComms(newarr)
        }
      })
    }
    loadTweets()
  }, [isLiked, props.thisTweet])
   


    return (
                
      <div className="ViewTweet">
        <Nav back={true} />
        {tweet}
        {comms ? comms : null}
      </div>
    );
  }
  
  export default ViewTweet;