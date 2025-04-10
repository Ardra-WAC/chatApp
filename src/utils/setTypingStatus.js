import { ref, set, onDisconnect } from "firebase/database";
import { rtdb } from "../lib/firebase";

export const setTypingStatus = (chatId, userId, isTyping) => {
  const typingRef = ref(rtdb, `/typingStatus/${chatId}/${userId}`);
  set(typingRef, isTyping);

  if (isTyping) {
    onDisconnect(typingRef).set(false);
  }
};
