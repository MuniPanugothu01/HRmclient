import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext"; // ✅ Import ThemeProvider
import CalendarComponent from "./Component/Calendar";
import AttendancePage from "./Component/Attendance";
import LeaveForm from "./Component/Leave";
import Sidebar from "./Component/Sidebar";
import Home from "./Component/Home";
import LoginForm from "./Component/LoginForm";
import RegisterForm from "./Component/RegisterForm";
import Footer from "./Component/Footer";
import ForgotPassword from "./Component/ForgotPassword";
import Notification from "./Component/Notification";
import AttendanceRequest from "./Component/AttendanceRequest";
import ProtectedRoute from "./Component/ProtectedRoute";
import EmployeePage from "./Component/Empolyeedetalis";
import Dashboard from "./Component/Dashboard";
import ListEmployee from "./Component/EmployeeMangement/ListEmployee";
import AddEmployee from "./Component/EmployeeMangement/AddEmployee";
import EmployeeOverview from "./Component/EmployeeMangement/EmployeeOverview";
import AdminAttendenceReqp from "./Component/AttendanceMangement/Attendancerequests";
import EmployeeEdit from "./Component/EmployeeMangement/EmployeeEdit";
import Emailservice from "./Component/Emali/inboxindex"
import NavbarComponent from "./Component/Navbar";
import './App.css'
const App = () => {
    return (
            <ThemeProvider> {/* ✅ Wrap inside ThemeProvider */}
                <Router>
                    <div>
                        <Routes>
                            <Route path="/" element={<LoginForm />} />
                            <Route path="/register" element={<RegisterForm />} />
                            <Route path="/forgotpassword" element={<ForgotPassword />} />
                            <Route path="/home" element={<ProtectedRoute roles="Employee"><Sidebar /><NavbarComponent/><Home /></ProtectedRoute>} />
                            <Route path="/calendar" element={<ProtectedRoute roles={['Employee','Admin']}><Sidebar/><NavbarComponent/> <CalendarComponent /></ProtectedRoute>} />
                            <Route path="/paidleave" element={<ProtectedRoute roles="Employee"><Sidebar /><NavbarComponent/> <LeaveForm /></ProtectedRoute>} />
                            <Route path="/unpaidleave" element={<ProtectedRoute roles="Employee"><Sidebar /><NavbarComponent/>  <LeaveForm /></ProtectedRoute>} />
                            <Route path="/casualleave" element={<ProtectedRoute roles="Employee"><Sidebar /><NavbarComponent/>  <LeaveForm /></ProtectedRoute>} />
                            <Route path="/attendancelogs" element={<ProtectedRoute roles="Employee"><Sidebar /><NavbarComponent/>  <AttendancePage /></ProtectedRoute>} />
                            <Route path="/notification" element={<ProtectedRoute roles="Employee"><Sidebar /> <NavbarComponent/> <Notification /></ProtectedRoute>} />
                            <Route path="/attendancerequest" element={<ProtectedRoute roles="Employee"><Sidebar /> <NavbarComponent/> <AttendanceRequest /></ProtectedRoute>} />
                            <Route path="/email" element={<ProtectedRoute roles={['Employee',"Admin"]}><Sidebar /><NavbarComponent/>  <Emailservice /></ProtectedRoute>} />
                            <Route path="/profile" element={<ProtectedRoute roles={["Employee","Admin"]}><EmployeePage /></ProtectedRoute>} />
                            <Route path="/dashboard" element={<ProtectedRoute roles="Admin"><Sidebar /><NavbarComponent/> <Dashboard /></ProtectedRoute>} />
                            <Route path="/manageemployee" element={<ProtectedRoute roles="Admin"><Sidebar /><NavbarComponent/>  <ListEmployee /></ProtectedRoute>} />
                            <Route path="/addemployee" element={<ProtectedRoute roles="Admin"><Sidebar /><NavbarComponent/>  <AddEmployee /></ProtectedRoute>} />
                            <Route path="/overviewemployee/:id" element={<ProtectedRoute roles="Admin"><Sidebar /> <NavbarComponent/> <EmployeeOverview /></ProtectedRoute>} />
                            <Route path="/employeeattendancerequest" element={<ProtectedRoute role="Admin"><Sidebar /> <NavbarComponent/> <AdminAttendenceReqp /></ProtectedRoute>} />
                            <Route path="/employee/edit/:id" element={<ProtectedRoute roles="Admin"><Sidebar/><NavbarComponent/><EmployeeEdit/></ProtectedRoute>} />
                            </Routes>
                        <Footer />
                    </div>
                </Router>
            </ThemeProvider>
    );
};

export default App;
