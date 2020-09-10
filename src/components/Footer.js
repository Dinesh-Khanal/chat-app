import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div>
      <footer>
        <div className="footer 1-box is-center">
          <h2 variant="body2" color="textSecondary" align="center">
            Copyright &copy; Coding Cafe {new Date().getFullYear()}.
          </h2>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
