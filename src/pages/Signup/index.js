import React, { useState } from "react";
import "./Signup.css";
import { Link, useHistory } from "react-router-dom";
import { auth, firestore } from "../../services/firebase";
import { loginStrings } from "../../loginStrings";

import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const Signup = () => {
  const initialFieldValue = {
    email: "",
    password: "",
    name: "",
  };
  const [values, setValues] = useState(initialFieldValue);
  let history = useHistory();

  const Signinsee = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "white",
    backgroundColor: "#1ebea5",
    width: "100%",
    boxShadow: "0 5px 5px #808888",
    height: "10rem",
    paddingTop: "48px",
    opacity: "0.5",
    borderBottom: "5px solid green",
    justifyContent: "flex-end",
  };
  const handlechange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const handleSubmit = (e) => {
    const { name, password, email } = values;
    e.preventDefault();
    try {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(async (result) => {
          firestore
            .collection("users")
            .add({
              name,
              id: result.user.uid,
              email,
              password,
              url: "",
              description: "",
              messages: [{ notificationId: "", number: 0 }],
            })
            .then((docRef) => {
              localStorage.setItem(loginStrings.ID, result.user.uid);
              localStorage.setItem(loginStrings.Name, name);
              localStorage.setItem(loginStrings.Email, email);
              localStorage.setItem(loginStrings.Password, password);
              localStorage.setItem(loginStrings.PhotoURL, "");
              localStorage.setItem(
                loginStrings.UPLOAD_CHANGED,
                "state_changed"
              );
              localStorage.setItem(loginStrings.Description, "");
              localStorage.setItem(loginStrings.FirebaseDocumentId, docRef.id);

              setValues(initialFieldValue);
              history.push("/chat");
            })
            .catch((err) => {
              console.err("Error adding document", err);
            });
        });
    } catch (err) {
      document.getElementById("1").innerHTML =
        "Error in signing up please try again";
    }
  };

  return (
    <div>
      <CssBaseline />
      <div style={Signinsee}>
        <div>
          <Typography component="h1" variant="h5">
            Sign Up To
          </Typography>
        </div>
        <div>
          <Link to="/">
            <button className="btn">
              <i className="fa fa-home"></i> WebChat
            </button>
          </Link>
        </div>
      </div>
      <div className="formacontrooutside">
        <form className="customform" noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address-example: abc@gmail.com"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handlechange}
            value={values.email}
          />
          <div>
            <p style={{ color: "grey", fontSize: "15px", marginLeft: "0" }}>
              Password: length greater than six (alfa numeric and special
              character)
            </p>
          </div>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            autoComplete="password"
            type="password"
            autoFocus
            onChange={handlechange}
            value={values.password}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Your Name"
            name="name"
            autoComplete="name"
            autoFocus
            onChange={handlechange}
            value={values.name}
          />
          <div>
            <p style={{ color: "grey", fontSize: "15px", marginLeft: "0" }}>
              Please fill all fields and password should be greater than 6
            </p>
          </div>
          <div className="CenterAliningItems">
            <button type="submit" className="button1">
              <span>Sign Up</span>
            </button>
          </div>
          <div>
            <p style={{ color: "grey" }}>Already have an account</p>
            <Link to="/login" style={{ textDecoration: "none" }}>
              Login In
            </Link>
          </div>
          <div className="error">
            <p id="1" style={{ color: "red" }}></p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Signup;
