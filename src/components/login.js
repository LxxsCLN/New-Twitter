import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React from "react"
import { useNavigate, } from "react-router-dom";
import { useEffect, useState } from "react";

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

function Login() {
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
  const navigate = useNavigate();
  const db = getFirestore();

  
  onAuthStateChanged(auth, authStateObserver);

  async function addUser(){

    const docRef = doc(db, "Users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("already user");

    } else {
      console.log("create user");
      setDoc(doc(db, "Users", auth.currentUser.uid), {
        userid: auth.currentUser.uid,
        name: auth.currentUser.displayName,
        profilePicUrl: auth.currentUser.photoURL || null,
        timestamp: serverTimestamp(),
        isverified: false,
        isverifiedgold: false,
        at: auth.currentUser.displayName,
      });
    }
  } 

  function authStateObserver(user){
    
    if (user){      
      navigate("/home", true)
      addUser()
    }
  }  
    

  return (
    <div className="login">
      <img alt="" src={process.env.PUBLIC_URL + "logo.png"} className="loginlogo"></img>
      <h1>Bienvenido a New Twitter</h1>

      <div onClick={()=>{
        signInWithRedirect(auth, provider);
      } } id="customBtn" className="customGPlusSignIn loginbutton">
      <span className="icon"></span>
      <span className="buttonText">Ingresar</span>
    </div>
    </div>
  );
}
  
  export default Login;