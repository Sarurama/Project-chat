"use client";
import React from "react";
import HeaderAndFooter from "@/app/header/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useAtom } from "jotai";
import { chatIdAtom, userAtom } from "@/app/Atoms";
import { getChat, writeComment } from "@/app/api/auth";

const ChatSpecific = () => {
  const [chatId, setChatId] = useAtom(chatIdAtom);
  const [user, setUser] = useAtom(userAtom);
  const [loadingComments, setLoadingComments] = React.useState(true);

  const [chat, setChat] = React.useState("");
  const [chatComments, setChatComments] = React.useState([]);
  const [inputText, setInputText] = React.useState("");
  const [loadingInput, setLoadingInput] = React.useState(true);
  async function chatLoader() {
    await getChat(chatId)
      .then((data) => {
        setChat(data);
        console.log(data.comments);
        setChatComments(data.comments.length > 0 ? [...data.comments] : null);
      })
      .finally(setLoadingComments(false));
  }
  React.useEffect(() => {
    console.log(chat);
  }, [chat]);
  React.useEffect(() => {
    chatLoader();
    console.log(chatId);
  }, []);
  function handleChange(e) {
    setInputText(e.target.value);
  }
  React.useEffect(() => {
    console.log(chatComments);
  }, [chatComments]);
  React.useEffect(() => {
    console.log(chatId);
  }, [chatId]);
  function handleSubmit(e) {
    e.preventDefault();

    if (inputText != "") {
      setLoadingInput(false);
      writeComment(inputText, chatId, user.username).then(() => {
        setInputText("");
        setLoadingInput(true);
        setChatComments((prev) => [
          ...prev,
          { commentText: inputText, writerName: user.username },
        ]);
      });
    }
  }
  return (
    <HeaderAndFooter>
      {!loadingComments ? (
        <div
          className="chat-specific-main-div"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "1em 0 0",

            boxSizing: "border-box",
          }}
        >
          <main className="Chat-main">
            <section className="Chat-section-header">
              {" "}
              <h1
                style={{
                  color: "#209cee",
                  fontWeight: "700",
                  margin: "0.5em 0.5em",
                }}
              >
                <Link
                  href="../pages/chat"
                  style={{ color: "#209cee", marginRight: "1em" }}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Link>
                {chat.name ? chat.name : "Anonymous"}
              </h1>{" "}
              <p
                style={{
                  margin: "0.5em 1em",
                  color: "#209cee",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                }}
              >
                <img src="/faviconM32.png" style={{ width: "28px" }}></img>y
                <img src="/favicon-32x32.png" style={{ width: "28px" }}></img>
                hat
              </p>
            </section>
            <section
              style={
                chat.comments && chat.comments.length > 0
                  ? { overflow: "auto", width: "100%" }
                  : { overflow: "none", width: "100%" }
              }
            >
              <div className="Chat-section-chat">
                {chat.comments && chat.comments.length > 0 ? (
                  chatComments.map((message, index) => {
                    return message.writerName != user.username ? (
                      <div
                        style={{
                          display: "flex",
                          alignContent: "center",
                          padding: "0.5em 0.5em",
                          margin: "0.5em 0.8em",
                          position: "relative",
                          boxSizing: "border-box",
                          background: "#209CEE",
                          borderRadius: "6px",
                          width: "60%",
                          minHeight: "min-content",
                        }}
                        key={index}
                      >
                        <div
                          style={{
                            position: "absolute",
                            left: "-7px",
                            top: "0",
                            borderRight: "solid 12px #209CEE",
                            borderTop: "0 transparent solid",
                            borderBottom: "20px transparent solid",
                          }}
                        ></div>
                        <section
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          {" "}
                          <p
                            style={{
                              display: "flex",
                              margin: "0",
                              fontSize: "0.8rem",
                              fontWeight: "600",
                              color: "white",
                              borderBottom: "1px #75c1f2 solid",
                            }}
                          >
                            {message.writerName}
                          </p>
                          <p
                            style={{
                              color: "white",
                              margin: "0",
                              fontSize: "1.1rem",
                              wordWrap: "break-word",
                            }}
                          >
                            {message.commentText}
                          </p>
                        </section>
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "60%",
                          alignSelf: "end",
                          padding: "0.8em 0.5em",
                          margin: "0.5rem 0.8rem ",
                          background: "#75c1f2",
                          borderRadius: "6px",
                          position: "relative",
                          minHeight: "min-content",
                        }}
                        key={index}
                      >
                        <div
                          style={{
                            position: "absolute",
                            right: "-7px",
                            bottom: "0",
                            borderLeft: "solid 12px #75c1f2",
                            borderTop: "20px transparent solid",
                            borderBottom: "0 transparent solid",
                          }}
                        ></div>{" "}
                        <p
                          style={{
                            color: "white",
                            textAlign: "end",
                            margin: "0",
                            fontSize: "1.1rem",
                            wordWrap: "break-word",
                          }}
                        >
                          {message.commentText}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <h1 style={{ color: "#75c1f2" }}>No messages</h1>
                )}
              </div>
            </section>
          </main>
          <form
            onSubmit={handleSubmit}
            style={{
              width: "50%",
              display: "flex",
              border: "#209cee solid 2px",
              boxSizing: "border-box",
            }}
          >
            <textarea
              value={inputText}
              onChange={handleChange}
              style={{
                width: "90%",
                resize: "none",
                padding: "0.5em 0.8em",
                fontSize: "1.2rem",
                border: "none",
                color: "black",
              }}
            ></textarea>
            <button
              style={{
                width: "10%",
                border: "none",
                color: "white",
                background: "#75c1f2",
                fontSize: "1rem",
              }}
              disabled={!loadingInput}
            >
              {loadingInput ? <FontAwesomeIcon icon={faArrowRight} /> : "Load"}
            </button>
          </form>
        </div>
      ) : (
        <p style={{ margin: "1em", fontSize: "2rem", fontWeight: "900" }}>
          Loading...
        </p>
      )}
    </HeaderAndFooter>
  );
};

export default ChatSpecific;
