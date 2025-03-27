import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";
import { FaEnvelope } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const onSubmitForm = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/forgotpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Password reset link sent successfully!");
        setIsError(false);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Failed to send reset link. Please try again.");
        setIsError(true);
      }
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again.");
      setIsError(true);
    }
  };

  return (
    <div className="login-form-container">
      
      <div className="sign-container">
        <div className="flex-1">
          <h1 className="heading">Forgot Password?</h1>
          <p className="pa1">
            Remember your password?{" "}
            <Link className="lk" to="/">
              <span className="span-sign">Sign in here</span>
            </Link>
          </p>
        </div>
        <form className="form-container1" onSubmit={onSubmitForm}>
          <div className="input-container">
            <label className="input-label" htmlFor="email">
            Email:
            </label>
            <input
              type="email"
              id="email"
              className="username-input-field2"
              value={email}
              onChange={onChangeEmail}
              required
            />
          </div>
          {message && (
            <p className={isError ? "error-message" : "success-message"}>{message}</p>
          )}
          <button type="submit" className="login-button1">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
