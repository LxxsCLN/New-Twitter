import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
} from 'firebase/auth';
import {
  getFirestore,
} from 'firebase/firestore';


import React, { useState, } from "react";
import { Routes, Route, HashRouter,  } from "react-router-dom";
import Login from "./components/login";
import Home from "./components/home";
import ViewTweet from "./components/viewtweet";
import AddTweet from './components/addTweet';


function App() {

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
  const db = getFirestore();
    
  
  const [thisTweet, setThisTweet] = useState()

  function setsingletweet(docid){
    setThisTweet(docid)
  }

  return (
    <HashRouter>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home setsingletweet={setsingletweet} />} />
      <Route path="/viewtweet" element={<ViewTweet thisTweet={thisTweet} setsingletweet={setsingletweet} />} />
      <Route path='/addtweet' element={<AddTweet />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
