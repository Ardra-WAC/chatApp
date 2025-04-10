import { ref, set, onDisconnect } from "firebase/database";
import { auth, rtdb } from "../lib/firebase";

export const setOnlineStatus = () => {
  const user = auth.currentUser;
  if (!user) return;

  const statusRef = ref(rtdb, `/onlineStatus/${user.uid}`);

  set(statusRef, {
    online: true,
    lastSeen: Date.now(),
  });

  onDisconnect(statusRef).set({
    online: false,
    lastSeen: Date.now(),
  });
};
