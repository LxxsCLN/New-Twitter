import { GoogleAuthProvider, getAuth, } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React from "react"
import { useNavigate, } from "react-router-dom";
import {  useRef, useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import uniqid from 'uniqid';

import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes
} from 'firebase/storage';

function SingleTweet(props) {  

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

  let tweetinput = useRef("");

  const handleChange = (event) => {
    tweetinput.current = event.target.value;
  };

  function resetInput(){
    let randomString = Math.random().toString(36);
    setKeyState(randomString)
  }

  const handleImageChange = (e) => {  
    imgtweetinput.current = e.target.files[0]
    setImgSrc(URL.createObjectURL(e.target.files[0]))
  }

  const removeImage = (e) => { 
    setImgSrc("")      
    resetInput()  
    imgtweetinput.current = ""
  }

  let imgtweetinput = useRef(""); 
  const empty = useRef("")

  function handleClick(){
    empty.current.value = ""
  }
  const [thistwt, setThisTwt] = useState(props.tweet) 
  const [isLiked, setIsLiked] = useState(false)
  const [doesLike, setDoesLike] = useState(props.tweet.userlikes.includes(getAuth().currentUser.uid))
  const [doesRetweet, setDoesRetweet] = useState(props.tweet.userretweets.includes(auth.currentUser.uid))
  const [display, setDisplay] = useState(false)
  const [imgSrc, setImgSrc] = useState("")
  const [keyState, setKeyState] = useState()
  
  async function addComment(e){
    let publicImageUrl = "";
    if (imgtweetinput.current !== ""){
      let uniq = uniqid()
      const newImageRef = ref(getStorage(), `images/${uniq}`);
      await uploadBytes(newImageRef, imgtweetinput.current)
      publicImageUrl = await getDownloadURL(newImageRef);
    }

    const docRef = doc(getFirestore(), "Tweets", props.id);
    const docSnap = await getDoc(docRef);
    const tweet2 = docSnap.data();

    const userRef = doc(getFirestore(), "Users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    const userdata = userSnap.data();

    const newcommentsarray = [...tweet2.commentsarray]
  
    const newcomment = await addDoc(collection(getFirestore(), "Tweets"), {
      author: getAuth().currentUser.uid,
      tweet: tweetinput.current,
      name: userdata.name,
      profilePicUrl: getAuth().currentUser.photoURL || null,
      timestamp: serverTimestamp(),
      likes: 0,
      retweets: 0,
      at: userdata.at,
      userretweets: [],
      parentid: docSnap.id,
      comments: 0,
      iscomment: true,
      imgurl: publicImageUrl,
      commentsarray: [],
      userlikes: [],
      isverified: userdata.isverified,
      isverifiedgold: userdata.isverifiedgold,
    });
    
    
    await updateDoc(docRef, {
      comments: tweet2.comments + 1,
      commentsarray: [...newcommentsarray, newcomment.id]
      });
      tweetinput.current = ""
      imgtweetinput.current = ""
      props.setIsLiked(!props.isLiked)
  }

  const [user, loading] = useAuthState(auth);
  const currentUser = getAuth().currentUser.uid;

  const date = props.tweet.timestamp.toDate().toDateString()
  const date2 = date.slice(4, 10) + "," + date.slice(10);    

  const hoursarray = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const hoursindex = props.tweet.timestamp.toDate().getHours()
  const minutes = props.tweet.timestamp.toDate().getMinutes()
  const realhour = hoursarray[hoursindex]
  const ampm = hoursindex < 12 ? " a.m. · " : " p.m. · "
  const finaldate = realhour + ":" + minutes + ampm + date2;


  async function likeTweetHere(id, likes, usrlikes){

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

  async function retweetHere(id, retweets, usrretweets){

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

  useEffect(()=>{
    const loadtwt = async() => {
      const docRef = doc(db, "Tweets", props.id);
      const docSnap = await getDoc(docRef);
      const tweet = docSnap.data();
      setThisTwt(tweet) 
      setDoesLike(tweet.userlikes.includes(getAuth().currentUser.uid))
      setDoesRetweet(tweet.userretweets.includes(getAuth().currentUser.uid))
    }
    loadtwt()      
  }, [isLiked])  

  const classbutton = !doesLike ? "smalllogosdiv" : "smalllogosdiv scale-up-center";
  const classbutton2 = !doesRetweet ? "smalllogosdiv" : "smalllogosdiv scale-up-center";
  
  return (
    <div>
    <div className="singletweet">       
             
        <img className="tweetuserimg tweetuserimgsingle " alt="" src={props.tweet.profilePicUrl}></img>

        <div className="toptweetdiv">
        <div className="singletweetname">{props.tweet.name}   {props.tweet.isverified ? <img alt="" src={process.env.PUBLIC_URL + "verified.svg"} className="smalllogos verifiedlogo"></img> : null}
        {props.tweet.isverifiedgold ? <img alt="" src={process.env.PUBLIC_URL + "premiumverified.svg"} className="smalllogos verifiedlogo"></img> : null}</div>
        
        {currentUser === props.tweet.author ? <div onClick={async (e)=>{
        e.preventDefault()        
        await props.updateParentTweet(props.id)
        navigate("/home", true)
        }} ><img className="smalllogos" alt="" src={process.env.PUBLIC_URL + "delete.svg"}></img></div> : null}
        
        </div>
        <p className="timedif timedif2">@{props.tweet.at}</p>
        {props.tweet.tweet !== "" ? <p className="singletweettext spantwocolumn">{props.tweet.tweet}</p> : null}
        

        {props.tweet.imgurl === "" ? null : <img className="onehund border16 spantwocolumn" alt="" src={props.tweet.imgurl} onClick={(e)=>{
        e.stopPropagation()
        e.preventDefault()
        navigate(`/viewtweet/${props.id}/viewimage`)}} ></img>}

        <p className="finaldate spantwocolumn">{finaldate}</p>
        
        <div className="bottweetdiv bottweetdiv2 spantwocolumn">
        <div className="smalllogosdiv"> <img alt="" className="smalllogos2" src={process.env.PUBLIC_URL + "comment.svg"}></img><p className="font14">{props.tweet.comments}</p></div>


        {doesRetweet ? 
          <div className={classbutton2} onClick={(e)=>{
            e.stopPropagation()
            retweetHere(props.id, thistwt.retweets, thistwt.userretweets)          
            }}>
          <img alt="" className="smalllogos2" src={process.env.PUBLIC_URL + "retweeted.svg"}></img><p className="font14">{thistwt ? thistwt.retweets : props.tweet.retweets}</p>
          </div> :          
          <div className={classbutton2} onClick={(e)=>{
            e.stopPropagation()
            retweetHere(props.id, thistwt.retweets, thistwt.userretweets)          
            }}><img alt="" className="smalllogos2" src={process.env.PUBLIC_URL + "notretweeted.svg"}></img><p className="font14">
            {thistwt ? thistwt.retweets : props.tweet.retweets}</p>
          </div>
        }

         

        {doesLike ?<div className={classbutton} onClick={(e)=>{
          e.stopPropagation()
          likeTweetHere(props.id, thistwt.likes, thistwt.userlikes)          
          }}><img alt="" className="smalllogos2" src={process.env.PUBLIC_URL + "liked.svg"}></img><p className="font14">{thistwt ? thistwt.likes : props.tweet.likes}</p>
        </div> : <div className={classbutton} onClick={(e)=>{
          e.stopPropagation()
          likeTweetHere(props.id, thistwt.likes, thistwt.userlikes)          
          }}><img alt="" className="smalllogos2" src={process.env.PUBLIC_URL + "notliked.svg"}></img><p className="font14">{thistwt ? thistwt.likes : props.tweet.likes}</p>
        </div>} 
          
          </div>
        </div>

        

          {!display ? 
          <form className="replyform" onClick={() =>{
            setDisplay(!display)
          } }>
          <img className=" tweetuserimg tweetuserimgsingle " alt="" src={user.photoURL}></img>
          <input className="commentinput" placeholder="Tweet your reply!"></input>
          <button className="replybutton lowopacity" >Reply</button>
        </form> : 

        <form className="replyformbig">
        <div className="span3col graycolor replyingto font15">Replying to <p className="font15" style={{color: "black"}}> @{props.tweet.at}</p></div>
        <img className=" tweetuserimg tweetuserimgsingle2 " alt="" src={user.photoURL}></img>
          <textarea autoFocus rows={3} ref={empty} onChange={handleChange} className="commentinputbig span2cols" placeholder="Tweet your reply!"></textarea>
          {imgSrc === "" ? null : <div className="span4cols"><p></p><div className="removeimgsvgdiv" onClick={ (e) =>{
          e.preventDefault()
          removeImage();
        } }><img className="removeimgsvgsvg" alt="" src={process.env.PUBLIC_URL + "removeimgsvg.svg"} ></img></div><img className="addimageimage " alt="" src={imgSrc}></img></div> }
          
          <label htmlFor="mediaCapture" className="addimagelabel span3cols font15" style={{color: "black"}}>
          <img alt="" src={process.env.PUBLIC_URL + "addimage.svg"} className="smalllogos verifiedlogo "></img>
          Choose image
          <input onChange={(e) => {
            e.preventDefault()            
            handleImageChange(e)
          }} key={keyState} id="mediaCapture" type="file" accept="image/*"></input>
        </label>
          <button className="replybutton" onClick={(e)=>{
            e.preventDefault()
            // if (tweetinput.current === "") return
            handleClick()
            addComment()
          } } >Reply</button>
        </form>}
          
    </div>
  );
}

export default SingleTweet;