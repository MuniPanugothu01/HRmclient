import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import CountUp from 'react-countup';
import './index.css';

const Home = () => {
    const { slide } = useTheme();
    const [currentDateTime, setCurrentDateTime] = useState("");
    const currentDayIndex = new Date().getDay();
    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
    const totalDuration = 9;
    const passedDuration = 8;
    const progressPercentage = (passedDuration / totalDuration) * 100;

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const day = now.getDate();
            const month = now.toLocaleString("default", { month: "long" });
            const year = now.getFullYear();
            const weekday = now.toLocaleString("default", { weekday: "long" });
            const time = now.toLocaleString("default", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
            setCurrentDateTime(`${day}/${month}/${year}, ${weekday}, Time: ${time}`);
        };
        updateDateTime();
        const intervalId = setInterval(updateDateTime, 60000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={slide === "false"  ? "home-con" : "m-l"}>
            <p className="home-container-p">
                <span className="span-p">Date:</span> {currentDateTime}
            </p>

            <div className="con">
                <div className="box">
                    <h5 className="tl">Payroll</h5>
                    <p className="ds"><CountUp end={23} duration={2} /> Calendar days</p>
                </div>
                <hr className='hr11'/>
                <div className="box">
                    <h5 className="tl">Total Leaves</h5>
                    <p className="ds"><CountUp end={1} duration={2} /></p>
                </div>
                <hr className='hr11'/>
                <div className="box">
                    <h5 className="tl">Working Days</h5>
                    <p className="ds"><CountUp end={22} duration={2} /></p>
                </div>
                <hr className='hr11'/>
                <div className="box">
                    <h5 className="tl">Payroll Processed</h5>
                    <p className="ds"><CountUp end={23} duration={2} /> days</p>
                </div>
            </div>

            <div className='con1'>
                <div className="timing-details">
                    <div className="timing-details-header">
                        <h6 className='tl'>Timing Details</h6>
                        <div className="spp">
                            {daysOfWeek.map((day, index) => (
                                <span key={index} className={`day ${index === currentDayIndex ? 'highlighted' : ''}`}>
                                    {day}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="timing-details-body">Yesterday (9:00 AM - 6:00 PM)</div>
                    <div className="timing-details-divider">
                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>
                    <div className="timing-details-body">Duration: {totalDuration} HRS</div>
                </div>

                <div className="container-attendance-detalis">
                    <h3 className="tl">Attendance Details</h3>
                    <div className="section">
                        <div className="row">
                            <span className="label">👤 Me:</span>
                            <span className='sp1'><CountUp end={8} duration={2} />:00 hrs (AVG HRS/DAY)</span>
                        </div>
                        <div className="row">
                            <span></span>
                            <span className='sp1'><CountUp end={8} duration={2} />:00 hrs (ON TIME ARRIVAL)</span>
                        </div>
                    </div>
                    <hr className="divider" />
                    <div className="section">
                        <div className="row">
                            <span className="label">👥 My Team:</span>
                            <span className='sp1'><CountUp end={8} duration={2} />:00 hrs (AVG HRS/DAY)</span>
                        </div>
                        <div className="row">
                            <span></span>
                            <span className='sp1'><CountUp end={8} duration={2} />:00 hrs (ON TIME ARRIVAL)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
