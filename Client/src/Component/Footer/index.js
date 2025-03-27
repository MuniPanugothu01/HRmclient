import React from 'react';
import './index.css';
import { FaCopyright } from "react-icons/fa";
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
    const { slide } = useTheme();

    return (
        <footer className={slide === "false" ? "footer" : "footer1"}>
            <div className="footer-container">
                <div className="footer-left">
                    <p>Copyright <FaCopyright /> 2025 GTS. All Rights Reserved.</p>
                </div>
                <div className="footer-right">
                    <a href="/privacy-policy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                    <a href="/contact">Contact Us</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
