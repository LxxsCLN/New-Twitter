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
import ViewImage from './components/viewImage';
import { firebaseConfig } from './env';

function App() {

  const app = initializeApp(firebaseConfig);  
  const provider = new GoogleAuthProvider();  
  const auth = getAuth();
  const db = getFirestore();
    
  
  
  return (
    <HashRouter>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path={`/viewtweet/:tweetID`} element={<ViewTweet  />} />
      <Route path='/addtweet' element={<AddTweet />} />
      <Route path='/addtweet/quote/:quoteID' element={<AddTweet />} />
      <Route path='/viewtweet/:tweetID/viewimage' element={<ViewImage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
