// import React, { useEffect } from 'react';
// import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
// import { Link, useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import { FaBell, FaEnvelope, FaCalendar, FaHome, FaCog, FaTachometerAlt } from 'react-icons/fa';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUserTie } from '@fortawesome/free-solid-svg-icons';
// import { FaPowerOff } from 'react-icons/fa6';
// import {jwtDecode} from 'jwt-decode'; // Corrected import
// import './Navbar.css';

// const NavbarComponent = ({ isSidebarExpanded, isFullWidth }) => {
//     const navigate = useNavigate();
//     const username = Cookies.get('fullname');
//     const token = Cookies.get('token');
//     let userRole;

//     if (token) {
//         try {
//             const decodedToken = jwtDecode(token);
//             userRole = decodedToken.role;
//         } catch (error) {
//             console.error('Error decoding token:', error);
//         }
//     }

//     useEffect(() => {
//         if (!token) {
//             Cookies.remove('username');
//             Cookies.remove('token');
//             navigate('/');
//         }
//     }, [token, navigate]);

//     const handleLogout = async () => {
//         fetch('http://localhost:5000/logout', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             }
//         }).catch(error => console.error('Error during logout:', error));

//         Cookies.remove('token');
//         Cookies.remove('username');
//         Cookies.remove('designation');
//         navigate('/');
//     };

//     const handleProfile = () => {
//         navigate('/profile');
//     };

//     return (
//         <Navbar variant="light" expand="lg" className={`nv ${isFullWidth ? 'fullWidth' : isSidebarExpanded ? 'expanded' : 'collapsed'} sticky-top`}> {/* Added sticky-top class */}
//             <Container fluid className="d-flex justify-content-between align-items-center">
//                 <Nav className="d-flex align-items-center">
//                     <Nav.Link href="#" className="nav-bell"><FaBell size={20} /></Nav.Link>
//                     <Nav.Link as={Link} to="/email" className="nav-envelope"><FaEnvelope size={20} /></Nav.Link>
//                 </Nav>

//                 <Nav className="d-flex justify-content-center flex-grow-1">
//                     <form className="d-flex w-75">
//                         <input
//                             className="form-control"
//                             type="search"
//                             placeholder="Search"
//                             aria-label="Search"
//                         />
//                     </form>
//                 </Nav>

//                 <Nav className="d-flex align-items-center">
//                     <Nav.Link className="name">{username || 'User'}</Nav.Link>
//                     <Nav.Link as={Link} to="/calendar" className="nav-calendar"><FaCalendar size={20} /></Nav.Link>
//                     {userRole === 'Admin' ? (
//                         <Nav.Link as={Link} to="/dashboard" className="nav-dashboard"><FaTachometerAlt size={20} /></Nav.Link>
//                     ) : (
//                         <Nav.Link as={Link} to="/home" className="nav-home"><FaHome size={20} /></Nav.Link>
//                     )}
//                     <Dropdown align="end">
//                         <Dropdown.Toggle variant="light" id="dropdown-basic" className="dropdown-toggle-sidebar">
//                             <FontAwesomeIcon icon={faUserTie} className="nav-user" />
//                         </Dropdown.Toggle>

//                         <Dropdown.Menu className="dropdown-menu-custom">
//                             <div className="dropdown-border"></div>
//                             <Dropdown.Item className="dropdown-item-custom" onClick={handleProfile}>
//                                 <FaCog className="icon-navdrop"  /><span className='item'>My Profile</span>
//                             </Dropdown.Item>
//                             <Dropdown.Item className="dropdown-item-custom" onClick={handleLogout}>
//                                 <FaPowerOff className="icon-navdrop" /> Logout
//                             </Dropdown.Item>
//                         </Dropdown.Menu>
//                     </Dropdown>
//                 </Nav>
//             </Container>
//         </Navbar>
//     );
// };

// export default NavbarComponent;

