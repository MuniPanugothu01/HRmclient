import { useState, useEffect, useMemo,} from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCalendarPlus } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../context/ThemeContext';
import Cookies from 'js-cookie';
import './index.css';

const locales = {
    'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date()),
    getDay,
    locales
});

const eventTypes = {
    Meeting: '#1E90FF',
    Birthday: '#FF4500',
    Holiday: '#32CD32',
    Conference: '#8A2BE2',
    Workshop: '#FFD700',
    Sports: '#FF6347',
    Music: '#FF69B4',
    Other: '#A9A9A9'
};

const MyCalendar = () => {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const { slide } = useTheme();
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        type: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const token = Cookies.get("token");
            if (!token) return;
            
            const response = await fetch('http://localhost:5000/events', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch events');

            const data = await response.json();
            setEvents(data.events.map(event => ({
                ...event,
                start: new Date(`${event.Date}T${event.StartTime}`),
                end: new Date(`${event.Date}T${event.EndTime}`),
                color: eventTypes[event.eventType] || eventTypes.Other
            })));
        } catch (error) {
            console.error('Error fetching events:', error);
            alert('Error fetching events. Please try again later.');
        }
    };

    const handleInputChange = (e) => {
        setNewEvent(prevEvent => ({ ...prevEvent, [e.target.name]: e.target.value }));
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        try {
            const token = getToken();
            if (!token) return;

            const eventData = { ...newEvent };
            const response = await fetch('https://serverhrm-6q98.onrender.com/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(eventData)
            });

            if (!response.ok) throw new Error('Failed to add event');

            const addedEvent = {
                ...eventData,
                start: new Date(`${newEvent.date}T${newEvent.startTime}`),
                end: new Date(`${newEvent.date}T${newEvent.endTime}`),
                color: eventTypes[newEvent.type] || eventTypes.Other
            };

            setEvents(prev => [...prev, addedEvent]);
            setShowForm(false);
            setNewEvent({ title: '', date: '', startTime: '', endTime: '', type: '' });

            alert('Event added successfully!');
        } catch (error) {
            console.error('Error adding event:', error);
            alert('Error adding event. Please try again.');
        }
    };

    const getToken = () => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        if (!token) {
            alert('No JWT token found. Please log in.');
            return null;
        }
        return token;
    };

    // Memoize events to improve performance
    const memoizedEvents = useMemo(() => events, [events]);

    return (
        <div className={slide === "false" ? "calendar-sidebar" : "calendar-sidebar1"}>
            <div className="calendar-header">
                <h1 className='hh-1'>Calendar</h1>
                <FontAwesomeIcon 
                    icon={faCalendarPlus} 
                    className="add-event-icon" 
                    onClick={() => setShowForm(true)}
                    style={{ cursor: "pointer" }} // Ensuring button clicks work
                />
            </div>

            {showForm && (
                <div className="popup-overlay">
                    <div className="popup-content eventform">
                        <FontAwesomeIcon 
                            icon={faTimes} 
                            className="close-event-icon" 
                            onClick={() => setShowForm(false)} 
                            style={{ cursor: "pointer" }} 
                        />
                        <h2>Add Event</h2>
                        <form onSubmit={handleAddEvent}>
                            <div className="eventform-input-group">
                                <input type="text" name="title" value={newEvent.title} onChange={handleInputChange} placeholder="Event Title" required />
                                <input type="date" name="date" value={newEvent.date} onChange={handleInputChange} required />
                                <input type="time" name="startTime" value={newEvent.startTime} onChange={handleInputChange} required />
                                <input type="time" name="endTime" value={newEvent.endTime} onChange={handleInputChange} required />
                                <select name="type" value={newEvent.type} onChange={handleInputChange} className='form-input'required>
                                    <option value="">Select Type</option>
                                    {Object.keys(eventTypes).map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="eventform-add-btn">Add Event</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="calendar-render">
                <Calendar
                    localizer={localizer}
                    events={memoizedEvents} // Using memoized events for better performance
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, marginTop: '20px' }}
                    selectable
                />
            </div>
        </div>
    );
};

export default MyCalendar;
