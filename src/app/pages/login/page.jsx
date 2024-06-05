"use client";

import React from "react";
import { useAtom } from "jotai";
import { loggedInAtom } from "../../Atoms";
import { useRouter } from "next/navigation";

import { userAtom } from "../../Atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import HeaderAndFooter from "@/app/header/page";
import { logIn } from "@/app/api/auth";
const Login = () => {
  const [error, setError] = React.useState(null);
  const [status, setStatus] = React.useState("idle");
  const [loginFormData, setLoginFormData] = React.useState({
    email: "",
    password: "",
  });
  const [secondPhase, setSecondPhase] = React.useState(false);
  const [loggedIn, setLoggedIn] = useAtom(loggedInAtom);
  const [userData, setUserData] = useAtom(userAtom);
  const router = useRouter();
  function handleChange(e) {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  React.useEffect(() => {
    console.log(userData);
  }, [userData]);

  function toSecondPhase(e) {
    e.preventDefault();
    setSecondPhase(true);
  }

  function handleSubmit(e) {
    e.preventDefault();

    setStatus("submitting");
    setError(null);
    logIn(loginFormData)
      .then((data) => {
        console.log(data);
        setLoggedIn(true);
        localStorage.setItem("loggedIn", true);
        localStorage.setItem("userData", JSON.stringify(data));
        setUserData(data);
        router.push("/pages/chat");
      })
      .catch((err) => {
        setSecondPhase(false);
        setLoginFormData((prev) => ({ ...prev, email: "", password: "" }));
        setError(err);
      })
      .finally(() => {
        setStatus("idle");
      });
  }

  return (
    <HeaderAndFooter>
      <main
        style={{
          width: "100%",
          height: "40vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="login-container">
          <h1 style={{ color: "white", marginRight: "1em" }}>
            Login to your account
          </h1>
          {error?.message && (
            <h2
              style={{
                color: "red",
                fontSize: "16px",
                position: "absolute",
                top: "5px",
                right: "5px",
              }}
            >
              {error.message}
            </h2>
          )}

          <form
            className="login-form"
            style={{ display: "flex", alignItems: "center" }}
          >
            {!secondPhase ? (
              <input
                className="login-input"
                name="email"
                onChange={handleChange}
                type="email"
                placeholder="Email address"
                value={loginFormData.email}
              />
            ) : null}
            {secondPhase ? (
              <input
                name="password"
                className="login-input"
                onChange={handleChange}
                type="password"
                placeholder="Password"
                value={loginFormData.password}
                autoComplete="new-password"
              />
            ) : null}

            {secondPhase ? (
              <button
                disabled={status === "submitting"}
                onClick={handleSubmit}
                style={{
                  fontSize: "20px",
                  border: "none",
                  background:
                    "linear-gradient(to top, rgba(117, 193, 242), rgb(155, 206, 239))",
                  borderRadius: "5px",
                  color: "#209cee",
                }}
              >
                {status === "submitting" ? (
                  "Logging in..."
                ) : (
                  <FontAwesomeIcon icon={faArrowRight} />
                )}
              </button>
            ) : (
              <button
                disabled={status === "submitting"}
                onClick={toSecondPhase}
                style={{
                  fontSize: "20px",
                  border: "none",
                  background:
                    "linear-gradient(to top, rgba(117, 193, 242), rgb(155, 206, 239))",
                  borderRadius: "5px",
                  color: "#209cee",
                }}
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            )}
          </form>
        </div>
      </main>
    </HeaderAndFooter>
  );
};

export default Login;
