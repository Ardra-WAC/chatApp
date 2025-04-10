import React, { useState, useRef } from "react";
import { db } from "../lib/firebase";
import { chatValue, userValue } from "../lib/userStore";
import { useAtomValue } from "jotai";
import { useAtom } from "jotai";
import useOnlineStatus from "./useOnlineStatus";
import useTypingStatus from "../customHooks/useTypingStatus";
import { setTypingStatus } from "../utils/setTypingStatus";
import {
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";

function useChat() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [currentChat, setCurrentChat] = useState("");
  const chat = useAtomValue(chatValue);
  const chatId = chat.chatId;
  const isCurrentUserBlocked = chat.isCurrentUserBlocked;
  const isReceiverBlocked = chat.isReceiverBlocked;
  const user = chat.user;
  const currentUser = useAtom(userValue);
  const { isOnline, lastOnline } = useOnlineStatus(user.id);
  console.log("user is online :", isOnline, lastOnline);
  const isReceiverTyping = useTypingStatus(chatId, user?.id);

  const typingTimeoutRef = useRef(null);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    setTypingStatus(chatId, currentUser[0].id, value !== "");
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    if (value !== "") {
      typingTimeoutRef.current = setTimeout(() => {
        setTypingStatus(chatId, currentUser[0].id, false);
      }, 500);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (text === "" || !chatId) return;

    try {
      const newMessage = {
        senderId: currentUser[0].id,
        text,
        createdAt: Timestamp.now(),
      };

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion(newMessage),
      });

      setText("");

      const userIDs = [currentUser[0].id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          if (chatIndex !== -1) {
            userChatsData.chats[chatIndex].lastMessage = text;
            userChatsData.chats[chatIndex].isSeen =
              id === currentUser[0].id ? true : false;
            userChatsData.chats[chatIndex].updatedAt = Date.now();

            await updateDoc(userChatsRef, {
              chats: userChatsData.chats,
            });
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  return {
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
    lastOnline,
    isReceiverTyping,
  };
}

export default useChat;
