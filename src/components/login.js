import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React from "react"
import { useNavigate, } from "react-router-dom";
import { useEffect, useState } from "react";

function Login() {
  const firebaseConfig = {
    apiKey: "AIzaSyBZjFRwHGznnJMPSDhAo-nFt5zVBcU6l3c",
    authDomain: "newtwitterlxxs.firebaseapp.com",
    projectId: "newtwitterlxxs",
    storageBucket: "newtwitterlxxs.appspot.com",
    messagingSenderId: "845912882937",
    appId: "1:845912882937:web:d1d5fe3a1fe71bc14c6c28"
  };

  const app = initializeApp(firebaseConfig);  
  const provider = new GoogleAuthProvider();  
  const auth = getAuth();
  const navigate = useNavigate();
  
  onAuthStateChanged(getAuth(), authStateObserver);

  function authStateObserver(user){
    if (user){
      navigate("/home")
      console.log("user!")
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