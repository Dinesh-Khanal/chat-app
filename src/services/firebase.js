import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBBgNNjp1iP_i9-jZPq2YijNSizo6E-db8",
  authDomain: "webchat-7ed02.firebaseapp.com",
  databaseURL: "https://webchat-7ed02.firebaseio.com",
  projectId: "webchat-7ed02",
  storageBucket: "webchat-7ed02.appspot.com",
  messagingSenderId: "1074632531098",
  appId: "1:1074632531098:web:1151cab5413789f513d323",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();
export { auth, firestore, storage };
