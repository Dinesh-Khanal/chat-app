import React, { useState, useRef } from "react";
import { images } from "../../projectimages";

const Input = ({
  uploadPhoto,
  showToast,
  setIsShowSticker,
  isShowSticker,
  onSendMessage,
}) => {
  const [inputValue, setInputValue] = useState("");
  const refInput = useRef(null);
  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      onSendMessage(inputValue, 0);
      setInputValue("");
    }
  };
  const onChoosePhoto = (e) => {
    const currentPhotoFile = e.target.files[0];
    if (currentPhotoFile) {
      const prefixFiletype = e.target.files[0].type.toString();
      if (prefixFiletype.indexOf("image/") === 0) {
        uploadPhoto(currentPhotoFile);
      } else {
        showToast(0, "This file is not an image");
      }
    } else {
      showToast(0, "File is null");
    }
  };
  return (
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
  );
};

export default Input;
