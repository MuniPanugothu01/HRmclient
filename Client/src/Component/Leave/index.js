import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from '../../context/ThemeContext';
import {FaBan, FaCalendar, FaCircleCheck, FaClock} from 'react-icons/fa6';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "js-cookie";
import "./index.css";

const LeaveForm = () => {
  const [FromDate, setFromDate] = useState(null);
  const [ToDate, setToDate] = useState(null);
  const [FromTime, setFromTime] = useState("");
  const [ToTime, setToTime] = useState("");
  const [LeaveType, setLeaveType] = useState("");
  const [Reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const { slide } = useTheme();
  const location = useLocation();

  const leaveDropdownsOption = () => {
    switch (location.pathname) {
      case "/casualleave":
        return ["Casual Leave"];
      case "/paidleave":
        return ["Paid Leave"];
      case "/unpaidleave":
        return ["Unpaid Leave"];
      default:
        return ["No leave option with this path"];
    }
  };

  const options = leaveDropdownsOption();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date();
    const selectedDate = new Date(FromDate);
    const difference = Math.ceil(
      (selectedDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );

    if (difference < 10) {
      setError("You can apply for leave only 10 days in advance.");
      return;
    }

    const leaveDetails = {
      FromDate: FromDate ? FromDate.toISOString().split('T')[0] : null,
      ToDate: ToDate ? ToDate.toISOString().split('T')[0] : null,
      FromTime,
      ToTime,
      LeaveType,
      Reason,
    };
    const leaveDetailsString = JSON.stringify(leaveDetails, null, 2);
    const url = "http://localhost:5000/apply";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Cookies.get("token"),
      },
      body: leaveDetailsString,
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
        return;
      }

      setShowSuccess(true);
      setError("");
      setFromDate(null);
      setToDate(null);
      setFromTime("");
      setToTime("");
      setLeaveType("");
      setReason("");
    } catch (error) {
      setError("Failed to apply for leave. Please try again later.");
    }
  };

  return (
    <div className={slide === "false" ? "leave-form-container tll" : "leave-form-container1 tll"}>
      <h2 className="heading-bg-leaves">Apply for Leave</h2>
      {showSuccess && (
        <div className="overlay" style={{ display: 'block' }}>
          <div className="card-success-leave" style={{ display: 'block' }}>
          <div className="card-border">
            <FaCircleCheck size={30} className="card-success-leave-icon"/>
            <h1>Leave Applied Successfully</h1>
            <p>Your leave request has been successfully submitted.You will be notified once your leave request has been reviewed and approved.</p>
            <button className="button-card-leave" onClick={() => setShowSuccess(false)}>Close</button>
          </div>
          </div>
        </div>
      )}
      {error && (
        <div className="overlay" style={{ display: 'block' }}>
          <div className="card-success-leave" style={{ display: 'block' }}>
            <div className="card-border">
            <FaBan size={30} className="card-success-leave-conflict"/>
            <h1>Leave Request Conflict</h1>
            <p className="error-message">{error}</p>
            <button className="button-card-leave" onClick={() => setError("")}>Close</button>
          </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="date-time-container">
          <div className="date-time-column">
            <label htmlFor="from-date" className="form-label">From Date</label>
            <div className="input-group">
              <FaCalendar className="input-icon"/>
              <DatePicker
                id="from-date"
                selected={FromDate}
                onChange={(date) => setFromDate(date)}
                minDate={new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)}
                dateFormat="dd/MM/yyyy"
                required
                placeholderText="Select From Date"
              />
            </div>
          </div>
          <div className="date-time-column">
            <label htmlFor="to-date" className="form-label">To Date</label>
            <div className="input-group">
              <FaCalendar className="input-icon"/>
              <DatePicker
                id="to-date"
                selected={ToDate}
                onChange={(date) => setToDate(date)}
                minDate={FromDate || undefined}
                dateFormat="dd/MM/yyyy"
                required
                placeholderText="Select To Date"
              />
            </div>
          </div>
        </div>

        <div className="date-time-container">
          <div className="date-time-column">
            <label htmlFor="from-time" className="form-label">From Time</label>
            <div className="input-group">
              <input
                id="from-time"
                type="time"
                value={FromTime}
                onChange={(e) => setFromTime(e.target.value)}
                required
                placeholder="Select From Time"
              />
            </div>
          </div>
          <div className="date-time-column">
            <label htmlFor="to-time" className="form-label">To Time</label>
            <div className="input-group">
              <input
                id="to-time"
                type="time"
                value={ToTime}
                onChange={(e) => setToTime(e.target.value)}
                required
                placeholder="Select To Time"
              />
            </div>
          </div>
        </div>

        <label className="form-label">Leave Type</label>
        <div className="radio-group">
          {options.map((option, index) => (
            <label key={index} className="radio-label">
              <input
                type="radio"
                value={option}
                checked={LeaveType === option}
                onChange={(e) => setLeaveType(e.target.value)}
                required
              />
              {option}
            </label>
          ))}
        </div>

        <label htmlFor="reason" className="form-label">Reason</label>
        <textarea
          id="reason"
          value={Reason}
          onChange={(e) => setReason(e.target.value)}
          required
          className="form-input"
          placeholder="Enter Reason"
        />

        <div className="button-container">
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </div>
        <div className="bg-note">
          <p className="note-line">
            <span className="note-line-span">NOTE:</span> Leave Can be Applied 10 Days in Advance
          </p>
        </div>
      </form>
    </div>
  );
};

export default LeaveForm;