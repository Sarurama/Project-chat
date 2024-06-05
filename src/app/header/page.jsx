"use client";

import Link from "next/link";
import React from "react";
import { useAtom } from "jotai";
import { loggedInAtom } from "../Atoms";
import { userAtom } from "../Atoms";
import { useRouter } from "next/navigation";
import { auth } from "../api/auth";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "../api/auth";
const HeaderAndFooter = ({ children }) => {
  const [loggedIn, setLoggedIn] = useAtom(loggedInAtom);
  const [userData, setUserData] = useAtom(userAtom);
  const router = useRouter();
  async function logOut() {
    setLoggedIn(false);
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("chatId");
    await signOut().then(() => {
      router.push("/pages/login");
    });
  }
  /*   React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        console.log("No user is signed in.");
      }
    });

    return () => unsubscribe();
  }, []); */
  React.useEffect(() => {
    console.log(userData);
  }, []);
  const linkStyle = {
    fontSize: "1.2rem",
    padding: "0.3em 0.5em",
    fontWeight: "800",
    color: "white",
    background: "#75c1f2",
    textDecoration: "none",
  };

  const profileContent = () => {
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
            justifyContent: "space-between",
            height: "100%",
            padding: "0.5em",
            boxSizing: "border-box",
            background: "#209CEE",

            border: "5px solid",
            borderImage:
              "radial-gradient(circle,rgb(117, 193, 242),rgb(155, 206, 239) )1",
          }}
        >
          <section
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: "0  15px 0 0" }}>
              {userData.username ? `${userData.username}` : "Anonymous"}
            </h3>
            <img
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                /*  border: "3px black solid", */
              }}
              src={
                userData.profileImage
                  ? `${userData.profileImage}`
                  : "/user-profile.png"
              }
            ></img>
          </section>
          <section
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "90%",
              justifyContent: "space-between",
            }}
          >
            <Link href="../pages/chat" style={linkStyle}>
              Chats
            </Link>
            <button className="signout-button" onClick={logOut}>
              LogOut
            </button>
          </section>
        </div>
      </>
    );
  };

  return (
    <>
      <header className="header-header">
        <h1>
          <img src="/faviconM32.png" style={{ width: "48px" }}></img>y
          <img src="/favicon-32x32.png" style={{ width: "48px" }}></img>hat
        </h1>
        <nav
          className="header-header-nav"
          style={
            loggedIn
              ? { justifyContent: "end" }
              : { justifyContent: "space-around" }
          }
        >
          {loggedIn ? (
            profileContent()
          ) : (
            <Link href="../pages/login" style={linkStyle}>
              LogIn
            </Link>
          )}
          {loggedIn ? null : (
            <Link href="../pages/signup" style={linkStyle}>
              SignUp
            </Link>
          )}
        </nav>
      </header>
      {children}

      <footer className="header-footer">
        {" "}
        <h3 style={{ width: "20%", margin: "0", textAlign: "center" }}>
          Sono il footer
        </h3>{" "}
      </footer>
    </>
  );
};

export default HeaderAndFooter;
