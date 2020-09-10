import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";

function App() {
  const showToast = (type, message) => {
    switch (type) {
      case 0:
        toast.warning(message);
        break;
      case 1:
        toast.success(message);
        break;
      default:
        break;
    }
  };
  return (
    <Router>
      <ToastContainer
        autoClose={2000}
        hideProgressBar={true}
        position={toast.POSITION.BOTTOM_CENTER}
      />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route
          path="/login"
          render={(props) => <Login {...props} showToast={showToast} />}
        />
        <Route
          path="/profile"
          render={(props) => <Profile {...props} showToast={showToast} />}
        />
        <Route path="/signup" component={Signup} />
        <Route
          path="/chat"
          render={(props) => <Chat {...props} showToast={showToast} />}
        />
      </Switch>
    </Router>
  );
}

export default App;
