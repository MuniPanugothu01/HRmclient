import {FaCheckCircle,FaPlus, FaUser,FaSignOutAlt,FaPauseCircle } from "react-icons/fa";
import { Nav } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CountUp from "react-countup";
import "./ListEmployee.css";
import { FaBan, FaCircleInfo } from "react-icons/fa6";

const ListEmployee = () => {
    const [tableData, setTableData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("");
    const [filterDesignation, setFilterDesignation] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = Cookies.get("token");
                const response = await fetch("http://localhost:5000/listemployee", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setTableData(data.data || []);
                } else {
                    console.error("Error fetching data:", response.status);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const addEmployee = () => {
        navigate("/addemployee");
    };

    const viewEmployee = (employeeID) => {
        navigate(`/overviewemployee/${employeeID}`);
    };

    const totalEmployees = tableData.length;
    const activeEmployees = tableData.filter(emp => emp.status === "Active").length;
    const inactiveEmployees = totalEmployees - activeEmployees;

    const filteredData = tableData.filter(
        (employee) =>
            employee.FullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterRole === "" || employee.Role === filterRole) &&
            (filterDesignation === "" || employee.designation === filterDesignation)
    );

    return (
        <div className="container-list-employee">
            <div>
                <h1 className="heading-bg-records">Employee Records</h1>
            </div>
            <div className="employee-stats">
                <div className="stat-box">
                    <h4>Total Employees</h4>
                    <p>
                        <CountUp start={0} end={totalEmployees} duration={2} separator="," />
                    </p>
                </div>
                <div className="stat-box active-stats">
                    <h4 style={{ color: "#313131" }}>Active Employees</h4>
                    <p>
                        <CountUp start={0} end={activeEmployees} duration={2} separator="," />
                    </p>
                </div>
                <div className="stat-box inactive">
                    <h4 style={{ color: "#313131" }}>Inactive Employees</h4>
                    <p>
                        <CountUp start={0} end={inactiveEmployees} duration={2} separator="," />
                    </p>
                </div>
            </div>

            <div className="header d-flex align-items-center justify-content-between">
                <Nav className="flex-grow-1">
                    <div className="search-bar-container">
                        <select className="role-filter" onChange={(e) => setFilterRole(e.target.value)}>
                            <option value="">All</option>
                            <option value="Admin">Admin</option>
                            <option value="Employee">Employee</option>
                            <option value="Project Manager">Project Manager</option>
                        </select>
                        <input
                            className="form-control search-bar"
                            type="search"
                            placeholder="Search Employee"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </Nav>
                <div className="header-buttons">
                    <button className="add-button" onClick={addEmployee}>
                        <FaPlus /> Add Employee
                    </button>
                </div>
            </div>

            <table className="styled-table">
                <thead>
                    <tr>
                        <th>EmployeeID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Designation</th>
                        <th>Status</th>
                        <th>More</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((row, index) => (
                        <tr key={index}>
                            <td>{row.EmployeeID}</td>
                            <td>
                                <div className="user-container">
                                    <div className="user-icon">
                                        <FaUser className="fa-user-icon" />
                                    </div>
                                    <span className="user-name">{row.FullName}</span>
                                </div>
                            </td>
                            <td>{row.WorkEmail}</td>
                            <td>{row.Role}</td>
                            <td>{row.designation}</td>
                            <td className={
                                row.status === "Active" ? "active-status" :
                                row.status === "Suspended" ? "suspended-status" :
                                row.status === "On Hold" ? "onhold-status" :
                                row.status === "Resigned" ? "resigned-status" : ""
                            }>
                                {row.status === "Active" ? (
                                    <>
                                        <FaCheckCircle style={{ color: "green", marginRight: "5px" }} />
                                        Active
                                    </>
                                ) : row.status === "Suspended" ? (
                                    <>
                                        <FaBan style={{ color: "orange", marginRight: "5px" }} />
                                        Suspended
                                    </>
                                ) : row.status === "On Hold" ? (
                                    <>
                                        <FaPauseCircle style={{ color: "blue", marginRight: "5px" }} />
                                        On Hold
                                    </>
                                ) : row.status === "Resigned" ? (
                                    <>
                                        <FaSignOutAlt style={{ color: "red", marginRight: "5px" }} />
                                        Resigned
                                    </>
                                ) : null}
                            </td>
                            <td>
                                <FaCircleInfo className="info-icon" onClick={() => viewEmployee(row.EmployeeID)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListEmployee;
