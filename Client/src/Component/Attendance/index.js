import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import './index.css';

const AttendancePage = () => {
  const [data, setData] = useState([]);
  const { slide } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];

        if (!token) {
          alert('Unauthorized user! Please log in.');
          return;
        }

        const response = await fetch('http://localhost:5000/logs', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch attendance data');
        }

        const responseData = await response.json();
        
        const formattedData = (responseData.attendanceLogStatus || []).map(entry => ({
          date: entry.Logdate,
          time: entry.LogTime,
          leave: entry.LeaveStatus,
          effectiveHours: entry.EffectiveHours,
          grossHours: entry.GrossHours,
          arrival: entry.ArrivalStatus,
          log: entry.Logstatus
        }));

        setData(formattedData);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    fetchAttendanceData();
  }, []);

  return (
    <div>
      <div className="info-box"></div>

      <div className={slide == "true" ? 'attendance-con' : 'attendance-container'}>
        <h1 className="info-title">Log & Activities</h1>

        <div className="button-container-right">
          <button className="info-heading" onClick={() => navigate('/AttendanceRequest')}>Attendance Requests</button>
        </div>

        <div className="attendance-table-wrapper">
          <div className="table-container">
            <table className="styled-table">
              <thead className="">
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Leave</th>
                  <th>Effective Hours</th>
                  <th>Gross Hours</th>
                  <th>Arrival</th>
                  <th>Log</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.date}</td>
                      <td>{entry.time}</td>
                      <td>{entry.leave}</td>
                      <td>{entry.effectiveHours}</td>
                      <td>{entry.grossHours}</td>
                      <td>{entry.arrival}</td>
                      <td>
                        {entry.log === 'Yes' ? (
                          <FaCheckCircle style={{ color: 'green' }} />
                        ) : entry.log === 'No' ? (
                          <FaTimesCircle style={{ color: 'red' }} />
                        ) : (
                          entry.log 
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No attendance data available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
