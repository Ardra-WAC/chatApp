import React, { useRef, useEffect } from "react";
import "../styles/Chat.css";
import {
  FaPhone,
  FaVideo,
  FaInfoCircle,
  FaImage,
  FaCamera,
  FaMicrophone,
} from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { doc, onSnapshot } from "firebase/firestore";
import { findSendTime } from "../utils/findSendTime";
import { findMessageDateLabel } from "../utils/findMessageDateLabel";
import useChat from "../customHooks/useChat";

function Chat() {
  const endRef = useRef(null);

  const {
    handleClick,
    handleEmoji,
    handleChange,
    handleSend,
    isCurrentUserBlocked,
    isReceiverBlocked,
    currentUser,
    user,
    currentChat,
    setCurrentChat,
    chatId,
    text,
    db,
    open,
    loading,
    setLoading,
    isOnline, 
    lastOnline 
  } = useChat();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  useEffect(() => {
    setLoading(true);
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      console.log("Current chat: ", res.data());
      setCurrentChat(res.data());
      setLoading(false);
    });
    return () => {
      unSub();
    };
  }, [chatId]);

  
  const renderMessagesWithDate = () => {
    if (!currentChat?.messages) return null;

    let lastDate = null;

    return currentChat.messages.map((message) => {
      const messageDateLabel = findMessageDateLabel(message.createdAt);
      const showDate = lastDate !== messageDateLabel;
      lastDate = messageDateLabel;

      return (
        <React.Fragment key={message.createdAt}>
          {showDate && (
            <div className="date-separator">
              <span>{messageDateLabel}</span>
            </div>
          )}
          <div
            className={
              message.senderId === currentUser[0]?.id
                ? "message own"
                : "message"
            }
          >
            <div className="texts">
              <p>{message.text}</p>
              <span className="sentTime">
                {findSendTime(message.createdAt)}
              </span>
            </div>
          </div>
        </React.Fragment>
      );
    });
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img
            src={
              user?.blocked.includes(currentUser[0].id)
                ? "/images/bg.jpg"
                : "https://www.shareicon.net/data/512x512/2016/07/26/802043_man_512x512.png"
            }
            alt=""
          />
          <div className="texts">
            <span>{user?.username}</span>
            <p>{isOnline ? "Online" : lastOnline}</p>
          </div>
        </div>
        <div className="icons">
          <FaPhone className="faIcons" />
          <FaVideo className="faIcons" />
          <FaInfoCircle className="faIcons" />
        </div>
      </div>
      <div className="center">
        {loading ? <p>Loading...</p> : renderMessagesWithDate()}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <FaImage className="inputIcons" />
          <FaCamera className="inputIcons" />
          <FaMicrophone className="inputIcons" />
        </div>
        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot send messages to this user."
              : "Type a message..."
          }
          value={text}
          onChange={handleChange}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img
            src="https://emojiisland.com/cdn/shop/products/Slightly_Smiling_Face_Emoji_87fdae9b-b2af-4619-a37f-e484c5e2e7a4.png?v=1571606036"
            alt=""
            onClick={handleClick}
          />
          <div className="picker">
            {open && <EmojiPicker onEmojiClick={handleEmoji} />}
          </div>
        </div>
        <button
          className="sendButton"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;

