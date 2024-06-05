import { atom } from "jotai";

export const loggedInAtom = atom(localStorage.getItem("loggedIn") || false);

export const signupCounter = atom(false);

export const formData1 = atom();

export const userAtom = atom(
  JSON.parse(localStorage.getItem("userData")) || ""
);

export const chatIdAtom = atom(sessionStorage.getItem("chatId") || "");
