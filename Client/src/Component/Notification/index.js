import React from "react";
import "./index.css";

const Notification = () => {
  const notifications = [
    { id: 1, type: "success", message: "Operation Successful!" },
    { id: 2, type: "error", message: "Something went wrong!" },
    { id: 3, type: "info", message: "Here is some information!" },
    { id: 4, type: "warning", message: "This is a warning!" },
  ];

  return (
    <div className="notification-container">
      <h1>Notifications</h1>
      <div className="notifications">
        {notifications.map((notification) => (
          <div key={notification.id} className={`notification ${notification.type}`}>
            <p>{notification.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
