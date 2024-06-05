"use client";
import React from "react";

import { useAtom } from "jotai";
import { loggedInAtom, signupCounter, formData1 } from "../../../Atoms";
import { signUp } from "../../../api/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import HeaderAndFooter from "@/app/header/page";

const Signup1 = () => {
  const [loginFormData, setLoginFormData] = React.useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    passwordToggle: false,
    confirmPasswordToggle: false,
  });
  const [status, setStatus] = React.useState("idle");
  const [error, setError] = React.useState("");
  const [firstPageCleared, setFirstPageCleared] = useAtom(signupCounter);
  const [formDataAtom, setFormDataAtom] = useAtom(formData1);
  const [loggedIn, setLoggedIn] = useAtom(loggedInAtom);
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setLoginFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    let errorMessage = "";

    function validatePassword(s) {
      const hasNumber = /\d/.test(s);
      const hasCapitalLetter = /[A-Z]/.test(s);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(s);

      return hasNumber && hasCapitalLetter && hasSpecialChar;
    }

    if (validatePassword(loginFormData.password) === false) {
      errorMessage = "password";
    } else if (loginFormData.password != loginFormData.confirmPassword) {
      errorMessage = "unmatchedPassword";
    }

    setError(errorMessage);
    if (errorMessage === "") {
      await signUp(loginFormData)
        .then(() => {
          setFormDataAtom(loginFormData);
        })
        .then(() => {
          setFirstPageCleared(true);
        })
        .catch((error) => {
          setError(error.message);
          setStatus("idle");
        });
    } else if (errorMessage != "") {
      setLoginFormData((prev) => ({
        ...prev,

        password: "",
        confirmPassword: "",
        passwordToggle: false,
        confirmPasswordToggle: false,
      }));
      setStatus("idle");
    }
  }

  return (
    <HeaderAndFooter>
      <div>
        {
          (errorMessage = "Failed to sign up. Please try again later." ? (
            <h1>Failed to register, there may be problems with the server</h1>
          ) : null)
        }
        <form onSubmit={handleSubmit} className="signin-form">
          <input
            name="name"
            onChange={handleChange}
            type="text"
            placeholder="Name"
            value={loginFormData.name}
          />
          <input
            name="surname"
            onChange={handleChange}
            type="text"
            placeholder="Surname"
            value={loginFormData.surname}
          />
          {error === "email" ? (
            <p className="signin-error-message">
              Your email has already been selected
            </p>
          ) : null}
          <input
            name="email"
            onChange={handleChange}
            type="email"
            placeholder="Email address"
            value={loginFormData.email}
          />
          {error === "password" ? (
            <p className="signin-error-message">
              Your password doesn't contain capital letters, numbers or special
              characters
            </p>
          ) : null}
          {error === "unmatchedPassword" ? (
            <p className="signin-error-message">
              Your passwords are not matched
            </p>
          ) : null}
          <label className="signin-label-for-password">
            <input
              name="password"
              className="signin-password-input"
              onChange={handleChange}
              type={loginFormData.passwordToggle ? "text" : "password"}
              placeholder="Password"
              value={loginFormData.password}
            />
            <input
              name="passwordToggle"
              className="signin-toggle-input"
              id="passwordToggle"
              onChange={handleChange}
              type="checkbox"
              checked={loginFormData.passwordToggle}
              style={{ display: "none" }}
            />
            <label className="label-password-toggle" for="passwordToggle">
              {" "}
              {loginFormData.passwordToggle ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </label>
          </label>
          <label className="signin-label-for-password">
            <input
              name="confirmPassword"
              className="signin-password-input"
              onChange={handleChange}
              type={loginFormData.confirmPasswordToggle ? "text" : "password"}
              placeholder="Confirm-password"
              value={loginFormData.confirmPassword}
            />
            <input
              name="confirmPasswordToggle"
              className="signin-toggle-input"
              id="confirmPasswordToggle"
              onChange={handleChange}
              type="checkbox"
              checked={loginFormData.confirmPasswordToggle}
              style={{ display: "none" }}
            />
            <label
              className="label-password-toggle"
              for="confirmPasswordToggle"
            >
              {" "}
              {loginFormData.confirmPasswordToggle ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </label>
          </label>
          <button disabled={status === "submitting"}>
            {status === "submitting" ? "Signing..." : "Sign-up"}
          </button>
        </form>
      </div>
    </HeaderAndFooter>
  );
};

export default Signup1;
