import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const userValue = atomWithStorage("authUser", null, localStorage, {
  getOnInit: true,
});

export const authLoading = atom(true);

export const chatValue = atom({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
});
