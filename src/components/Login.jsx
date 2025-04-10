import React, { useState, useEffect } from "react";
import loginStyle from "../styles/Login.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useLogin from "../customHooks/useLogin";

function Login() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [avatar, setAvatar] = useState({ file: null, url: "" });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  const {
    loading,
    handleLogin,
    handleAvatar,
    handleRegister,
    showPasswordLogin,
    showPasswordRegister,
    toggleShowPasswordLogin,
    toggleShowPasswordRegister,
  } = useLogin();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={loginStyle.login}>
      {(isMobile && !showSignUp) || !isMobile ? (
        <div
          className={`${loginStyle.item} ${
            !isMobile || !showSignUp ? loginStyle.active : ""
          }`}
        >
          <h2>Welcome User</h2>
          <form className={loginStyle.form} onSubmit={handleLogin}>
            <input
              className={loginStyle.inputText}
              type="text"
              placeholder="Email"
              name="email"
            />
            <div className={loginStyle.passwordContainer}>
              <input
                className={loginStyle.inputPassword}
                type={showPasswordLogin ? "text" : "password"}
                placeholder="Password"
                name="password"
              />
              <div className={loginStyle.eye} onClick={toggleShowPasswordLogin}>
                {showPasswordLogin ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
            <button
              className={loginStyle.button}
              disabled={loading}
              type="submit"
            >
              {loading ? "Loading..." : "Sign In"}
            </button>
          </form>
          {isMobile && (
            <p
              className={loginStyle.toggleLink}
              onClick={() => setShowSignUp(true)}
            >
              Don’t have an account? Sign Up
            </p>
          )}
        </div>
      ) : null}

      {(isMobile && showSignUp) || !isMobile ? (
        <div
          className={`${loginStyle.item} ${
            !isMobile || showSignUp ? loginStyle.active : ""
          }`}
        >
          <h2>Create an account</h2>
          <form className={loginStyle.form} onSubmit={handleRegister}>
            <label htmlFor="file" className={loginStyle.label}>
              <img
                src={
                  avatar.url ||
                  "https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png"
                }
                alt=""
              />
              Upload Profile Picture
            </label>
            <input
              type="file"
              name="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleAvatar}
            />
            <input
              className={loginStyle.inputText}
              type="text"
              placeholder="User Name"
              name="username"
            />
            <input
              className={loginStyle.inputText}
              type="text"
              placeholder="Email"
              name="email"
            />
            <div className={loginStyle.passwordContainer}>
              <input
                className={loginStyle.inputPassword}
                type={showPasswordRegister ? "text" : "password"}
                placeholder="Password"
                name="password"
              />
              <div
                className={loginStyle.eye}
                onClick={toggleShowPasswordRegister}
              >
                {showPasswordRegister ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
            <button
              className={loginStyle.button}
              disabled={loading}
              type="submit"
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>
          </form>
          {isMobile && (
            <p
              className={loginStyle.toggleLink}
              onClick={() => setShowSignUp(false)}
            >
              Already have an account? Sign In
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default Login;
