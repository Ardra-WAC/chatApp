import React from "react";
import "../styles/Detail.css";
import { FaAngleDown, FaDownload } from "react-icons/fa";
import useDetail from "../customHooks/useDetail";
function Detail() {
  const {
    handleBlock,
    handleLogout,
    isCurrentUserBlocked,
    isReceiverBlocked,
    user,
    currentUser,
    isOnline,
    lastOnline
  } = useDetail();

  return (
    <div className="detail">
      <div className="user">
        <img
          src={user?.blocked.includes(currentUser.id)
                  ? "/images/bg.jpg":
            "https://www.shareicon.net/data/512x512/2016/07/26/802043_man_512x512.png"
          }
          alt=""
        />
        <h2>{user?.blocked.includes(currentUser.id)
                  ? "user" : user?.username }</h2>
      
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <FaAngleDown className="arrowIcon" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <FaAngleDown className="arrowIcon" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <FaAngleDown className="arrowIcon" />
          </div>
          <div className="photos">
            <div className="photoItems">
              <div className="photoDetail">
                <img src="/images/bg.jpg" alt="" />
                <span>imagename.png</span>
              </div>
              <FaDownload className="downloadIcon" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <FaAngleDown className="arrowIcon" />
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "UnBlock"
            : "Block User"}
        </button>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Detail;