import React, { useEffect, useState } from "react";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  FaBell,
  FaEnvelope,
  FaCalendar,
  FaHome,
  FaCog,
  FaTachometerAlt,
  FaPowerOff,
} from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import "./Navbar.css";

const NavbarComponent = ({ isSidebarExpanded, isFullWidth }) => {
  const navigate = useNavigate();
  const username = Cookies.get("fullname");
  const token = Cookies.get("token");
  let userRole;

  const [searchTerm, setSearchTerm] = useState("");
  const [features] = useState([
    "Dashboard",
    "Profile",
    "Settings",
    "Messages",
    "Add Event",
    "calendar",
    "home",
    "Logout",
  ]);

  const filteredFeatures = features.filter((feature) =>
    feature.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFeatureClick = (feature) => {
    setSearchTerm("");
    if (feature === "Logout") handleLogout();
    else if (feature === "Profile") handleProfile();
    else if (feature === "Dashboard") navigate("/dashboard");
    else if (feature === "home") navigate("../Home/index.js");
    else if (feature === "calendar") navigate("/calendar");
    else if (faEraser === "Add Event") navigate("/Add Event");
  };

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.role;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  useEffect(() => {
    if (!token) {
      Cookies.remove("username");
      Cookies.remove("token");
      navigate("/");
    }
  }, [token, navigate]);

  const handleLogout = async () => {
    fetch("http://localhost:5000/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).catch((error) => console.error("Error during logout:", error));

    Cookies.remove("token");
    Cookies.remove("username");
    Cookies.remove("designation");
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <Navbar
      variant="light"
      expand="lg"
      className={`nv ${
        isFullWidth ? "fullWidth" : isSidebarExpanded ? "expanded" : "collapsed"
      } sticky-top`}
    >
      <Container
        fluid
        className="d-flex justify-content-between align-items-center"
      >
        <Nav className="d-flex align-items-center">
          <Nav.Link href="#" className="nav-bell">
            <FaBell size={20} />
          </Nav.Link>
          <Nav.Link as={Link} to="/email" className="nav-envelope">
            <FaEnvelope size={20} />
          </Nav.Link>
        </Nav>

        <Nav className="d-flex justify-content-center flex-grow-1">
          <form className="d-flex w-75 position-relative">
            <input
              className="form-control"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <div className="search-suggestions position-absolute w-100 mt-1 bg-white border rounded">
                {filteredFeatures.length > 0 ? (
                  filteredFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 search-item"
                      onClick={() => handleFeatureClick(feature)}
                      style={{ cursor: "pointer" }}
                    >
                      {feature}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-muted">
                    No matching features
                  </div>
                )}
              </div>
            )}
          </form>
        </Nav>

        <Nav className="d-flex align-items-center">
          <Nav.Link className="name">{username || "User"}</Nav.Link>
          <Nav.Link
            as={Link}
            to="/Attendance Requests"
            className="nav-calendar"
          >
            <FaCalendar size={20} />
          </Nav.Link>
          {userRole === "Admin" ? (
            <Nav.Link as={Link} to="/dashboard" className="nav-dashboard">
              <FaTachometerAlt size={20} />
            </Nav.Link>
          ) : (
            <Nav.Link as={Link} to="/home" className="nav-home">
              <FaHome size={20} />
            </Nav.Link>
          )}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="light"
              id="dropdown-basic"
              className="dropdown-toggle-sidebar"
            >
              <FontAwesomeIcon icon={faUserTie} className="nav-user" />
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu-custom">
              <div className="dropdown-border"></div>
              <Dropdown.Item
                className="dropdown-item-custom"
                onClick={handleProfile}
              >
                <FaCog className="icon-navdrop" />
                <span className="item">My Profile</span>
              </Dropdown.Item>
              <Dropdown.Item
                className="dropdown-item-custom"
                onClick={handleLogout}
              >
                <FaPowerOff className="icon-navdrop" /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
