import React from "react"
import {  useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import {
  getFirestore,
  doc,
  getDoc,
} from 'firebase/firestore';


function QuoteTweet(props) {

    const classn = props.issingle ? "span2cols" : "span2cols spanone"

    const navigate = useNavigate();
    const currentdate = new Date()
    const currentdateutc = currentdate.toUTCString()
    const originaldateutc = props.tweet ? props.tweet.timestamp.toDate().toUTCString() : ""
    const currentseconds = Date.parse(currentdateutc);
    const originalseconds = Date.parse(originaldateutc);
    const secdif = (currentseconds - originalseconds)/1000  

    const date2 = originaldateutc.slice(4, 11);   
    const date3 = originaldateutc.slice(4, 11) + "," + originaldateutc.slice(11, 16); 

    return (
        <div onClick={(e)=>{
            e.stopPropagation()
            navigate(`/viewtweet/${props.quoteID}`);
        }} className={classn}>
        {props.tweet ?        

            <div className="quotetweet hover">            
      
            <div className="toptweetdiv2">
            <img referrerPolicy="no-referrer" className="quotetweetuserimg" alt="" src={props.tweet.profilePicUrl || "https://i.redd.it/7ayjc8s4j2n61.png"}></img>
            <div className="nametimetweet">        
            <h4>{props.tweet.name}</h4>
            {props.tweet.isverified ? <img alt="" src={process.env.PUBLIC_URL + "verified.svg"} className="smalllogos verifiedlogo"></img> : null}
            {props.tweet.isverifiedgold ? <img alt="" src={process.env.PUBLIC_URL + "premiumverified.svg"} className="smalllogos verifiedlogo"></img> : null}
            <p className="timedif">@{props.tweet.at}</p> ·
            <p className="timedif">{secdif > (358 * 86400) ? date3 : secdif > 86400 ? date2 : secdif > 3600 ? Math.floor(secdif/3600)+"h" : secdif > 60 ? Math.floor(secdif/60)+"m" : secdif+"s"}</p>
            </div>                   
            </div>  
            {props.tweet.tweet ? <p>{props.tweet.tweet}</p> : null}
            {props.tweet.imgurl ? <img className="onehund2 border17" alt="" src={props.tweet.imgurl}></img> : null}
            </div>
        : null}    

            
        </div>
    )
}
  
export default QuoteTweet;