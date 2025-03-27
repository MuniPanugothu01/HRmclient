import React, { useState, useMemo } from 'react';
import './Attendancerequests.css';
import CountUp from "react-countup";
import { FaUser } from 'react-icons/fa6';

const initialDeals = [
  { id: 'EMP001', name: 'John Smith', reason: 'Frontend Development', date: '22 Dec 2022', status: 'Late', reject: false },
  { id: 'EMP002', name: 'Sarah Johnson', reason: 'Backend Development', date: '21 Dec 2022', status: 'Late', reject: false },
  { id: 'EMP003', name: 'Mike Wilson', reason: 'UI/UX Design', date: '18 Dec 2022', status: 'Late', reject: false },
  { id: 'EMP004', name: 'Emily Brown', reason: 'DevOps Engineering', date: '14 Dec 2022', status: 'Late', reject: false },
  { id: 'EMP007', name: 'James Wilson',reason: 'Quality Assurance', date: '11 Dec 2022', status: 'Late', reject: false },
  { id: 'EMP008', name: 'Maria Garcia', reason: 'Mobile Development', date: '10 Dec 2022', status: 'Late', reject: false }
];

function AdminAttendenceReqp() {
  const [deals, setDeals] = useState(initialDeals);
  const [sortConfig, setSortConfig] = useState(null);
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [popup, setPopup] = useState({ visible: false, id: null });

  const sortedDeals = useMemo(() => {
    if (!sortConfig) return deals;
    return [...deals].sort((a, b) =>
      a[sortConfig.key] < b[sortConfig.key]
        ? sortConfig.direction === 'asc' ? -1 : 1
        : a[sortConfig.key] > b[sortConfig.key]
        ? sortConfig.direction === 'asc' ? 1 : -1
        : 0
    );
  }, [deals, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((currentSort) =>
      currentSort?.key === key
        ? { key, direction: currentSort.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  };

  const handleCheckboxChange = (id) => {
    setSelectedDeals((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((dealId) => dealId !== id)
        : [...prevSelected, id]
    );
  };

  const handlePopup = () => {
    setPopup({ visible: true });
  };

  const closePopup = () => {
    setPopup({ visible: false });
  };

  return (
    <div className="admin-attendance-reqp-container">
      <h1 className='heading-bg-req'>Attendance Request</h1>
      <div className="employee-stats"> 
                <div className="stat-box">
                    <h4>Requests</h4>
                    <p>
                        <CountUp start={0} end="6" duration={2} separator="," />
                    </p>                </div>
                <div className="stat-box active-stats">
                    <h4 style={{color:"#313131"}}>Approved</h4>
                    <p><CountUp start={0} end="1" duration={2} separator="," />
                    </p>
                </div>
                <div className="stat-box inactive">
                    <h4 style={{color:"#313131"}}>Rejected</h4>
                    <p>                        <CountUp start={0} end="2" duration={2} separator="," />
                    </p>
                </div>
            </div>
            <div>
              <div className='filter-section'>
              <select class="admin-attendance-reqp-dropdown-request">
  <option value="All">All</option>
  <option value="Accepted">Accepted</option>
  <option value="Rejected">Rejected</option>
</select>
  <input type='date' class='admin-attendance-reqp-date-input' />
  <button className="admin-attendance-reqp-action-button" onClick={handlePopup}>Action</button>

              </div>
  </div>
      <div className="admin-attendance-reqp-table-container">
        <table className="admin-attendance-reqp-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  className="admin-attendance-reqp-checkbox"
                  onChange={(e) =>
                    setSelectedDeals(
                      e.target.checked ? deals.map((deal) => deal.id) : []
                    )
                  }
                  checked={selectedDeals.length === deals.length}
                />
              </th>
              {['EmployeeID', 'Name', 'Date','Reason','Status'].map((header) => (
                <th key={header} onClick={() => handleSort(header.toLowerCase())}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedDeals.map((deal) => (
              <tr key={deal.id}>
                <td>
                  <input
                    type="checkbox"
                    className="admin-attendance-reqp-checkbox"
                    checked={selectedDeals.includes(deal.id)}
                    onChange={() => handleCheckboxChange(deal.id)}
                  />
                </td>
                <td>{deal.id}</td>
                <td> <div className="user-container">
                                                    <div className="user-icon">
                                                        <FaUser className="fa-user-icon" />
                                                    </div>
                                                    <span className="user-name">{deal.name}</span>
                                                </div></td>
                <td>{deal.date}</td>
                <td>{deal.reason}</td>
                <td className={`admin-attendance-reqp-status ${deal.status.toLowerCase()}`}>{deal.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {popup.visible && (
        <div className="admin-attendance-reqp-popup-overlay">
          <div className="admin-attendance-reqp-popup">
            <p className='admin-attendance-reqp-popup-content'>Accept or Reject Selected Requests?</p>
            <button className="admin-attendance-reqp-accept" onClick={closePopup}>Accept</button>
            <button className="admin-attendance-reqp-reject" onClick={closePopup}>Reject</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAttendenceReqp;