import {
  ref,
  set,
  onDisconnect,
  push,
  serverTimestamp,
} from "firebase/database";
import { auth, rtdb } from "../lib/firebase";

export const setOnlineStatus = () => {
  const user = auth.currentUser;
  if (!user) {
    console.log("No user authenticated, skipping setOnlineStatus");
    return;
  }

  const connectionsRef = ref(rtdb, `users/${user.uid}/connections`);
  const lastOnlineRef = ref(rtdb, `users/${user.uid}/lastOnline`);

  const con = push(connectionsRef);
  set(con, true)
    .then(() =>
      console.log(`Connection set for user ${user.uid} at ${con.key}`)
    )
    .catch((err) =>
      console.error(`Error setting connection for ${user.uid}:`, err)
    );

  onDisconnect(con)
    .remove()
    .then(() =>
      console.log(
        `onDisconnect registered to remove connection for ${user.uid}`
      )
    )
    .catch((err) =>
      console.error(
        `Error registering onDisconnect for connection ${user.uid}:`,
        err
      )
    );

  onDisconnect(lastOnlineRef)
    .set(serverTimestamp())
    .then(() =>
      console.log(`onDisconnect registered to set lastOnline for ${user.uid}`)
    )
    .catch((err) =>
      console.error(
        `Error registering onDisconnect for lastOnline ${user.uid}:`,
        err
      )
    );
};
