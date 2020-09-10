import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { images } from "../../projectimages";

const Home = () => {
  return (
    <div>
      <Header />
      <div className="splash-container">
        <div className="splash">
          <h1 className="splash-head">WEB CHAT APP</h1>
          <p className="splash-subhead">Let's talk with our loved ones</p>
          <div id="custom-button-wrapper">
            <Link to="/login">
              <div className="my-super-cool-btn">
                <div className="dots-container">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
                <span className="buttoncooltext">Get Started</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="content-wrapper">
        <div className="content">
          <h2 className="content-head is-center">
            Features of WebChat Application
          </h2>
          <div className="Appfeatures">
            <div className="contenthead">
              <h3 className="content-subhead">Get Started Quickly</h3>
              <p>
                Just register yourself with this app and start chating with your
                loved ones
              </p>
            </div>
            <div className="1-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
              <h3 className="content-subhead">Firebase Authentication</h3>
              <p>Firebase Authentication has been implemented in this app</p>
            </div>
            <div className="1-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
              <h3 className="content-subhead">Media</h3>
              <p>
                You can share images with your friends for better experience
              </p>
            </div>
            <div className="1-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
              <h3 className="content-subhead">Updates</h3>
              <p>
                We will working with new fetures for this app for better
                experience in future
              </p>
            </div>
          </div>
        </div>
        <div className="AppfeaturesFounder">
          <div className="1-box-lrg is-center pure-u-1 pure-u-md-1-2 pure-u-lg-2-5">
            <img
              width="300"
              src={images.dinesh}
              alt="File Icons"
              className="pure-img-responsive"
            />
          </div>
          <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-3-5">
            <h2 className="content-head content-head-ribbon">Dinesh Khanal</h2>
            <p style={{ color: "white" }}>The Founder of Coding Cafe</p>
            <p style={{ color: "white" }}>
              Currently working at Coding Cafe and busy to explore new ideas
              with new technologies being developed
            </p>
          </div>
        </div>
        <div className="content">
          <h2 className="content-head is-center">Who We Are?</h2>
          <div className="Appfeatures">
            <div className="l-box-lrg pure-u-1 pure-u-md-2-5">
              <form className="pure-form pure-form-stacked">
                <fieldset>
                  <label htmlFor="name">Your Name</label>
                  <input id="name" type="text" placeholder="Your Name" />
                  <label htmlFor="email">Your Email</label>
                  <input id="email" type="text" placeholder="Your Email" />
                  <label htmlFor="password">Your Password</label>
                  <input
                    id="password"
                    type="text"
                    placeholder="Your Password"
                  />
                  <button type="submit" className="pure-button">
                    Sign Up
                  </button>
                </fieldset>
              </form>
            </div>
            <div className="l-box-lrg pure-u-1 pure-u-md-3-5">
              <h4>Contact Us</h4>
              <p>
                For any question or suggestion you can directly contact us on
                our Facebook Page
                <a href="www.facebook.com"> http://www.facebook.com</a>
              </p>
              <p>
                Twitter:<a href="www.twitter.com"> http://www.twitter.com</a>
              </p>
              <p>
                Facebook:<a href="www.facebook.com"> http://www.twitter.com</a>
              </p>
              <p>
                Instagram:
                <a href="www.instagram.com"> http://www.instagram.com</a>
              </p>
              <h4>More Information</h4>
              <p>To whom it may concern</p>
              <p>This App is developed for learning purpose</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
