import { getAuth,signOut, } from "firebase/auth";
import { initializeApp } from "firebase/app";
import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseConfig } from "../env";
function Nav(props) {

  const app = initializeApp(firebaseConfig); 
  const auth = getAuth();

  const location = useLocation()

  const [isLiked, setIsLiked] = useState(false)
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const shadow = !props.back ? "shadow nav" : "nav"

    return (
      <div className={shadow}>

          {props.back ? 
          
          <div onClick={()=>{
            navigate(-1)
            setIsLiked(!isLiked)
            
          }} className="backsvgdiv"><img  className="backsvg" alt="" src={process.env.PUBLIC_URL + "back.svg"}></img></div> 
          
          : <img referrerPolicy="no-referrer" src={user?.photoURL || "https://i.redd.it/7ayjc8s4j2n61.png"} alt="" className="userlogo"></img>}
        
        <img onClick={()=>{
            navigate("/home", true)
          }} alt="" src={process.env.PUBLIC_URL + "logo.png"} className="homelogo"></img>


        {props.back ? <div className="width28"></div> : <div className="logoutbutton" onClick={()=>{
          signOut(getAuth());
          navigate("/", true)
        }}><img alt="" src={process.env.PUBLIC_URL + "logout.svg"}></img></div> }
          

         

      </div>
    );
  }
  
  export default Nav;