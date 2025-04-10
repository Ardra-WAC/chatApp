//This functionj is to display chat of user when any clicked from chatList
//So we need to pass the id of the chat clicked
//and check whether currentUser is blocked by reciever and vice versa

import React, { useState } from "react";
import { useAtom } from "jotai";
import { userValue, chatValue } from "../lib/userStore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

function useChats(onChatSelect) {
  const [currentUser] = useAtom(userValue);
  const [chatValues, setChatValues] = useAtom(chatValue);
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const chatChange = (chatId, user) => {
    //to check if user blocked by current user
    if (currentUser.blocked.includes(user.id)) {
      setChatValues({
        chatId,
        user: null,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    }
    //to check id current user blocked by  user
    else if (user.blocked.includes(currentUser.id)) {
      setChatValues({
        chatId,
        user: user,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    } else {
      setChatValues({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      });
    }
  };

  const toggleBlock = () => {
    setChatValues((prev) => ({
      ...prev,
      isReceiverBlocked: !isReceiverBlocked,
    }));
  };
  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, unreadCount, ...rest } = item;
      return rest;
    });
    const chatIndex = userChats.findIndex((c) => c.chatId === chat.chatId);

    if (userChats[chatIndex].receiverId !== currentUser.id) {
      userChats[chatIndex].isSeen = true;
      const updatedChats = chats.map((item, index) =>
        index === chatIndex ? { ...item, unreadCount: 0, isSeen: true } : item
      );
      setChatValues(updatedChats);
    }

    const userChatsRef = doc(db, "userchats", currentUser.id);
    try {
      await updateDoc(userChatsRef, { chatValues: userChats });
      chatChange(chat.chatId, chat.user);
      onChatSelect(chat);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => setSearchInput(e.target.value);

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(searchInput.toLowerCase())
  );
  return {
    chatChange,
    handleSelect,
    handleChange,
    currentUser,
    setChats,
    addMode,
    setAddMode,
    loading,
    setLoading,
    filteredChats,
  };
}

export default useChats;
