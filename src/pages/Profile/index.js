import React, { useState, useRef } from "react";
import "./Profile.css";
import ReactLoading from "react-loading";
import "react-toastify/dist/ReactToastify.css";
import { storage, firestore } from "../../services/firebase";
import { images } from "../../projectimages";
import { loginStrings } from "../../loginStrings";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

const Profile = ({ showToast }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [namee, setNamee] = useState(localStorage.getItem(loginStrings.Name));
  const [aboutMe, setAboutMe] = useState(
    localStorage.getItem(loginStrings.Description)
  );
  const [photoUrl, setPhotoUrl] = useState(
    localStorage.getItem(loginStrings.PhotoURL)
  );
  const [newPhoto, setNewPhoto] = useState(null);
  const history = useHistory();
  const refInput = useRef(null);
  const id = localStorage.getItem(loginStrings.ID);
  const documentKey = localStorage.getItem(loginStrings.FirebaseDocumentId);
  useEffect(() => {
    if (!localStorage.getItem(loginStrings.ID)) {
      history.push("/");
    }
  }, [history]);

  const onChangeAvatar = (e) => {
    let selected = e.target.files[0];
    if (selected) {
      let prefixFiletype = selected.type.toString();
      if (prefixFiletype.indexOf("image/") !== 0) {
        showToast(0, "This file is not an image");
        return;
      }
      setNewPhoto(selected);
      setPhotoUrl(URL.createObjectURL(selected));
    } else {
      showToast(0, "Something wrong with input file");
    }
  };
  const onChangeNickname = (e) => {
    setNamee(e.target.value);
  };
  const onChangeAboutMe = (e) => {
    setAboutMe(e.target.value);
  };
  const uploadAvatar = () => {
    setIsLoading(true);
    if (newPhoto) {
      const uploadTask = storage.ref().child(id).put(newPhoto);
      uploadTask.on(
        "state_changed",
        null,
        (err) => {
          showToast(0, err.message);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            updateUserInfo(true, downloadURL);
          });
        }
      );
    } else {
      updateUserInfo(false, null);
    }
  };

  const updateUserInfo = (isUpdatedPhotoURL, downloadURL) => {
    let newinfo;
    if (isUpdatedPhotoURL) {
      newinfo = {
        name: namee,
        description: aboutMe,
        url: downloadURL,
      };
    } else {
      newinfo = {
        name: namee,
        description: aboutMe,
      };
    }
    firestore
      .collection("users")
      .doc(documentKey)
      .update(newinfo)
      .then((data) => {
        localStorage.setItem(loginStrings.Name, namee);
        localStorage.setItem(loginStrings.Description, aboutMe);
        if (isUpdatedPhotoURL) {
          localStorage.setItem(loginStrings.PhotoURL, downloadURL);
        }
        setIsLoading(false);
        showToast(1, "Update info success");
      });
  };
  return (
    <div className="profileroot">
      <div className="headerprofile">
        <span>PROFILE</span>
      </div>
      <img src={photoUrl} alt="" className="avatar" />
      <div className="viewWrapInputFile">
        <img
          src={images.choosefile}
          alt="icon gallery"
          className="imgInputFile"
          onClick={() => refInput.current.click()}
        />
        <input
          ref={refInput}
          type="file"
          accept="image/*"
          className="viewInputFile"
          onChange={onChangeAvatar}
        />
      </div>
      <span className="textLabel">Name</span>
      <input
        type="text"
        className="textInput"
        value={namee ? namee : ""}
        placeholder="Your nickname..."
        onChange={onChangeNickname}
      />
      <span className="textLabel">About Me</span>
      <input
        type="text"
        className="textInput"
        value={aboutMe ? aboutMe : ""}
        placeholder="Tell about yourself..."
        onChange={onChangeAboutMe}
      />
      <div>
        <button className="btnUpdate" onClick={uploadAvatar}>
          SAVE
        </button>
        <button className="btnback" onClick={() => history.push("/chat")}>
          BACK
        </button>
      </div>
      {isLoading ? (
        <ReactLoading
          type={"spin"}
          color={"#203252"}
          height={"3%"}
          width={"3%"}
        />
      ) : null}
    </div>
  );
};

export default Profile;
