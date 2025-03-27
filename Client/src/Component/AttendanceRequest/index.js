import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from "../../context/ThemeContext";
import "./index.css";
import Cookies from "js-cookie";

const AttendanceRequest = () => {
  const [availableDates, setAvailableDates] = useState([]); 
  const [selectedDate, setSelectedDate] = useState(""); 
  const [error, setError] = useState(null);
  const { slide } = useTheme();

  // Fetch Available Dates from API
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) throw new Error("Authentication token is missing.");

        const response = await fetch("http://localhost:5000/request", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch attendance data");

        const data = await response.json();

        if (!data || !Array.isArray(data.attendancerquest)) {
          throw new Error("Invalid response format");
        }

        const dates = data.attendancerquest
          .filter((item) => item.Logstatus === "No" && item.Logdate)
          .map((item) => {
            const [day, month, year] = item.Logdate.split("/").map(Number);
            return new Date(year, month - 1, day, 12, 0, 0, 0); // ✅ Set time to noon to avoid timezone issues
          });

        setAvailableDates(dates);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAttendanceData();
  }, []);

  // Handle Date Selection
  const handleDateChange = (date) => {
    if (isDateAvailable(date)) {
      const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0); // ✅ Ensure time is noon
      setSelectedDate(localDate.toISOString().split("T")[0]); // Store in YYYY-MM-DD format
    } else {
      setSelectedDate("");
    }
  };

  // Check if the selected date is available
  const isDateAvailable = (date) => {
    return availableDates.some(
      (availableDate) => availableDate instanceof Date && availableDate.toDateString() === date.toDateString()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");

      if (!token) throw new Error("Authentication token is missing.");

      const response = await fetch("http://localhost:5000/request", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: selectedDate, reason: e.target.reason.value }),
      });

      if (!response.ok) throw new Error("Failed to submit attendance request");

      alert("Attendance request submitted successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={slide === "false" ? "attendancereq-container" : "attendancereq-container1"}>
      <h1 className="heading-bg-req">Attendance Request</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="date-picker">Select a Date</label>
        <DatePicker
          id="date-picker"
          selected={selectedDate ? new Date(selectedDate) : null}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          className="form-input"
          placeholderText="Select a date"
          filterDate={isDateAvailable} // Disable unavailable dates
        />

        <label htmlFor="reason">Reason/Description</label>
        <textarea id="reason" placeholder="Enter the reason or description here..." className="form-input"></textarea>

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default AttendanceRequest;
