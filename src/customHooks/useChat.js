import React, { useState } from "react";
import { db } from "../lib/firebase";
import { chatValue, userValue } from "../lib/userStore";
import { useAtomValue } from "jotai";
import { useAtom } from "jotai";
import useOnlineStatus from "./useOnlineStatus";
import {
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
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
  const { isOnline, lastOnline } = useOnlineStatus(user.id)
  console.log("user is",isOnline, lastOnline );

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleChange = (e) => {
    setText(e.target.value);
    console.log(text);
  };

  const handleSend = async () => {
    if (text === "") return;

    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser[0].id,
          text,
          createdAt: new Date(),
        }),
      });
      setText("");
      const userID = [currentUser[0].id, user.id];
      userID.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
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
    lastOnline 
  };
}

export default useChat;
