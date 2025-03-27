import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FaUser, FaEnvelope, FaBriefcase, FaCalendarAlt, FaMapMarkerAlt, FaUserEdit, FaBuilding, FaClipboard, FaCheckCircle, FaTimesCircle, FaBan, FaPauseCircle, FaSignOutAlt } from 'react-icons/fa';
import './EmployeeOverview.css';
import { FaAlignLeft, FaArrowLeft, FaBolt, FaChartLine, FaCircleCheck, FaClosedCaptioning, FaFile, FaMoneyBill, FaTimes, FaXmark } from 'react-icons/fa6';

const EmployeeOverview = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [activeTab, setActiveTab] = useState('basic');
    const navigate = useNavigate();
    const [status, setStatus] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showEndDate, setShowEndDate] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    const handleStatusChange = (e) => {
        const selectedStatus = e.target.value;
        setStatus(selectedStatus);
        setShowEndDate(selectedStatus === 'Resigned' || selectedStatus === 'On Hold' || selectedStatus === 'Suspended');
    };

    const handleUpdateStatus = async () => {
        const token = Cookies.get('token');
        const response = await fetch(`http://localhost:5000/employee-status/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status, Enddate: endDate })
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.message);
            setShowOverlay(false);
        } else {
            console.error('Error updating status:', response.status);
        }
    };

    const handleActionClick = () => {
        setShowOverlay(true);
    };

    const handleCloseOverlay = () => {
        setShowOverlay(false);
    };

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const token = Cookies.get('token');
                const response = await fetch(`http://localhost:5000/employee/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setEmployee(data.data);
                } else {
                    console.error('Error fetching employee:', response.status);
                }
            } catch (error) {
                console.error('Error fetching employee:', error);
            }
        };

        fetchEmployee();
    }, [id]);

    return (
        <div className="employee-overview-container">
            {employee && (
                <div className="profile-card">
                    <div>
                        <button className="action-button-back" onClick={() => navigate('/manageemployee')}><FaArrowLeft/> Back</button>
                    </div>
                    <div className="profile-avatar">
                        <FaUser className="profile-icon" />
                    </div>
                    <h3 className="profile-name">
                        {employee.FullName} 
                        <span className='active-icon'>
                             {employee.status === "Active" &&  <FaCheckCircle style={{ color: "green" }} />}
                             {employee.status === "Suspended" &&  <FaBan style={{ color: "orange" }} />}
                             {employee.status === "On Hold" &&  <FaPauseCircle style={{ color: "blue" }} />}
                             {employee.status === "Resigned" &&  <FaSignOutAlt style={{ color: "red" }} />}
                        </span>
                    </h3>
                    <p className="profile-email"><FaEnvelope /> {employee.WorkEmail}</p>
                    <p className="profile-role"><FaBriefcase /> {employee.Role}</p>
                    <p className="profile-company"><FaCalendarAlt /> {employee.Company}</p>
                    <p className="profile-location"><FaMapMarkerAlt /> {employee.City}, {employee.State}</p>
                    <div className="button-container">
                        <button className="action-button edit-button" onClick={handleActionClick}><FaBolt /> Action</button>
                        <button className="action-button edit-button" onClick={() => navigate(`/employee/edit/${id}`)}><FaUserEdit /> Edit</button>
                    </div>
                    {showOverlay && (
                        <div className="overlay">
                            <div className="overlay-content">
                                <FaXmark className="close-icon" onClick={handleCloseOverlay} />
                                <select value={status} onChange={handleStatusChange}>
                                    <option value="">Select Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Suspended">Suspended</option>
                                    <option value="On Hold">On Hold</option>
                                    <option value="Resigned">Resigned</option>
                                </select>
                                {showEndDate && (
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        placeholder="End Date"
                                    />
                                )}
                                <button onClick={handleUpdateStatus}>Update Status</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="tabs-container">
                <div className="tab-buttons">
                    <button className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}><FaUser/> Basic Details</button>
                    <button className={`tab-button ${activeTab === 'address' ? 'active' : ''}`} onClick={() => setActiveTab('address')}><FaBuilding/> Address</button>
                    <button className={`tab-button ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}><FaClipboard/> Attendance</button>
                    <button className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}><FaFile/> Documents</button>
                    <button className={`tab-button ${activeTab === 'salary' ? 'active' : ''}`} onClick={() => setActiveTab('salary')}><FaMoneyBill/> Salary</button>
                    <button className={`tab-button ${activeTab === 'performance' ? 'active' : ''}`} onClick={() => setActiveTab('performance')}><FaChartLine/> Performance</button>
                </div>

                <div className="tab-content">
                    {activeTab === 'basic' && employee && (
                        <div className="details-card">
                            <p><strong>Employee ID:</strong> {employee.EmployeeID}</p>
                            <p><strong>Designation:</strong> {employee.designation}</p>
                            <p><strong>Date of Birth:</strong> {employee.DateOfBirth}</p>
                            <p><strong>Start Date:</strong> {employee.startdate}</p>
                            <p><strong>Status:</strong>
                                <p className={
                                    employee.status === "Active" ? "active-status" :
                                    employee.status === "Suspended" ? "suspended-status" :
                                    employee.status === "On Hold" ? "onhold-status" :
                                    employee.status === "Resigned" ? "resigned-status" : ""
                                }>
                                    {employee.status === "Active" ? (
                                        <>
                                            <FaCheckCircle style={{ color: "green", marginRight: "5px" }} />
                                            Active
                                        </>
                                    ) : employee.status === "Suspended" ? (
                                        <>
                                            <FaBan style={{ color: "orange", marginRight: "5px" }} />
                                            Suspended
                                        </>
                                    ) : employee.status === "On Hold" ? (
                                        <>
                                            <FaPauseCircle style={{ color: "blue", marginRight: "5px" }} />
                                            On Hold
                                        </>
                                    ) : employee.status === "Resigned" ? (
                                        <>
                                            <FaSignOutAlt style={{ color: "red", marginRight: "5px" }} />
                                            Resigned
                                        </>
                                    ) : null}
                                </p>
                            </p>
                        </div>
                    )}

                    {activeTab === 'address' && employee && (
                        <div className="details-card">
                            <p><strong>Address:</strong> {employee.Address}</p>
                            <p><strong>City:</strong> {employee.City}</p>
                            <p><strong>State:</strong> {employee.State}</p>
                            <p><strong>Country:</strong> {employee.Country}</p>
                            <p><strong>Postal Code:</strong> {employee.PinCode}</p>
                        </div>
                    )}

                    {activeTab === 'attendance' && (
                        <div className="details-card">
                            <p><strong>Date:</strong> 2024-02-28</p>
                            <p><strong>Log Time:</strong> 09:00 AM</p>
                            <p><strong>Effective Hours:</strong> 9 Hours</p>
                            <p><strong>Status:</strong> Present</p>
                            <p><strong>Last log:</strong> 11:30 PM</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeOverview;
