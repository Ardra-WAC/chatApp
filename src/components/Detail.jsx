import React from "react";
import styles from "../styles/Detail.module.css";
import { FaAngleDown, FaDownload, FaArrowLeft } from "react-icons/fa";
import useDetail from "../customHooks/useDetail";

function Detail({ user, onBack }) {
  const {
    handleBlock,
    handleLogout,
    isCurrentUserBlocked,
    isReceiverBlocked,
    currentUser,
    isOnline,
    lastOnline,
  } = useDetail();

  return (
    <div className={styles.detail}>
      <div className={styles.top}>
        {onBack && <FaArrowLeft className={styles.backIcon} onClick={onBack} />}
        <div className={styles.user}>
          <img
            src={
              user?.blocked.includes(currentUser.id)
                ? "/images/bg.jpg"
                : "https://www.shareicon.net/data/512x512/2016/07/26/802043_man_512x512.png"
            }
            alt="Profile Picture"
          />
          <h2>
            {user?.blocked.includes(currentUser.id) ? "user" : user?.username}
          </h2>
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.option}>
          <div className={styles.title}>
            <span>Chat Settings</span>
            <FaAngleDown className={styles.arrowIcon} />
          </div>
        </div>

        <div className={styles.option}>
          <div className={styles.title}>
            <span>Privacy & help</span>
            <FaAngleDown className={styles.arrowIcon} />
          </div>
        </div>

        <div className={styles.option}>
          <div className={styles.title}>
            <span>Shared Photos</span>
            <FaAngleDown className={styles.arrowIcon} />
          </div>
          <div className={styles.photos}>
            <div className={styles.photoItems}>
              <div className={styles.photoDetail}>
                <img src="/images/bg.jpg" alt="" />
                <span>imagename.png</span>
              </div>
              <FaDownload className={styles.downloadIcon} />
            </div>
          </div>
        </div>

        <div className={styles.option}>
          <div className={styles.title}>
            <span>Shared Files</span>
            <FaAngleDown className={styles.arrowIcon} />
          </div>
        </div>

        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "UnBlock"
            : "Block User"}
        </button>

        <button className={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Detail;
