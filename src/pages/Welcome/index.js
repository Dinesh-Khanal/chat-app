import React from "react";
import "./Welcome.css";

const index = ({ currentUserName, currentUserPhoto }) => {
  return (
    <div className="viewWelcomeBoard">
      <img src={currentUserPhoto} alt="" className="avatarWelcome" />
      <span className="textTitleWelcome">{`Welcome, ${currentUserName}`}</span>
      <span className="textDesciptionWelcome">Let's connect the World</span>
    </div>
  );
};

export default index;
