import {  getAuth, } from "firebase/auth";
import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom";
import {  useRef, useState } from "react";
import uniqid from 'uniqid';

import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes
} from 'firebase/storage';

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

import Nav from "./nav";
import QuoteTweet from "./quotetweet";

function AddTweet() {

    const { quoteID } = useParams()
    const db = getFirestore();  
    console.log("quoteid: ", quoteID)

    const [quotedata, setquotedata] = useState()

    const [imgSrc, setImgSrc] = useState("")
    const navigate = useNavigate();
    const [keyState, setKeyState] = useState()

    function resetInput(){
      let randomString = Math.random().toString(36);
      setKeyState(randomString)
    }

    const handleChange = (event) => {
        tweetinput.current = event.target.value;
      };

    const handleImageChange = (e) => {  
      imgtweetinput.current = e.target.files[0]
      setImgSrc(URL.createObjectURL(e.target.files[0]))
    }

    const removeImage = (e) => { 
      setImgSrc("")      
      resetInput()  
      imgtweetinput.current = ""
    }

    let tweetinput = useRef(""); 
    let imgtweetinput = useRef("");     
    let empty = useRef("");    

    useEffect(()=>{
      async function loadquote(){
        
          const docRef = doc(db, "Tweets", quoteID);
          const docSnap = await getDoc(docRef);
          const tweet = docSnap.data();
          setquotedata(tweet)
      }
      if (quoteID){
      loadquote()}
    },[])

    

    async function submitTweet(){
      let publicImageUrl = "";
      if (imgtweetinput.current !== ""){
        let uniq = uniqid()
        const newImageRef = ref(getStorage(), `images/${uniq}`);
        await uploadBytes(newImageRef, imgtweetinput.current)
        publicImageUrl = await getDownloadURL(newImageRef);
      }
        try {
          const docRef = doc(getFirestore(), "Users", getAuth().currentUser.uid);
          const docSnap = await getDoc(docRef);
          const authordata = docSnap.data()
          const isquo = quoteID ? true : false;
          const whatquo = quoteID ? quoteID : "";

          await addDoc(collection(getFirestore(), "Tweets"), {
            author: getAuth().currentUser.uid,
            tweet: tweetinput.current,
            name: authordata.name,
            at: authordata.at,
            profilePicUrl: getAuth().currentUser.photoURL || null,
            timestamp: serverTimestamp(),
            likes: 0,
            retweets: 0,
            comments: 0,
            imgurl: publicImageUrl,
            commentsarray: [],
            userlikes: [],
            userretweets: [],
            isquote: isquo,
            quoteto: whatquo,
            iscomment: false,
            isverified: authordata.isverified,
            isverifiedgold: authordata.isverifiedgold,
          });
          navigate("/home", true)
        }
        catch(error) {
          console.error('Error writing new message to Firebase Database', error);
        }
        tweetinput.current = ""
        imgtweetinput.current = ""
      } 
  
    return (
      <div>
        <Nav back={true} />


        <form className="writetweet">
        <img className=" tweetuserimg tweetuserimgsingle span3rows" alt="" src={getAuth().currentUser.photoURL}></img>
        <div className="everyone">Everyone <img alt="" src={process.env.PUBLIC_URL + "bottomarrow.svg"} className="smalllogos"></img></div>
        <button className="submittweet replybutton" onClick={(e) => {
          e.preventDefault()
          if (tweetinput.current === "" && imgtweetinput.current === "") return;
          submitTweet()
        }}>Tweet</button>
        <textarea rows={3} className="tweetinput span2cols" placeholder="What is happening?!" onChange={(e) => {
            handleChange(e)
        }} ref={empty}></textarea> 
                
        {imgSrc === "" ? null : <div className="span4cols"><p></p><div className="removeimgsvgdiv" onClick={ (e) =>{
          e.preventDefault()
          removeImage();
        } }><img className="removeimgsvgsvg" alt="" src={process.env.PUBLIC_URL + "removeimgsvg.svg"} ></img></div><img className="addimageimage " alt="" src={imgSrc}></img></div> }
        
        {quoteID ? <p></p> : null}
        {quoteID ? <QuoteTweet quoteID={quoteID} tweet={quotedata} /> : null}
        

        <label htmlFor="mediaCapture" className="addimagelabel span3cols">
          <img alt="" src={process.env.PUBLIC_URL + "addimage.svg"} className="smalllogos verifiedlogo"></img>
          Choose image
          <input onChange={(e) => {
            e.preventDefault()            
            handleImageChange(e)
          }} key={keyState} id="mediaCapture" type="file" accept="image/*"></input>
        </label>   
      </form>  
      <div className="everyonecanreply span3cols"><img alt="" src={process.env.PUBLIC_URL + "world.svg"} className="smalllogos"></img>Everyone can reply</div>
      

      </div>
    )
  }
  
  export default AddTweet;