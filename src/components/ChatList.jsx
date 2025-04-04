import React, { useState, useEffect } from "react";
import "../styles/ChatList.css";
import { FaSearch, FaPlus, FaMinus } from "react-icons/fa";
import AddUser from "./AddUser";
import { useAtomValue } from "jotai";
import { userValue } from "../lib/userStore";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import useChats from "../customHooks/useChats";

function ChatList() {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const currentUser = useAtomValue(userValue);
  const { chatChange } = useChats();

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
            
            // Get unread message count
            const chatDocRef = doc(db, "chats", item.chatId);
            const chatDocSnap = await getDoc(chatDocRef);
            const messages = chatDocSnap.exists() ? chatDocSnap.data().messages : [];
            const unreadCount = messages.filter(
              msg => msg.senderId !== currentUser.id && !item.isSeen
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
    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, unreadCount, ...rest } = item;
      return rest;
    });
    const chatIndex = userChats.findIndex((c) => c.chatId === chat.chatId);
    
    if (userChats[chatIndex].receiverId !== currentUser.id) {
      userChats[chatIndex].isSeen = true;
      // Reset unread count when chat is opened
      const updatedChats = chats.map((item, index) => 
        index === chatIndex ? { ...item, unreadCount: 0, isSeen: true } : item
      );
      setChats(updatedChats);
    }

    const userChatsRef = doc(db, "userchats", currentUser.id);
    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      chatChange(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="chatlist">
      <div className="search">
        <div className="searchBar">
          <FaSearch className="searchIcon" />
          <input type="text" placeholder="Search" onChange={handleChange} />
        </div>
        {addMode ? (
          <FaMinus
            className="addIcon"
            onClick={() => setAddMode((prev) => !prev)}
          />
        ) : (
          <FaPlus
            className="addIcon"
            onClick={() => setAddMode((prev) => !prev)}
          />
        )}
      </div>
      {loading && <p>Loading...</p>}
      {filteredChats.map((chat) => (
        <div
          className="item"
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
          <div className="texts">
            <span>
              {chat.user?.blocked.includes(currentUser.id)
                ? "User"
                : chat.user.username}
            </span>
            <p
              style={{
                color: chat?.isSeen ? "wheat" : "green",
              }}
            >
              {chat.lastMessage}
            </p>
          </div>
          {chat.unreadCount > 0 && (
            <span className="unread-badge" style={{
              backgroundColor: 'red',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '12px',
              marginLeft: 'auto'
            }}>
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