import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../lib/firebase";

function useOnlineStatus(userId) {
  const [isOnline, setIsOnline] = useState(false);
  const [lastOnline, setLastOnline] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const connectionsRef = ref(rtdb, `users/${userId}/connections`);
    const lastOnlineRef = ref(rtdb, `users/${userId}/lastOnline`);

    const unsubscribeConnections = onValue(connectionsRef, (snapshot) => {
      const connections = snapshot.val();
      const online = connections && Object.keys(connections).length > 0;
      setIsOnline(online);
      console.log(
        `useOnlineStatus - ${userId} isOnline:`,
        online,
        "Connections:",
        connections
      );
    });

    const unsubscribeLastOnline = onValue(lastOnlineRef, (snapshot) => {
      const val = snapshot.val();
      // Only set lastOnline if it's a valid timestamp (positive number)
      if (typeof val === "number" && val > 0) {
        setLastOnline(val);
        console.log(
          `useOnlineStatus - ${userId} lastOnline updated:`,
          val,
          new Date(val).toLocaleString()
        );
      } else {
        setLastOnline(null);
        console.log(
          `useOnlineStatus - ${userId} lastOnline invalid or null:`,
          val
        );
      }
    });

    return () => {
      unsubscribeConnections();
      unsubscribeLastOnline();
    };
  }, [userId]);

  return { isOnline, lastOnline };
}

export default useOnlineStatus;
