import React from "react";
import { db, auth } from "../lib/firebase";
import { ref, set, serverTimestamp } from "firebase/database";
import { rtdb } from "../lib/firebase";
import { useAtom, useAtomValue } from "jotai";
import { userValue, chatValue } from "../lib/userStore";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

function useDetail() {
  const currentUser = useAtomValue(userValue);
  const [chat, setChat] = useAtom(chatValue);
  const chatId = chat.chatId;
  const user = chat.user;
  const isCurrentUserBlocked = chat.isCurrentUserBlocked;
  const isReceiverBlocked = chat.isReceiverBlocked;

  const blockUser = () => {
    setChat((prev) => ({
      ...prev,
      isReceiverBlocked: !prev.isReceiverBlocked,
    }));
    console.log(isReceiverBlocked ? "user Unblocked" : "user Blocked");
  };

  const resetChat = () => {
    setChat({
      chatId: null,
      user: null,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
    });
  };

  const handleBlock = async () => {
    if (!user) {
      console.log("no user");
      return;
    }
    console.log("handleBlock function evoked");
    const userDocRef = doc(db, "users", currentUser.id);
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      blockUser();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    resetChat();
  };

  return {
    user,
    handleBlock,
    handleLogout,
    isCurrentUserBlocked,
    isReceiverBlocked,
    user,
    currentUser,
  };
}

export default useDetail;
