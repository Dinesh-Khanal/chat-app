import React, { useState, useEffect, useRef } from "react";
import "./ChatBox.css";
import { images } from "../../projectimages";
import ReactLoading from "react-loading";
import { firestore } from "../../services/firebase";
import { loginStrings } from "../../loginStrings";
import moment from "moment";

const ChatBox = ({ currentPeerUser, showToast }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowSticker, setIsShowSticker] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [listMessage, setListMessage] = useState([]);
  const refInput = useRef(null);
  const currentUserId = localStorage.getItem(loginStrings.ID);
  const currentPeerUserMessages = [];

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
    groupChatId = `${currentUserId} -${currentPeerUser.id}`;
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
  // firestore.collection('users').doc(currentPeerUser.documentkey).get()
  // .then((docRef) =>{
  //  currentPeerUserMessages = docRef.data().messages
  // })
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
    let notificationMessage = [];
    if (isShowSticker && type === 2) {
      setIsShowSticker(false);
    }
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
          setInputValue("");
        });
    }
  };
  // const toggleSticker = () => {
  //   if (isShowSticker) {
  //     setIsShowSticker(false);
  //   } else {
  //     setIsShowSticker(true);
  //   }
  // };
  const onChoosePhoto = () => {
    //
  };
  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      onSendMessage(inputValue, 0);
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
                    src={currentPeerUser.URL}
                    alt="avatar"
                    className="perrAvatarLeft"
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
              <div className="viewWrapItemLeft2">
                {isLastMessageLeft(index) ? (
                  <img
                    src={currentPeerUser.URL}
                    alt="avatar"
                    className="perrAvatarLeft"
                  />
                ) : (
                  <div className="viewPaddingLeft"></div>
                )}
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
  const getGifImage = () => {
    //
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
      <div className="viewListContentChat">{renderListMessage()}</div>
      {isShowSticker ? renderSticker() : null}
      <div className="viewBottom">
        <img
          src={images.input_file}
          alt="input_file"
          className="icOpenGallery"
          onClick={() => refInput.current.click()}
        />
        <input
          type="file"
          ref={refInput}
          className="viewInputGallery"
          accept="image/*"
          onChange={onChoosePhoto}
        />
        <img
          src={images.sticker}
          alt="icon open sticker"
          className="icOpenSticker"
          onClick={() => setIsShowSticker(!isShowSticker)}
        />
        <input
          type="text"
          className="viewInput"
          placeholder="Type a message"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          onKeyPress={onKeyPress}
        />
        <img
          src={images.send}
          alt="send icon"
          className="icSend"
          onClick={() => {
            onSendMessage(inputValue, 0);
          }}
        />
      </div>
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
