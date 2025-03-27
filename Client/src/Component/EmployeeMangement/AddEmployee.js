import React, { useState } from "react";
import { FaCircleCheck, Facricle } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AddEmployee.css"

const AddEmployee = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    basicDetails: { email: "", phone: "", dateOfBirth: "", gender: "" },
    address: { street: "", city: "", state: "", zipcode: "", country: "" },
    employment: { company: "", department: "", position: "", startDate: "" },
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [documentData, setDocumentData] = useState({
    Photo: null,
    idProof: null,
  });
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const handleInputChange = (section, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: { ...prevData[section], [field]: value },
    }));
  };

  const handleFileChange = (section, field, file) => {
    if (section === "documents") {
      setDocumentData((prevData) => ({
        ...prevData,
        [field]: file,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [section]: { ...prevData[section], [field]: file },
      }));
    }
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
    setFullName(`${e.target.value} ${lastName}`);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    setFullName(`${firstName} ${e.target.value}`);
  };

  const handleDateChange = (section, field, date) => {
    const formattedDate = date ? date.toISOString().split("T")[0] : "";
    handleInputChange(section, field, formattedDate);
  };

  const nextStep = () => {
    setActiveTab((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setActiveTab((prev) => Math.max(prev - 1, 0));
  };

  const getTokenFromCookies = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  };

  const handleSubmit = async () => {
    const token = getTokenFromCookies();

    if (!token) {
      alert("Authentication failed. Please login.");
      return;
    }

    const formDataToSend = {
      fullname: fullName,
      firstName: firstName,
      lastName: lastName,
      email: formData.basicDetails.email,
      phone: formData.basicDetails.phone,
      dateOfBirth: formData.basicDetails.dateOfBirth,
      department: formData.employment.department,
      position: formData.employment.position,
      startDate: formData.employment.startDate,
      streetAddress: formData.address.street,
      city: formData.address.city,
      state: formData.address.state,
      zipCode: formData.address.zipcode,
      country: formData.address.country,
      gender: formData.basicDetails.gender,
      company: formData.employment.company,
    };

    try {
      const response = await fetch("http://localhost:5000/registeremployee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formDataToSend),
      });

      if (response.ok) {
        setShowSuccessOverlay(true);
        setFormData({
          basicDetails: { email: "", phone: "", dateOfBirth: "", gender: "" },
          address: { street: "", city: "", state: "", zipcode: "", country: "" },
          employment: { company: "", department: "", position: "", startDate: "" },
        });
        setFirstName("");
        setLastName("");
        setFullName("");
        setDocumentData({ resume: null, idProof: null });
        setActiveTab(0); 
      } else {
        alert("Failed to Register!");
      }
    } catch (error) {
      console.error("Error register :", error);
    }

    const documentFormData = new FormData();
    documentFormData.append("Photo", documentData.Photo);
    documentFormData.append("idProof", documentData.idProof);

  };

  const getPositions = (department) => {
    switch (department) {
      case "Manager":
        return ["HR Manager", "Project Manager"];
      case "Employee":
        return ["Frontend Developer", "Backend Developer"];
      case "Intern":
        return ["Frontend Intern", "Backend Intern"];
      default:
        return [];
    }
  };

  return (
    <div className="form-container">
      {showSuccessOverlay && (
        <div className="overlay">
          <div className="card success-card">
            <button type="button" className="dismiss" onClick={() => setShowSuccessOverlay(false)}>×</button>
            <div className="header">
              <div className="icon-empolyee-sucess">
                <FaCircleCheck/>
              </div>
              <div className="content">
                <span className="title">Registered Success</span>
                <p className="message">Employee onboarding and Details were sent successfully</p>
                <button className="success-card button">View Employee</button>
              </div>
            </div>
            <div className="footer-card-empolyee">
            </div>
          </div>
        </div>
      )}
      <h1 className="heading-bg">Employee Registration</h1>
      <div className="tabs">
        {["Basic Details", "Address", "Employment", "Documents"].map((tab, index) => (
          <div key={index} className={`tab ${activeTab === index ? "active-addemployee" : ""}`} onClick={() => setActiveTab(index)}>
            <i className={["fas fa-user", "fas fa-map-marker-alt", "fas fa-briefcase", "fas fa-file-alt"][index]}></i> {tab}
          </div>
        ))}
      </div>

      <div className="form-card">
        {activeTab === 0 && (
          <div className="section active-addemployee">
            <div className="input-group">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="First Name" value={firstName} onChange={handleFirstNameChange} required />
            </div>
            <div className="input-group">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="Last Name" value={lastName} onChange={handleLastNameChange} required />
            </div>
            <div className="input-group">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="Full Name" value={fullName} readOnly />
            </div>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input type="email" placeholder="Email" value={formData.basicDetails.email} onChange={(e) => handleInputChange("basicDetails", "email", e.target.value)} required />
            </div>
            <div className="input-group">
              <i className="fas fa-phone"></i>
              <input type="tel" placeholder="Phone Number" value={formData.basicDetails.phone} onChange={(e) => handleInputChange("basicDetails", "phone", e.target.value)} required />
            </div>
            <div className="input-group">
              <i className="fas fa-calendar-alt"></i>
              <DatePicker
                selected={formData.basicDetails.dateOfBirth ? new Date(formData.basicDetails.dateOfBirth) : null}
                onChange={(date) => handleDateChange("basicDetails", "dateOfBirth", date)}
                dateFormat="dd-mm-yyyy"
                placeholderText="Date of Birth"
                required
              />
            </div>
            <div className="input-group">
              <i className="fas fa-venus-mars"></i>
              <select value={formData.basicDetails.gender} onChange={(e) => handleInputChange("basicDetails", "gender", e.target.value)} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div className="section active-addemployee">
            <div className="input-group">
              <i className="fas fa-road"></i>
              <input type="text" placeholder="Street Address" value={formData.address.street} onChange={(e) => handleInputChange("address", "street", e.target.value)} required />
            </div>
            <div className="input-group">
              <i className="fas fa-city"></i>
              <input type="text" placeholder="City" value={formData.address.city} onChange={(e) => handleInputChange("address", "city", e.target.value)} required />
            </div>
            <div className="input-group">
              <i className="fas fa-map"></i>
              <input type="text" placeholder="State" value={formData.address.state} onChange={(e) => handleInputChange("address", "state", e.target.value)} required />
            </div>
            <div className="input-group">
              <i className="fas fa-map-pin"></i>
              <input type="text" placeholder="Zip Code" value={formData.address.zipcode} onChange={(e) => handleInputChange("address", "zipcode", e.target.value)} required />
            </div>
            <div className="input-group">
              <i className="fas fa-globe"></i>
              <select value={formData.address.country} onChange={(e) => handleInputChange("address", "country", e.target.value)} required>
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div className="section active-addemployee">
            <div className="input-group">
              <i className="fas fa-building"></i>
              <select value={formData.employment.company} onChange={(e) => handleInputChange("employment", "company", e.target.value)} required>
                <option value="">Select Company</option>
                <option value="GTS">GTS</option>
              </select>
            </div>
            <div className="input-group">
              <i className="fas fa-user-tie"></i>
              <select value={formData.employment.department} onChange={(e) => handleInputChange("employment", "department", e.target.value)} required>
                <option value="">Select Department</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
                <option value="Intern">Intern</option>
              </select>
            </div>
            <div className="input-group">
              <i className="fas fa-briefcase"></i>
              <select value={formData.employment.position} onChange={(e) => handleInputChange("employment", "position", e.target.value)} required>
                <option value="">Select Position</option>
                {getPositions(formData.employment.department).map((position) => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <i className="fas fa-calendar-alt"></i>
              <DatePicker
                selected={formData.employment.startDate ? new Date(formData.employment.startDate) : null}
                onChange={(date) => handleDateChange("employment", "startDate", date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Start Date"
                required
              />
            </div>
          </div>
        )}

        {activeTab === 3 && (
          <div className="section active-addemployee">
            <div className="input-group">
              <input type="file" onChange={(e) => handleFileChange("documents", "Photo", e.target.files[0])} />
              <i className="fas fa-file-pdf"></i>
              <span style={{fontWeight:"bold"}}>Photo</span>
            </div>
            <div className="input-group">
              <input type="file" onChange={(e) => handleFileChange("documents", "idProof", e.target.files[0])} />
              <i className="fas fa-id-card"></i>
              <span style={{fontWeight:"bold"}}>ID Proof</span>
            </div>
          </div>
        )}
      </div>

      <div className="button-container">
        {activeTab > 0 && (
          <button className="back" onClick={prevStep}>
            <i className="fas fa-arrow-left"></i> Back
          </button>
        )}
        {activeTab < 3 ? (
          <button className="next" onClick={nextStep}>
            Next <i className="fas fa-arrow-right"></i>
          </button>
        ) : (
          <button className="submit" onClick={handleSubmit}>
            <i className="fas fa-paper-plane"></i> Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default AddEmployee;
