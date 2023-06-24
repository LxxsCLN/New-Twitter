import {  getAuth, } from "firebase/auth";
import React from "react"
import {  useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  getFirestore,
  doc,
  getDoc,
} from 'firebase/firestore';

import Nav from "./nav";

function ViewImage() {

    const { tweetID } = useParams()
    const auth = getAuth();
    const [thistwt, setThisTwt] = useState() 

    useEffect(()=>{

        const loadTweets = async () => {    
          const twt = doc(getFirestore(), "Tweets", tweetID); 
          const twtSnap = await getDoc(twt);
          const twtdata = twtSnap.data() 
          setThisTwt(twtdata)                    
        }
    
        loadTweets()
      }, [tweetID])

    return (
        <div className="viewimagediv">
            <Nav back={true} />
            <img className="viewimageimg" alt="" src={thistwt ? thistwt.imgurl : ""}></img>
            <p></p>
            </div>
    )
}
  
export default ViewImage;