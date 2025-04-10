import React, { useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import {
  collection,
  query,
  where,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { useAtomValue } from "jotai";
import { userValue } from "../lib/userStore";

function useAddUser() {
  const currentUser = useAtomValue(userValue);
  const [user, setUser] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapShot = await getDocs(q);
      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");
    try {
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });
      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          recieverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          recieverId: user.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (err) {
      console.log(err.message);
    }
  };
  return {
    handleSearch,
    handleAdd,
    user,
  };
}

export default useAddUser;
