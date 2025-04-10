import React, { useState, useEffect } from "react";
import chatListStyles from "../styles/ChatList.module.css";
import { FaSearch, FaPlus, FaMinus } from "react-icons/fa";
import AddUser from "./AddUser";
import { useAtomValue } from "jotai";
import { userValue } from "../lib/userStore";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import useChats from "../customHooks/useChats";

function ChatList({ onChatSelect }) {
  // const [chats, setChats] = useState([]);
  // const [addMode, setAddMode] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [searchInput, setSearchInput] = useState("");
  // const currentUser = useAtomValue(userValue);
  const { chatChange, 
    handleSelect, 
    handleChange,  
    currentUser,
    chats,
    setChats,
    addMode, 
    setAddMode,
    loading, 
    setLoading,
    searchInput, 
    setSearchInput,
    filteredChats } = useChats(onChatSelect);

  useEffect(() => {
    setLoading(true);
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const data = res.data();
        if (data && data.chats) {
          const items = data.chats;
          const promises = items.map(async (item) => {
            const userDocRef = doc(db, "users", item.recieverId);
            const userDocSnap = await getDoc(userDocRef);
            const user = userDocSnap.data();
            const chatDocRef = doc(db, "chats", item.chatId);
            const chatDocSnap = await getDoc(chatDocRef);
            const messages = chatDocSnap.exists()
              ? chatDocSnap.data().messages
              : [];
            const unreadCount = messages.filter(
              (msg) => msg.senderId !== currentUser.id && !item.isSeen
            ).length;
            return { ...item, user, unreadCount };
          });
          const chatData = await Promise.all(promises);
          chatData.sort((a, b) => b.updatedAt - a.updatedAt);
          setChats(chatData);
          setLoading(false);
        }
      }
    );
    return () => unSub();
  }, [currentUser.id]);



  return (
    <div className={chatListStyles.chatlist}>
      <div className={chatListStyles.search}>
        <div className={chatListStyles.searchBar}>
          <FaSearch className={chatListStyles.searchIcon} />
          <input
            className={chatListStyles.searchTypingField}
            type="text"
            placeholder="Search"
            onChange={handleChange}
          />
        </div>
        {addMode ? (
          <FaMinus
            className={chatListStyles.addIcon}
            onClick={() => setAddMode(false)}
          />
        ) : (
          <FaPlus
            className={chatListStyles.addIcon}
            onClick={() => setAddMode(true)}
          />
        )}
      </div>
      {loading && <p>Loading...</p>}
      {filteredChats.map((chat) => (
        <div
          className={chatListStyles.item}
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
        >
          <img
            src={
              chat.user?.blocked.includes(currentUser.id)
                ? "/images/bg.jpg"
                : "https://www.shareicon.net/data/512x512/2016/07/26/802043_man_512x512.png"
            }
            alt=""
          />
          <div className={chatListStyles.texts}>
            <span>
              {chat.user?.blocked.includes(currentUser.id)
                ? "User"
                : chat.user.username}
            </span>
            <p style={{ color: chat?.isSeen ? "wheat" : "green" }}>
              {chat.lastMessage}
            </p>
          </div>
          {chat.unreadCount > 0 && (
            <span className={chatListStyles.unreadBadge}>
              {chat.unreadCount}
            </span>
          )}
        </div>
      ))}
      {addMode && <AddUser />}
    </div>
  );
}

export default ChatList;
