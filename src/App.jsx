import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";
import List from "./components/List";
import Detail from "./components/Detail";
import Notification from "./components/Notification";
import { auth, db } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { userValue, authLoading, chatValue } from "./lib/userStore";
import { useAtom, useAtomValue } from "jotai";
import { setOnlineStatus } from "./utils/setOnlineStatus";

function App() {
  const [user, setUser] = useAtom(userValue);
  const [isLoading, setIsLoading] = useAtom(authLoading);
  const [chat, setChat] = useAtom(chatValue);
  const chatId = chat?.chatId;

  const [view, setView] = useState("chatList"); // "chatList", "chat", "detail"

  const fetchUserInfo = async (uid) => {
    if (!uid) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser(docSnap.data());
      } else {
        setUser(null);
      }
    } catch (err) {
      console.log("Error fetching user info:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
      if (user) {
        setOnlineStatus(); // Set online status for the logged-in user
      }
    });
    return () => unSub();
  }, []);

  const handleChatSelect = (selectedChat) => {
    setChat(selectedChat);
    setView("chat");
  };

  const handleShowDetail = () => setView("detail");
  const handleBackToChatList = () => {
    setView("chatList");
    setChat(null);
  };
  const handleBackToChat = () => setView("chat");

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      {user ? (
        <>
          <div className="desktop-layout">
            <List onChatSelect={handleChatSelect} />
            {chatId && (
              <Chat
                chatId={chatId}
                user={chat?.user}
                onBack={handleBackToChatList}
                onShowDetail={handleShowDetail}
              />
            )}
            {chatId && <Detail user={chat?.user} onBack={handleBackToChat} />}
          </div>

          <div className="mobile-layout">
            {view === "chatList" && <List onChatSelect={handleChatSelect} />}
            {view === "chat" && chat && (
              <Chat
                chatId={chat.chatId}
                user={chat.user}
                onBack={handleBackToChatList}
                onShowDetail={handleShowDetail}
              />
            )}
            {view === "detail" && chat && (
              <Detail user={chat.user} onBack={handleBackToChat} />
            )}
          </div>
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  );
}

export default App;
