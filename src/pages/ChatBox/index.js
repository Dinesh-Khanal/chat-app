import React, { useState, useEffect, useRef } from "react";
import "./ChatBox.css";
import { images } from "../../projectimages";
import ReactLoading from "react-loading";
import { firestore, storage } from "../../services/firebase";
import { loginStrings } from "../../loginStrings";
import moment from "moment";
import Input from "./Input";

const ChatBox = ({ currentPeerUser, showToast }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowSticker, setIsShowSticker] = useState(false);
  const [listMessage, setListMessage] = useState([]);
  const [update, forceUpdate] = useState(false);
  const currentUserId = localStorage.getItem(loginStrings.ID);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  });

  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash += Math.pow(str.charCodeAt(i) * 31, str.length - i);
      hash = hash & hash; //convert to 32bit integer
    }
    return hash;
  };
  let groupChatId;
  if (hashString(currentUserId) <= hashString(currentPeerUser.id)) {
    groupChatId = `${currentUserId}-${currentPeerUser.id}`;
  } else {
    groupChatId = `${currentPeerUser.id}-${currentUserId}`;
  }

  useEffect(() => {
    let messageList = [];
    const removeListener = firestore
      .collection("Messages")
      .doc(groupChatId)
      .collection(groupChatId)
      .onSnapshot(
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              messageList.push(change.doc.data());
            }
          });
          setListMessage(messageList);
        },
        (err) => {
          showToast(0, err.toString());
        }
      );
    return () => {
      removeListener();
    };
  }, [groupChatId, showToast]);

  const renderSticker = () => {
    return (
      <div className="viewStickers">
        <img
          src={images.lego1}
          alt="sticker"
          className="imgSticker"
          onClick={() => {
            onSendMessage("lego1", 2);
          }}
        />
        <img
          src={images.lego2}
          alt="sticker"
          className="imgSticker"
          onClick={() => {
            onSendMessage("lego2", 2);
          }}
        />
        <img
          src={images.lego3}
          alt="sticker"
          className="imgSticker"
          onClick={() => {
            onSendMessage("lego3", 2);
          }}
        />
        <img
          src={images.lego4}
          alt="sticker"
          className="imgSticker"
          onClick={() => {
            onSendMessage("lego4", 2);
          }}
        />
        <img
          src={images.lego5}
          alt="sticker"
          className="imgSticker"
          onClick={() => {
            onSendMessage("lego5", 2);
          }}
        />
      </div>
    );
  };
  const onSendMessage = (content, type) => {
    let notificationMessages = [];
    if (content.trim() === "") {
      return;
    } else {
      const timestamp = moment().valueOf().toString();
      const itemMessage = {
        idFrom: currentUserId,
        idTo: currentPeerUser.id,
        timestamp: timestamp,
        content: content.trim(),
        type,
      };
      firestore
        .collection("Messages")
        .doc(groupChatId)
        .collection(groupChatId)
        .doc(timestamp)
        .set(itemMessage)
        .then(() => {
          setIsLoading(false);
          setIsShowSticker(false);
          forceUpdate(!update);
        });
    }
    notificationMessages.push({ notificationId: currentUserId });
    firestore
      .collection("users")
      .doc(currentPeerUser.documentKey)
      .update({ messages: notificationMessages })
      .then((data) => {})
      .catch((err) => {
        showToast(0, err.toString);
      });
  };
  // const toggleSticker = () => {
  //   if (isShowSticker) {
  //     setIsShowSticker(false);
  //   } else {
  //     setIsShowSticker(true);
  //   }
  // };

  const uploadPhoto = (photoFile) => {
    if (photoFile) {
      const timestamp = moment().valueOf().toString();
      setIsLoading(true);
      const uploadTask = storage.ref().child(timestamp).put(photoFile);
      uploadTask.on(
        "state_changed",
        null,
        (err) => {
          setIsLoading(false);
          showToast(0, err.message);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            onSendMessage(downloadURL, 1);
          });
        }
      );
    } else {
      setIsLoading(false);
      showToast(0, "File is null");
    }
  };

  const isLastMessageLeft = (index) => {
    if (
      (index + 1 < listMessage.length &&
        listMessage[index + 1].idFrom === currentUserId) ||
      index === listMessage.length - 1
    ) {
      return true;
    } else {
      return false;
    }
  };
  const getGifImage = (value) => {
    switch (value) {
      case "lego1":
        return images.lego1;
      case "lego2":
        return images.lego2;
      case "lego3":
        return images.lego3;
      case "lego4":
        return images.lego4;
      case "lego5":
        return images.lego5;
      default:
        return null;
    }
  };
  const renderListMessage = () => {
    let viewListMessage = [];
    if (listMessage.length > 0) {
      listMessage.forEach((item, index) => {
        if (item.idFrom === currentUserId) {
          if (item.type === 0) {
            viewListMessage.push(
              <div className="viewItemRight" key={index}>
                <span className="textContentItem">{item.content}</span>
              </div>
            );
          } else if (item.type === 1) {
            viewListMessage.push(
              <div className="viewItemRight2" key={index}>
                <img src={item.content} alt="Update" className="imgItemRight" />
              </div>
            );
          } else {
            viewListMessage.push(
              <div className="viewItemRight3" key={index}>
                <img
                  src={getGifImage(item.content)}
                  alt="content message"
                  className="imgItemRight"
                />
              </div>
            );
          }
        } else {
          if (item.type === 0) {
            viewListMessage.push(
              <div className="viewWrapItemLeft" key={index}>
                {isLastMessageLeft(index) ? (
                  <img
                    src={currentPeerUser.url}
                    alt="avatar"
                    className="peerAvatarLeft"
                  />
                ) : (
                  <div className="viewPaddingLeft"></div>
                )}
                <div className="viewItemLeft">
                  <span className="textContentItem">{item.content}</span>
                </div>
                {isLastMessageLeft(index) ? (
                  <span className="textTimeLeft">
                    <div className="time">
                      {moment(Number(item.timestamp)).format("LL")}
                    </div>
                  </span>
                ) : null}
              </div>
            );
          } else if (item.type === 1) {
            viewListMessage.push(
              <div className="viewWrapItemLeft2" key={index}>
                {isLastMessageLeft(index) ? (
                  <img
                    src={currentPeerUser.url}
                    alt="avatar"
                    className="peerAvatarLeft"
                  />
                ) : (
                  <div className="viewPaddingLeft"></div>
                )}
                <div className="viewItemLeft2">
                  <img
                    src={item.content}
                    alt="Update"
                    className="imgItemLeft"
                  />
                </div>
                {isLastMessageLeft(index) ? (
                  <span className="textTimeLeft">
                    <div className="time">
                      {moment(Number(item.timestamp)).format("LL")}
                    </div>
                  </span>
                ) : null}
              </div>
            );
          } else {
            viewListMessage.push(
              <div className="viewWrapItemLeft2" key={index}>
                {isLastMessageLeft(index) ? (
                  <img
                    src={currentPeerUser.url}
                    alt="avatar"
                    className="peerAvatarLeft"
                  />
                ) : (
                  <div className="viewPaddingLeft"></div>
                )}
                <div className="viewItemLeft3">
                  <img
                    src={getGifImage(item.content)}
                    alt="Content message"
                    className="imgItemLeft"
                  />
                </div>
                {isLastMessageLeft(index) ? (
                  <span className="textTimeLeft">
                    <div className="time">
                      {moment(Number(item.timestamp)).format("LL")}
                    </div>
                  </span>
                ) : null}
              </div>
            );
          }
        }
      });
    } else {
      viewListMessage.push(<div key={-1}>Say hi to your friend</div>);
    }
    return viewListMessage;
  };
  return (
    <div className="viewChatBoard">
      <div className="headerChatBoard">
        <div>
          <img src={currentPeerUser.url} alt="" className="viewAvatar-Item" />
        </div>
        <div>
          <div style={{ fontSize: "20px" }} className="textHeaderChatBoard">
            {currentPeerUser.name}
          </div>
          <div className="aboutme">{currentPeerUser.description}</div>
        </div>
      </div>
      <div className="viewListContentChat">
        {renderListMessage()}
        <div ref={messagesEndRef} />
      </div>
      {isShowSticker ? renderSticker() : null}
      <Input
        uploadPhoto={uploadPhoto}
        showToast={showToast}
        onSendMessage={onSendMessage}
        isShowSticker={isShowSticker}
        setIsShowSticker={setIsShowSticker}
      />
      {isLoading ? (
        <div className="viewLoading">
          <ReactLoading
            type={"spin"}
            color={"#203152"}
            height={"3%"}
            width={"3%"}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ChatBox;
