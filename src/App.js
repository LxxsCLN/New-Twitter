import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
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
import { getPerformance } from 'firebase/performance'; 

import React, { useState, useEffect, } from "react";
import { BrowserRouter, Routes, Route, HashRouter, Link } from "react-router-dom";
import Login from "./components/login";
import Home from "./components/home";
import ViewTweet from "./components/viewtweet";
import Tweet from "./components/tweet";
import uniqid from 'uniqid';


function App() {
  
  

  return (
    <HashRouter>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/viewtweet" element={<ViewTweet />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
