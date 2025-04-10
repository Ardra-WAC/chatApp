import React from "react";
import "../styles/List.css";
import UserInfo from "./UserInfo";
import ChatList from "./ChatList";

function List({ onChatSelect }) {
  return (
    <div className="list">
      <UserInfo />
      <ChatList onChatSelect={onChatSelect} />
    </div>
  );
}

export default List;