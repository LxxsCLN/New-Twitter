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
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from 'firebase/firestore';


function Home(props) {

  const firebaseConfig = {
    apiKey: "AIzaSyBZjFRwHGznnJMPSDhAo-nFt5zVBcU6l3c",
    authDomain: "newtwitterlxxs.web.app",
    projectId: "newtwitterlxxs",
    storageBucket: "newtwitterlxxs.appspot.com",
    messagingSenderId: "845912882937",
    appId: "1:845912882937:web:d1d5fe3a1fe71bc14c6c28"
  };
  const navigate = useNavigate();
  const app = initializeApp(firebaseConfig);  
  const provider = new GoogleAuthProvider();  
  const auth = getAuth();
  const db = getFirestore();

  
  const [isLiked, setIsLiked] = useState(false)


  async function deleteTweet(id){
    await deleteDoc(doc(db, "Tweets", id));
    setIsLiked(!isLiked)
  }  
 
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

  const [tweetsarray, setTweetsArray] = useState();


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
    const tweetQuery = await getDocs(query(collection(getFirestore(), "Tweets"), limit(40)))

    tweetQuery.forEach(async (doc2) => {

      const data2 = doc2.data()  
      const author = doc(getFirestore(), "Users", data2.author); 
      const docSnap = await getDoc(author);
      const authordata = docSnap.data() 

      twarr.push(<Tweet key={uniqid()} authordata={authordata} tweet={data2} id={doc2.id} setsingletweet={props.setsingletweet} likeTweet={likeTweet} deleteTweet={deleteTweet} retweet={retweet} />)
      let newarr = twarr.sort(compare)
    setTweetsArray(newarr)
    }); 
  }

  loadTweets() 
}, [isLiked])

  return (
    
    <div className="Home">
      <Nav />
      {tweetsarray}

      <div onClick={()=>{
        navigate("/addtweet", true)
      } } className="addtweetbutton"><img alt="" src={process.env.PUBLIC_URL + "addtweet.svg"}></img></div>

      </div>
  );
}

export default Home;