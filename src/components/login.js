import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React from "react"
import { useNavigate, } from "react-router-dom";

import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { firebaseConfig } from "../env";
function Login() {
  
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
    } else {
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
    
//signInAnonymously(auth)
  return (
    <div className="login">
      <img alt="" src={process.env.PUBLIC_URL + "logo.png"} className="loginlogo"></img>
      <h1>New Twitter</h1>

      <div onClick={()=>{
        signInWithRedirect(auth, provider);
      } } id="customBtn" className="customGPlusSignIn loginbutton">
      <span className="icon"></span>
      <span className="buttonText">Log in</span>
      </div>
      <div onClick={()=>{
        signInAnonymously(auth);
      }} id="customBtn2" className="customGPlusSignIn loginbutton">
      <span className="icon2"></span>
      <span className="buttonText">Guest</span>
      </div>
    </div>
  );
}
  
  export default Login;