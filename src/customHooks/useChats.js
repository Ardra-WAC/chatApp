//This functionj is to display chat of user when any clicked from chatList
//So we need to pass the id of the chat clicked
//and check whether currentUser is blocked by reciever and vice versa

import React from "react";
import { useAtom, useAtomValue } from "jotai";
import { userValue, chatValue } from "../lib/userStore";

function useChats() {
  const [currentUser] = useAtom(userValue);
  const [chats, setChats] = useAtom(chatValue);

  const chatChange = (chatId, user) => {
    //to check if user blocked by current user
    if (currentUser.blocked.includes(user.id)) {
      setChats({
        chatId,
        user: null,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    }
    //to check id current user blocked by  user
    else if (user.blocked.includes(currentUser.id)) {
      setChats({
        chatId,
        user: user,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    } else {
      setChats({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      });
    }
  };

  const toggleBlock = () => {
    setChats((prev) => ({ ...prev, isReceiverBlocked: !isReceiverBlocked }));
  };

  return {
    chatChange,
  };
}

export default useChats;
