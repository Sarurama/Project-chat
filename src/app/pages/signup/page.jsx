"use client";
import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../api/auth";
import { useAtom } from "jotai";
import { loggedInAtom, signupCounter, formData1, userAtom } from "../../Atoms";
import { signUp } from "../../api/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEyeSlash,
  faEye,
  faDownload,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import imageCompression from "browser-image-compression";
import HeaderAndFooter from "@/app/header/page";
import { useRouter } from "next/navigation";
/* import ReactDatePicker from "react-datepicker"; */
const Signup = () => {
  const [loginFormData, setLoginFormData] = React.useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    passwordToggle: false,
    confirmPasswordToggle: false,
    image: "",
    username: "",
    age: "",
    gender: "",
    description: "",
  });

  const [status, setStatus] = React.useState("idle");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [firstPageCleared, setFirstPageCleared] = useAtom(signupCounter);
  const [formDataAtom, setFormDataAtom] = useAtom(formData1);
  const [loggedIn, setLoggedIn] = useAtom(loggedInAtom);
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();
  React.useEffect(() => {
    console.log(loginFormData);
  }, [loginFormData]);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log(user);
      setLoading(true);
    });

    return () => unsubscribe();
  }, [loggedIn]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setLoginFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }
  async function compressImage(file) {
    const options = {
      maxSizeMB: 0.5, // (max file size in MB)
      maxWidthOrHeight: 400, // (compressed file width)
      useWebWorker: true,
    };

    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error(error);
      return file; // Return the original file if compression fails
    }
  }
  const handleImageChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0]; // Get the single file from the input
    if (!file) return; // Ensure a file was selected

    try {
      const compressedFile = await compressImage(file); // Compress the image
      const reader = new FileReader();

      reader.onloadend = () => {
        setLoginFormData((prev) => ({
          ...prev,
          image: reader.result, // Directly set the image result
        }));
      };

      reader.readAsDataURL(compressedFile); // Read the compressed file as Data URL
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };
  function validatePassword(s) {
    const hasNumber = /\d/.test(s);
    const hasCapitalLetter = /[A-Z]/.test(s);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(s);

    return hasNumber && hasCapitalLetter && hasSpecialChar;
  }
  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    let errorMessage = "";

    loginFormData.name === "" ? (errorMessage = "name") : null;
    loginFormData.surname === "" ? (errorMessage = "surname") : null;
    loginFormData.email === "" ? (errorMessage = "email") : null;
    if (
      validatePassword(loginFormData.password) === false ||
      loginFormData.password.length < 8
    ) {
      errorMessage = "password";
    } else if (loginFormData.password != loginFormData.confirmPassword) {
      errorMessage = "unmatchedPassword";
    }
    if (loginFormData.phoneNumber.toString().length < 8) {
      errorMessage = "phoneNumber";
    }
    if (errorMessage === "") {
      setFirstPageCleared(true);
    } else if (errorMessage != "") {
      setLoginFormData((prev) => ({
        ...prev,

        password: "",
        confirmPassword: "",
        passwordToggle: false,
        confirmPasswordToggle: false,
      }));
      setStatus("idle");
      setError(errorMessage);
    }
  }
  async function handleSubmiTwo(e) {
    e.preventDefault();
    setStatus("submitting");
    let errorMessage = "";
    loginFormData.nickname != "" ? null : (errorMessage = "nickname");

    errorMessage === "" &&
      (await signUp(loginFormData)
        .then(() => {
          setFormDataAtom(loginFormData);
        })
        .catch((error) => {
          setError(error.message);
          setStatus("idle");
        })
        .finally(() => {
          setFirstPageCleared(false);
          setLoading(false);
          router.push("/pages/login");
        }));
    setError(errorMessage);
    setStatus("idle");
  }

  return (
    <HeaderAndFooter>
      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1 style={{ color: "#209cee " }}>
            {!firstPageCleared
              ? "Create a new account"
              : "Complete the account"}
          </h1>
          {error === "Failed to sign up. Please try again later." ? (
            <h1>Failed to register, there may be problems with the server</h1>
          ) : null}
          {!firstPageCleared ? (
            <form
              onSubmit={handleSubmit}
              className="signin-form-one"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "left",
                width: "80%",
                position: "relative",
              }}
            >
              <img
                src="\man-chatting-on-phone-5317413-4438202 (1).webp"
                style={{
                  width: "150px",
                  position: "absolute",
                  bottom: "20px",
                  right: "130px",
                  transform: "rotate(-40deg)",
                }}
              ></img>
              <img
                src="\man-chatting-on-phone-5317413-4438202 (1).webp"
                style={{
                  width: "150px",
                  position: "absolute",
                  top: "30px",
                  right: "30px",
                  transform: "rotate(130deg)",
                }}
              ></img>
              <section
                style={{
                  width: "100%",
                  display: "flex",
                  marginLeft: "10%",
                  position: "relative",
                }}
              >
                {" "}
                {error === "name" && (
                  <p
                    className="signin-error-message"
                    style={{ position: "absolute", top: "-15px" }}
                  >
                    You must insert a name
                  </p>
                )}
                <input
                  name="name"
                  onChange={handleChange}
                  type="text"
                  className="signin-input"
                  placeholder="Name"
                  value={loginFormData.name}
                  style={{
                    width: "20%",
                    marginRight: "2em",
                    marginBottom: "2em",
                    padding: "0.2em 1em",
                    maxWidth: "154px",
                  }}
                />
                {error === "surname" && (
                  <p
                    className="signin-error-message"
                    style={{
                      position: "absolute",
                      top: "-15px",
                      left: "205px",
                    }}
                  >
                    You must insert a surname
                  </p>
                )}
                <input
                  name="surname"
                  className="signin-input"
                  onChange={handleChange}
                  type="text"
                  placeholder="Surname"
                  value={loginFormData.surname}
                  style={{
                    width: "20%",
                    marginRight: "1em",
                    marginBottom: "2em",
                    padding: "0.2em 1em",
                    maxWidth: "154px",
                  }}
                />
              </section>

              {error === "email" ? (
                <p
                  className="signin-error-message"
                  style={{ position: "absolute", top: "70px", left: "10%" }}
                >
                  Your email has already been selected
                </p>
              ) : null}
              <input
                name="email"
                onChange={handleChange}
                className="signin-input"
                type="email"
                placeholder="Email address"
                value={loginFormData.email}
                style={{
                  width: "30%",
                  marginRight: "2em",
                  marginBottom: "2em",
                  padding: "0.2em 1em",
                  marginLeft: "10%",
                  maxWidth: "200px",
                }}
              />
              {error === "phoneNumber" && (
                <p
                  className="signin-error-message"
                  style={{ position: "absolute", top: "128px", left: "10%" }}
                >
                  your phone Number has a mistake
                </p>
              )}
              <input
                name="phoneNumber"
                onChange={handleChange}
                className="signin-input"
                type="number"
                placeholder="Phone Number"
                value={loginFormData.phoneNumber}
                style={{
                  width: "30%",
                  marginRight: "1em",
                  marginBottom: "2em",
                  padding: "0.2em 1em",
                  marginLeft: "10%",
                  maxWidth: "200px",
                }}
              />

              <section
                style={{
                  width: "100%",
                  display: "flex",
                  marginLeft: "10%",
                  position: "relative",
                }}
              >
                {error === "password" ? (
                  <p
                    className="signin-error-message"
                    style={{ position: "absolute", top: "-15px" }}
                  >
                    Your password contains less than 8 characters or it doesn't
                    contain capital letters, numbers or special characters
                  </p>
                ) : null}
                {error === "unmatchedPassword" ? (
                  <p
                    className="signin-error-message"
                    style={{ position: "absolute", top: "-10px" }}
                  >
                    Your passwords are not matched
                  </p>
                ) : null}
                <label
                  className="signin-label-for-password"
                  style={{
                    height: "32px",
                    width: "32%",
                    maxWidth: "190px",
                    marginBottom: "1em",
                  }}
                >
                  <input
                    name="password"
                    className="signin-password-input"
                    onChange={handleChange}
                    type={loginFormData.passwordToggle ? "text" : "password"}
                    placeholder="Password"
                    value={loginFormData.password}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "0.2em 1em",
                    }}
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
                  <label
                    className="label-password-toggle"
                    htmlFor="passwordToggle"
                    style={{ position: "absolute", right: "5px", top: "13%" }}
                  >
                    {" "}
                    {loginFormData.passwordToggle ? (
                      <FontAwesomeIcon
                        icon={faEye}
                        style={{ opacity: "0.5" }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        style={{ opacity: "0.5" }}
                      />
                    )}
                  </label>
                </label>

                <label
                  className="signin-label-for-password"
                  style={{
                    width: "32%",
                    marginBottom: "0.5em",
                    height: "32px",
                    marginLeft: "2em",
                    maxWidth: "190px",
                  }}
                >
                  <input
                    name="confirmPassword"
                    className="signin-password-input"
                    onChange={handleChange}
                    type={
                      loginFormData.confirmPasswordToggle ? "text" : "password"
                    }
                    placeholder="Confirm-password"
                    value={loginFormData.confirmPassword}
                    style={{
                      width: "100%",
                      marginRight: "1em",
                      marginBottom: "2em",
                      boxSizing: "border-box",
                      padding: "0.2em 1em",
                    }}
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
                    htmlFor="confirmPasswordToggle"
                    style={{ position: "absolute", right: "5px", top: "13%" }}
                  >
                    {" "}
                    {loginFormData.confirmPasswordToggle ? (
                      <FontAwesomeIcon
                        icon={faEye}
                        style={{ opacity: "0.5" }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        style={{ opacity: "0.5" }}
                      />
                    )}
                  </label>
                </label>
              </section>
              <button
                disabled={status === "submitting"}
                className="signup-button"
              >
                <FontAwesomeIcon
                  icon={faArrowRight}
                  style={{ height: "25px" }}
                />
              </button>
            </form>
          ) : (
            <form className="signin-form-second" onSubmit={handleSubmiTwo}>
              {error === "nickname" && (
                <p className="signin-error-message">Insert a nickname</p>
              )}
              <section style={{ display: "flex", flexDirection: "column" }}>
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  onChange={handleChange}
                  value={loginFormData.username}
                  style={{
                    width: "100%",
                    marginRight: "1em",
                    height: "20px",
                    padding: "0.2em 1em",
                    marginBottom: "2em",
                    maxWidth: "200px",
                  }}
                />

                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={loginFormData.age}
                  onChange={handleChange}
                  style={{
                    width: "15%",
                    maxWidth: "60px",
                    padding: "0.2em 1em",
                    marginBottom: "1em",
                  }}
                />
                <div>
                  <h4 style={{ margin: "0", color: "white" }}>Gender</h4>
                  <fieldset
                    style={{
                      display: "flex",
                      border: "white solid 1px",
                      borderRadius: "5px",
                      padding: "0.5em 0.7em",
                      margin: "0",
                    }}
                  >
                    <label
                      style={{
                        marginRight: "0.5em",
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        color: "white",
                      }}
                    >
                      <input
                        type="radio"
                        value="male"
                        name="gender"
                        checked={loginFormData.gender === "male"}
                        onChange={handleChange}
                      ></input>
                      Male
                    </label>
                    <label
                      style={{
                        marginRight: "0.5em",
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        color: "white",
                      }}
                    >
                      <input
                        type="radio"
                        value="female"
                        name="gender"
                        checked={loginFormData.gender === "female"}
                        onChange={handleChange}
                      ></input>
                      Female
                    </label>
                    <label
                      style={{
                        marginRight: "0.5em",
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        color: "white",
                      }}
                    >
                      <input
                        type="radio"
                        value="other"
                        name="gender"
                        checked={loginFormData.gender === "other"}
                        onChange={handleChange}
                      ></input>
                      Other
                    </label>
                  </fieldset>
                </div>
              </section>

              <div
                className="Profile-profile-input-div"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "200px",
                }}
              >
                <label
                  className="file-upload-btn"
                  htmlFor="image-file-input"
                  style={{
                    color: "white",
                    cursor: "pointer",
                    marginBottom: "0.5em",
                    fontSize: "1.2rem",
                  }}
                >
                  {loginFormData.image.length > 0
                    ? "Cambia immagine"
                    : "Carica Immagine"}
                  <FontAwesomeIcon icon={faDownload} />
                  <input
                    type="file"
                    id="image-file-input"
                    className="AddVans-form-standard-input"
                    onChange={handleImageChange}
                    name="image"
                    placeholder="Insert an image"
                    style={{ display: "none" }}
                  />
                </label>
                <img
                  style={{ width: "100px" }}
                  src={
                    loginFormData.image.length > 0
                      ? loginFormData.image[0]
                      : "/user-profile.png"
                  }
                ></img>

                <div
                  className="fileName"
                  style={
                    loginFormData.image.length > 0
                      ? { display: "none" }
                      : { display: "block", color: "white", fontSize: "0.8rem" }
                  }
                >
                  {loginFormData.image.length > 0
                    ? ""
                    : "Nessun file selezionato"}
                </div>
              </div>
              <button
                disabled={status === "submitting"}
                className="signup-button-two"
              >
                {status === "submitting" ? "Signing..." : "Sign-up"}{" "}
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </form>
          )}
        </div>
      ) : (
        <div>
          <p>Loading...</p>
        </div>
      )}
    </HeaderAndFooter>
  );
};

export default Signup;
