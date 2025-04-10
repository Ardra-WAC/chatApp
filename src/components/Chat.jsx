import React, { useRef, useEffect } from "react";
import chatStyles from "../styles/Chat.module.css";
import {
  FaPhone,
  FaVideo,
  FaInfoCircle,
  FaImage,
  FaCamera,
  FaMicrophone,
  FaArrowLeft,
} from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { doc, onSnapshot } from "firebase/firestore";
import { findSendTime } from "../utils/findSendTime";
import { findMessageDateLabel } from "../utils/findMessageDateLabel";
import useChat from "../customHooks/useChat";

function Chat({ chatId, user, onBack, onShowDetail }) {
  const endRef = useRef(null);
  const {
    handleClick,
    handleEmoji,
    handleChange,
    handleSend,
    isCurrentUserBlocked,
    isReceiverBlocked,
    currentUser,
    currentChat,
    setCurrentChat,
    text,
    db,
    open,
    loading,
    setLoading,
    isOnline,
    lastOnline,
    isReceiverTyping
  } = useChat();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  useEffect(() => {
    if (!chatId) return;
    setLoading(true);
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setCurrentChat(res.data());
      setLoading(false);
    });
    return () => unSub();
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
            <div className={chatStyles.dateSeparator}>
              <span>{messageDateLabel}</span>
            </div>
          )}
          <div
            // className={message.senderId === currentUser[0]?.id ? "message own" : "message"}
            className={`${chatStyles.message} ${
              message.senderId === currentUser[0]?.id ? chatStyles.own : ""
            }`}
          >
            <div className={chatStyles.texts}>
              <p>{message.text}</p>
              <span className={chatStyles.sentTime}>
                {findSendTime(message.createdAt)}
              </span>
            </div>
          </div>
        </React.Fragment>
      );
    });
  };

  return (
    <div className={chatStyles.chat}>
      <div className={chatStyles.top}>
        {onBack && (
          <FaArrowLeft className={chatStyles.backIcon} onClick={onBack} />
        )}
        <div className={chatStyles.user}>
          <img
            src={
              user?.blocked.includes(currentUser[0].id)
                ? "/images/bg.jpg"
                : "https://www.shareicon.net/data/512x512/2016/07/26/802043_man_512x512.png"
            }
            alt=""
          />
          <div className={chatStyles.texts}>
            <span>{user?.username}</span>
            <p>
  {isOnline
    ? "Online"
    : lastOnline
    ? `Last seen ${new Date(lastOnline).toLocaleString()}`
    : "Offline"}
</p>
          </div>
        </div>
        <div className={chatStyles.icons}>
          <FaPhone className={chatStyles.faIcons} />
          <FaVideo className={chatStyles.faIcons} />
          {onShowDetail && (
            <FaInfoCircle
              className={chatStyles.faIcons}
              onClick={onShowDetail}
            />
          )}
        </div>
      </div>
      <div className={chatStyles.center}>
        {loading ? <p>Loading...</p> : renderMessagesWithDate()}
        {isReceiverTyping && <p>Typing...</p>}
        <div ref={endRef}></div>
      </div>
      <div className={chatStyles.bottom}>
        <div className={chatStyles.icons}>
          <FaImage className={chatStyles.inputIcons} />
          <FaCamera className={chatStyles.inputIcons} />
          <FaMicrophone className={chatStyles.inputIcons} />
        </div>
        <input
          className={chatStyles.messageTypingField}
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
        <div className={chatStyles.emoji}>
          <img
            className={chatStyles.emojiImage}
            src="https://emojiisland.com/cdn/shop/products/Slightly_Smiling_Face_Emoji_87fdae9b-b2af-4619-a37f-e484c5e2e7a4.png?v=1571606036"
            alt=""
            onClick={handleClick}
          />
          <div className={chatStyles.picker}>
            {open && <EmojiPicker onEmojiClick={handleEmoji} />}
          </div>
        </div>
        <button
          className={chatStyles.sendButton}
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
