import { useEffect, useState } from "react";
import {
  ref,
  onValue,
  push,
  onDisconnect,
  set,
  serverTimestamp,
} from "firebase/database";
import { rtdb } from "../lib/firebase";

const useOnlineStatus = (userId) => {
  const [isOnline, setIsOnline] = useState(false);
  const [lastOnline, setLastOnline] = useState(null);

  useEffect(() => {
    const myConnectionsRef = ref(rtdb, `users/${userId}/connections`);
    const lastOnlineRef = ref(rtdb, `users/${userId}/lastOnline`);
    const connectedRef = ref(rtdb, ".info/connected");

    const handleConnectionChange = (snap) => {
      if (snap.val() === true) {
        const con = push(myConnectionsRef);
        onDisconnect(con).remove();
        set(con, true);
        onDisconnect(lastOnlineRef).set(serverTimestamp());
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    };

    onValue(connectedRef, handleConnectionChange);
    onValue(lastOnlineRef, (snap) => {
      if (snap.val()) {
        setLastOnline(snap.val());
      }
    });

    return () => {
      onValue(connectedRef, handleConnectionChange);
    };
  }, [userId]);

  return { isOnline, lastOnline };
};

export default useOnlineStatus;
