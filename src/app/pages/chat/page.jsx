"use client";
import React from "react";
import HeaderAndFooter from "@/app/header/page";
import { getChats, addChat, removeChat } from "../../api/auth";
import { useAtom } from "jotai";

import { userAtom, chatIdAtom } from "@/app/Atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";
import { query } from "firebase/firestore";
export default function Chat() {
  const [chatName, setChatName] = React.useState("");
  const [userData, setUserData] = useAtom(userAtom);
  const [chatId, setChatId] = useAtom(chatIdAtom);
  const [chatsList, setChatsList] = React.useState([]);
  const [update, setUpdate] = React.useState(false);
  const router = useRouter();
  function handleChange(e) {
    const { value } = e.target;
    setChatName(value);
  }

  React.useEffect(() => {
    console.log(userData);
    getChats()
      .then((data) => {
        console.log(data);
        setChatsList([...data]);
      })
      .catch((error) => console.log(error));
  }, [update]);
  React.useEffect(() => {
    console.log(update);
  }, [update]);
  async function handleSubmit(e) {
    e.preventDefault();
    addChat(chatName, userData.username, uuid()).then(() => {
      setTimeout(
        setUpdate((prev) => !prev),
        5000
      );
    });
  }

  const chatMapped = chatsList.map((chat) => {
    return (
      <div
        style={{
          width: "150px",
          height: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "2em",
          marginLeft: "1em",
          border: " #209cee solid 2px",

          background: "#75c1f2",
          color: "white",
          fontWeight: "800",
          cursor: "pointer",
          position: "relative",
          boxSizing: "border-box",
        }}
        key={uuid}
        onClick={(e) => {
          e.preventDefault();
          console.log(chat.id);
          sessionStorage.setItem("chatId", chat.id);
          setChatId(chat.id);

          router.push("/pages/chat-specific");
        }}
      >
        <p style={{ margin: "0", pointerEvents: "none" }}>{chat.name}</p>
        {chat.host === userData.username ? (
          <button
            className="remove-chat-button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              removeChat(chat.id).then(() => {
                sessionStorage.removeItem("chatId");
                setTimeout(
                  setUpdate((prev) => !prev),
                  5000
                );
              });
            }}
          >
            x
          </button>
        ) : null}
      </div>
    );
  });

  return (
    <HeaderAndFooter>
      <form style={{ margin: "1em 0 1em 1em" }}>
        <input
          name="name"
          onChange={handleChange}
          type="text"
          className="signin-input"
          placeholder="Choose a chat name"
          value={chatName}
          style={{
            width: "20%",
            marginRight: "0.5em",
            marginBottom: "1.5em",
            padding: "0.2em 1em",
            maxWidth: "154px",
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: "0.2em 1em",
            background: " #209cee ",
            color: "white",
            border: "none",
            borderBottomRightRadius: "5px",
            borderTopRightRadius: "5px",
          }}
        >
          Add
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </form>
      {chatsList.length > 0 ? (
        chatMapped
      ) : (
        <div
          style={{
            marginLeft: "1em",
            padding: "0.5em 0",

            background: "#75c1f2",
            fontWeight: "800",
            maxWidth: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              color: " #209cee",
              fontWeight: "700",
              margin: "0",
              color: "white",
            }}
          >
            NO CHATS AVAILABLE
          </p>
        </div>
      )}
    </HeaderAndFooter>
  );
}
