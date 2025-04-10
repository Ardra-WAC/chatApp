import { useEffect, useState } from "react";
import { rtdb } from "../lib/firebase";
import { ref, onValue } from "firebase/database";

function useTypingStatus(chatId, userId) {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!chatId || !userId) return;

    const typingRef = ref(rtdb, `/typingStatus/${chatId}/${userId}`);

    const unsubscribe = onValue(typingRef, (snapshot) => {
      setIsTyping(snapshot.val() || false);
    });

    return () => unsubscribe();
  }, [chatId, userId]);

  return isTyping;
}

export default useTypingStatus;
