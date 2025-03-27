import React, { Component } from "react";
import { Navigate} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 

import "./index.css";

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: "",
      email: "",
      company: "",
      gender: "",
      dateofbirth: "",
      country: "",
      Aboutyourself: "",
      showSubmitError: false,
      errorMsg: "",
      redirectToHome: false,
      redirectToLogin: false,
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFormSubmitSuccess = () => {
    this.setState({ redirectToLogin: true });
  };

  handleFormSubmitFailure = (errorMsg) => {
    this.setState({ showSubmitError: true, errorMsg });
  };

  handleFormSubmission = async (event) => {
    event.preventDefault(); 

    const { fullname, email, company, gender, dateofbirth, country, Aboutyourself } = this.state;

    if (!fullname || !email || !company || !gender || !dateofbirth || !country || !Aboutyourself) {
      this.handleFormSubmitFailure("All fields are required.");
      return;
    }

    const userDetails = { fullname, email, company, gender, dateofbirth, country, Aboutyourself };

    const url = "http://localhost:5000/signup";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails), 
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json(); 

      if (response.ok) {
        this.handleFormSubmitSuccess(); 
      } else {
        this.handleFormSubmitFailure(data.message || "Something went wrong."); 
      }
    } catch (error) {
      this.handleFormSubmitFailure("Something went wrong. Please try again.");
    }
  };

  onHandleLogin = () => {
    this.setState({ redirectToLogin: true });
  };

  render() {
    const {
      fullname,
      email,
      company,
      gender,
      dateofbirth,
      country,
      Aboutyourself,
      showSubmitError,
      errorMsg,
      redirectToLogin,
    } = this.state;

    if (redirectToLogin) {
      return <Navigate to="/" />;
    }

    return (
      <div className="register-form-wrapper">
        
        <div className="register-form-content">
          <div className="register-form-left">
            <h1 className="form-title">Sign up</h1>
            <p className="form-description">
              Already have an account?
              <span className="login-link" onClick={this.onHandleLogin}>
                Sign in here
              </span>
            </p>
          </div>
          <form className="register-form" onSubmit={this.handleFormSubmission}>
            <hr className="form-separator" />
            {showSubmitError && <p className="form-error-message">{errorMsg}</p>} 
            <div className="form-input-group">
              <label className="input-label" htmlFor="fullname" style={{ color: '#333' }}>
               Fullname
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                className="input-field"
                value={fullname}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="form-input-group">
              <label className="input-label" htmlFor="email" style={{ color: '#333' }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="input-field"
                value={email}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="form-input-group">
              <label className="input-label" htmlFor="gender" style={{ color: '#333' }}>
            Gender
              </label>
              <select
                id="gender"
                name="gender"
                className="input-field" 
                value={gender}
                onChange={this.handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-input-group">
              <label className="input-label" htmlFor="dateofbirth" style={{ color: '#333' }}>
              Date of Birth
              </label>
              <input
                type="date"
                id="dateofbirth"
                name="dateofbirth"
                className="input-field"
                value={dateofbirth}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="form-input-group">
              <label className="input-label" htmlFor="country" style={{ color: '#333' }}>
              Country
              </label>
              <select
                id="country"
                name="country"
                className="input-field"
                value={country}
                onChange={this.handleInputChange}
                required
              >
                <option value="">Select Country</option>
                <option value="India">India</option>
              </select>
            </div>
            <div className="form-input-group">
              <label className="input-label" htmlFor="company" style={{ color: '#333' }}>
              Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                className="input-field"
                value={company}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="form-input-group">
              <label className="input-label" htmlFor="aboutyourself" style={{ color: '#333' }}>
                About Yourself
              </label>
              <textarea
                id="aboutyourself"
                name="Aboutyourself"
                className="textarea-field"
                value={Aboutyourself}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Register
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default RegisterForm;
