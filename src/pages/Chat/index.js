import React, { useState, useEffect } from "react";
import { auth, firestore } from "../../services/firebase";
import { useHistory } from "react-router-dom";
import { loginStrings } from "../../loginStrings";
import "./Chat.css";
import ChatBox from "../ChatBox";
import Welcome from "../Welcome";

const Chat = ({ showToast }) => {
  const [currentPeerUser, setCurrentPeerUser] = useState(null);
  const [
    displayedContactSwitchedNotification,
    setDisplayedContactSwitchedNotification,
  ] = useState([]);
  const [notificationMessagesErase, setNotificationMessagesErase] = useState(
    []
  );
  const [displayedContacts, setDisplayedContacts] = useState([]);
  const currentUserName = localStorage.getItem(loginStrings.Name);
  const currentUserId = localStorage.getItem(loginStrings.ID);
  const currentUserPhoto = localStorage.getItem(loginStrings.PhotoURL);
  const currentUserDocumentId = localStorage.getItem(
    loginStrings.FirebaseDocumentId
  );
  const currentUserMessages = [];
  let history = useHistory();

  useEffect(() => {
    firestore
      .collection("users")
      .doc(currentUserDocumentId)
      .get()
      .then((doc) => {
        doc.data().messages.forEach((item) => {
          currentUserMessages.push({
            notificationId: item.notificationId,
          });
        });
        setDisplayedContactSwitchedNotification(currentUserMessages);
      });
  }, [currentUserDocumentId, currentUserMessages]);

  const getListUser = async () => {
    const searchUsers = [];
    const result = await firestore.collection("users").get();
    if (result.docs.length > 0) {
      let listUsers = [];
      listUsers = [...result.docs];
      listUsers.forEach((item, index) => {
        searchUsers.push({
          key: index,
          documentKey: item.id,
          id: item.data().id,
          name: item.data().name,
          messages: item.data().messages,
          url: item.data().url,
          description: item.data().description,
        });
      });
    }
    renderListUser(searchUsers);
    setContactList(searchUsers);
  };
  const [contactList, setContactList] = useState([]);
  useEffect(getListUser, []);

  const onProfileClick = () => {
    history.push("/profile");
  };

  const notificationErase = (itemId) => {
    let messageErageList = [];
    displayedContactSwitchedNotification.forEach((el) => {
      if (el.notificationId.length > 0) {
        if (el.notificationId !== itemId) {
          messageErageList.push({
            notificationId: el.notificationId,
            number: el.number,
          });
        }
      }
    });
    setNotificationMessagesErase(messageErageList);
    updaterenderList();
  };

  const updaterenderList = () => {
    firestore
      .collection("users")
      .doc(currentUserDocumentId)
      .update({ messages: notificationMessagesErase });
    setDisplayedContactSwitchedNotification(notificationMessagesErase);
  };

  const getClassnameforUserandNotification = (itemId) => {
    let className = "";
    let check = false;
    if (currentPeerUser && currentPeerUser.id === itemId) {
      className = "viewWrapItemFocused";
    } else {
      currentUserMessages.forEach((item) => {
        if (item.notificationId.length > 0) {
          if (item.notificationId === itemId) {
            check = true;
          }
        }
      });
      if (check === true) {
        className = "viewWrapItemNotification";
      } else {
        className = "viewWrapItem";
      }
    }
    return className;
  };

  const renderListUser = (userList) => {
    if (userList.length > 0) {
      let viewListUser = [];
      let classname = "";
      userList.map((item) => {
        if (item.id !== currentUserId) {
          classname = getClassnameforUserandNotification(item.id);
          viewListUser.push(
            <button
              key={item.key}
              id={item.key}
              className={classname}
              onClick={() => {
                notificationErase(item.id);
                setCurrentPeerUser(item);
                document.getElementById(item.key).style.backgroundColor =
                  "#fff";
                document.getElementById(item.key).style.color = "#fff";
              }}
            >
              <div>
                <img src={item.url} alt="" className="viewAvatarItem" />
              </div>
              <div className="viewWrapContentItem">
                <span className="textItem">{`Name: ${item.name}`}</span>
              </div>
              {classname === "viewWrapItemNotification" ? (
                <div className="notificationpragraph">New message</div>
              ) : null}
            </button>
          );
        }
        return null;
      });
      setDisplayedContacts(viewListUser);
    } else {
      console.log("No user is present");
    }
  };

  const logout = () => {
    auth.signOut();
    history.push("/");
    localStorage.clear();
  };
  const searchHandler = (e) => {
    let searchQuery = e.target.value.toLowerCase();
    let newSearchUsers = contactList.filter((el) => {
      let searchValue = el.name.toLowerCase();
      return searchValue.indexOf(searchQuery) !== -1;
    });
    renderListUser(newSearchUsers);
  };
  return (
    <div className="root">
      <div className="body">
        <div className="viewListUser">
          <div className="profileviewleftside">
            <img
              src={currentUserPhoto}
              alt=""
              className="ProfilePicture"
              onClick={onProfileClick}
            />
            <button className="Logout" onClick={logout}>
              Logout
            </button>
          </div>
          <div className="rootsearchbar">
            <div className="input-container">
              <i className="fa fa-search icon"></i>
              <input
                type="text"
                className="input-field"
                onChange={searchHandler}
                placeholder="Search"
              />
            </div>
          </div>
          {displayedContacts}
        </div>
        <div className="viewBoard">
          {currentPeerUser ? (
            <ChatBox currentPeerUser={currentPeerUser} showToast={showToast} />
          ) : (
            <Welcome
              currentUserName={currentUserName}
              currentUserPhoto={currentUserPhoto}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
