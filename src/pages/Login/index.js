import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { loginStrings } from "../../loginStrings";
import { auth, firestore } from "../../services/firebase";
import "./Login.css";

import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";

const Login = ({ showToast }) => {
  const initialFieldValues = {
    email: "",
    password: "",
  };
  const [error, setError] = useState(null);
  const [values, setValues] = useState({ initialFieldValues });
  let history = useHistory();

  useEffect(() => {
    if (localStorage.getItem(loginStrings.ID)) {
      showToast(1, "Login success");
      history.push("./chat");
    }
  }, [history, showToast]);

  const paper = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingLeft: "10px",
    paddingRight: "10px",
  };
  const rightcomponent = {
    boxShadow: "0 80px #808888",
    backgroundColor: "smokegrey",
  };
  const root = {
    height: "100vh",
    background: "linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)",
    marginBottom: "50px",
  };
  const Signinsee = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "white",
    marginBottom: "20px",
    backgroundColor: "#1ebea5",
    width: "100%",
    boxShadow: "0 5px 5px #808888",
    height: "10rem",
    paddingTop: "48px",
    opacity: "0.5",
    borderBottom: "5px solid green",
  };
  const form = {
    width: "100%",
    marginTop: "50px",
  };
  const avatar = {
    backgroundColor: "green",
  };

  const handlechange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { email, password } = values;
    await auth
      .signInWithEmailAndPassword(email, password)
      .then(async (result) => {
        let user = result.user;
        if (user) {
          await firestore
            .collection("users")
            .where("id", "==", user.uid)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                localStorage.setItem(loginStrings.FirebaseDocumentId, doc.id);
                localStorage.setItem(loginStrings.ID, doc.data().id);
                localStorage.setItem(loginStrings.Name, doc.data().name);
                localStorage.setItem(loginStrings.Email, doc.data().email);
                localStorage.setItem(
                  loginStrings.Password,
                  doc.data().password
                );
                localStorage.setItem(loginStrings.PhotoURL, doc.data().url);
                localStorage.setItem(
                  loginStrings.Description,
                  doc.data().description
                );
              });
            });
        }
        history.push("/chat");
      })
      .catch((err) => {
        setError("Login Problem: incorrect email/password or poor internet");
      });
  };

  return (
    <Grid container component="main" style={root}>
      <CssBaseline />
      <Grid item xs={1} sm={4} md={7} className="image">
        <div className="image1"></div>
      </Grid>
      <Grid item xs={12} sm={8} md={5} style={rightcomponent} elevation={6}>
        <div style={Signinsee}>
          <Avatar style={avatar}>
            <LockOutlinedIcon width="50px" height="50px" />
          </Avatar>
          <Typography componenet="h1" variant="h5">
            Sign in To
          </Typography>
          <Link to="/">
            <button className="btn">
              <i className="fa fa-home"></i> WebChat
            </button>
          </Link>
        </div>
        <div style={paper}>
          <form style={form} noValidate onSubmit={handleSubmit}>
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Typography>
              {error ? <p style={{ color: "red" }}>{error}</p> : null}
            </Typography>
            <div className="CenterAliningItems">
              <button className="button1" type="submit">
                <span>Login In</span>
              </button>
            </div>
            <div className="CenterAliningItems">
              <p>Don't have an account?</p>
              <Link to="/signup">Sign Up</Link>
            </div>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default Login;
