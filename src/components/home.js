import { GoogleAuthProvider, getAuth,  } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React from "react"
import { useNavigate, } from "react-router-dom";
import { useEffect, useState,  } from "react";
import Nav from "./nav";
import Tweet from "./tweet";
import uniqid from 'uniqid';

import {
  getFirestore,
  collection,
  query,
  limit,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import { firebaseConfig } from "../env";
function Home() {

  const navigate = useNavigate();
  const app = initializeApp(firebaseConfig);  
  const provider = new GoogleAuthProvider();  
  const auth = getAuth();
  const db = getFirestore();
  const [tweetsarray, setTweetsArray] = useState();
  const [isLiked, setIsLiked] = useState(false)
  const [hidden, setHidden] = useState(true)
  const [quoteID, setQuoteID] = useState()

  function hiddenHandler(){
    setHidden(!hidden)  }

  function quoteIDHandler(id){
    setQuoteID(id)
  }

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
    setTweetsArray(tweetsarray)
    setIsLiked(!isLiked)
  }     


  useEffect(()=>{
    const loadTweets = async () => {

      function compare( a, b ) {
        if ( a.props.tweet.timestamp.seconds > b.props.tweet.timestamp.seconds ){
          return -1;
        }
        if ( a.props.tweet.timestamp.seconds < b.props.tweet.timestamp.seconds ){
          return 1;
        }
        return 0;
      }
        
      let twarr = []
      const tweetQuery = await getDocs(query(collection(getFirestore(), "Tweets"), limit(25)))
      if(tweetQuery._snapshot.docs.sortedSet.root.size === 0){      
        setTweetsArray([])      
      } else {
          tweetQuery.forEach(async (doc2) => {
          const data2 = doc2.data()  
          const author = doc(getFirestore(), "Users", data2.author); 
          const docSnap = await getDoc(author);
          const authordata = docSnap.data() 

          if (!data2.iscomment) {
            twarr.push(<Tweet key={uniqid()} authordata={authordata} tweet={data2} id={doc2.id} quoteIDHandler={quoteIDHandler} deleteTweet={deleteTweet} hiddenHandler={hiddenHandler} setTweetsArray={setTweetsArray} tweetsarray={tweetsarray} />)
            if (twarr.length > 1){
              let newarr = twarr.sort(compare)
              setTweetsArray(newarr)
            } else{
              setTweetsArray(twarr)
            }          
          }      
          })
        }    
    }
    loadTweets() 
  }, [isLiked, hidden])


  return (
    
    <div className="Home">
      <Nav />
      {tweetsarray}

      <div onClick={()=>{
        navigate("/addtweet", true)
      }} className="addtweetbutton"><img alt="" src={process.env.PUBLIC_URL + "addtweet.svg"}></img></div> 
      </div>
      
  );
}

export default Home;