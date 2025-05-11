import React, { useState, useEffect } from 'react';
import './Calendar_layout.css';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';
import CalendarEventModal from './CalendarEventModal';

const Calendar_layout = ({ calendarTitle, calendarId, onChangeMonth, onDelete, isDefaultCalendar, user }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [viewMode, setViewMode] = useState('month'); // 'month' or 'upcoming'
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // State for event modal
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);

    // State for notifications - moved from modal to parent component
    const [notification, setNotification] = useState({ show: false, message: '', isError: false });

    // Handle notifications from child components
    const handleNotification = (notificationData) => {
        setNotification(notificationData);
        // Set a timeout to hide the notification after 3 seconds
        setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    // Get event information by ID
    async function fetchEvent(eventId) {
        const data = { ID: eventId };
        const response = await fetch("/get/single_event", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const fetchedEvent = await response.json()
        return (Object.values(fetchedEvent)[0])
    }

    // Fetch calendar events whenever calendar, currentDate or viewMode changes
    useEffect(() => {
        const fetchCalendarEvents = async () => {
            if (!calendarId || !user) return;

            try {
                setLoading(true);
                setError('');

                // Find the calendar document
                const calendarsCollection = collection(firestore, 'calendars');
                const q = query(
                    calendarsCollection,
                    where("id", "==", calendarId),
                    where("uid", "==", user.uid)
                );

                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setError('Calendar not found');
                    setCalendarEvents([]);
                    return;
                }

                // Get the calendar document
                const calendarDoc = querySnapshot.docs[0];
                const calendarData = calendarDoc.data();

                // Check if the calendar has events
                const eventsData = calendarData.eventsData || [];

                // Format and store all events
                const currentYear = new Date().getFullYear();
                const formattedEvents = await Promise.all(
                    eventsData.map(async (eventId) => {
                        const event = await fetchEvent(eventId);
                        return {
                            id: event.id,
                            title: event.title || 'Unnamed Event',
                            date: new Date(`${event.date || event.when}, ${currentYear}`),
                            description: event.desc || '',
                            address1: event.address1 || '',
                            address2: event.address2 || '',
                            mainpage: event.mainpage || '',
                            image: event.image || '',
                            thumb: event.thumb || '',
                            originalDate: event.when || event.date,
                        };
                    }));
                console.log(formattedEvents)

                setCalendarEvents(formattedEvents);

                // If we're in upcoming view, also update the upcoming events
                if (viewMode === 'upcoming') {
                    setUpcomingEvents(formattedEvents.map(event => ({
                        ...event,
                        formattedDate: formatDateTime(event.originalDate)
                    })));
                }
            } catch (error) {
                console.error('Error fetching calendar events:', error);
                setError('Failed to load events. Please try again.');
                setCalendarEvents([]);
                if (viewMode === 'upcoming') {
                    setUpcomingEvents([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCalendarEvents();
    }, [calendarId, user, currentDate, viewMode]);

    const handleExport = (e) => {
        e.preventDefault();
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ')  // EXTREMELY important
    };

    const handleDelete = (e) => {
        e.preventDefault();
        // Call the parent component's delete handler
        if (onDelete) {
            onDelete();
        }
    };

    // Function to handle event click and open the modal
    const handleEventClick = (event, e) => {
        e.stopPropagation(); // Prevent day cell click from triggering
        setSelectedEvent(event);
        setIsEventModalOpen(true);
    };

    // Function to handle event deletion (callback from modal)
    const handleEventDelete = (deletedEventId) => {
        // Update the calendar events list
        setCalendarEvents(prev =>
            prev.filter(event => event.id !== deletedEventId)
        );

        // Also update upcoming events if in that view
        if (viewMode === 'upcoming') {
            setUpcomingEvents(prev =>
                prev.filter(event => event.id !== deletedEventId)
            );
        }
    };

    // Function to get days in a month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Function to get the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // Navigation functions
    const goToPreviousMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() - 1);

            if (onChangeMonth) {
                onChangeMonth(newDate);
            }

            return newDate;
        });
    };

    const goToNextMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + 1);

            if (onChangeMonth) {
                onChangeMonth(newDate);
            }

            return newDate;
        });
    };

    // Function to format the month and year
    const formatMonthYear = (date) => {
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    // Function to format date and time for display
    function formatDateTime(dateString, timeZone = "America/Los_Angeles") {
        if (!dateString) return "No date specified";

        try {
            // Handle "Z" suffix if it's already present (ISO string)
            const dateToFormat = dateString.endsWith('Z') ? dateString : dateString + 'Z';
            const date = new Date(dateToFormat);

            if (isNaN(date.getTime())) {
                console.error("Invalid date:", dateString);
                return "Invalid date";
            }

            const options = {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                timeZoneName: "short"
            };

            return date.toLocaleString("en-US", options);
        } catch (error) {
            console.error("Error formatting date:", error, "Original:", dateString);
            return "Date error";
        }
    }

    // Function to check if an event is on a specific date
    const getEventsForDate = (date) => {
        // Make sure we have a valid date for comparison
        if (!date || !calendarEvents.length) return [];

        return calendarEvents.filter(event => {
            const eventDate = event.date;
            return (
                eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear()
            );
        });
    };

    // Function to handle date selection
    const handleDateClick = (day) => {
        const newSelectedDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
        );
        setSelectedDate(newSelectedDate);
    };

    // Function to switch between month and upcoming view
    const switchViewMode = (mode) => {
        setViewMode(mode);
    };

    // Function to render the calendar days
    const renderCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = getFirstDayOfMonth(year, month);

        // Get days from previous month
        const daysInPrevMonth = getDaysInMonth(year, month - 1);

        // Create array of days
        const days = [];

        // Add days from previous month
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const date = new Date(year, month - 1, day);
            days.push({
                day,
                date,
                currentMonth: false,
                prevMonth: true,
                nextMonth: false
            });
        }

        // Add days from current month
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            days.push({
                day: i,
                date,
                currentMonth: true,
                prevMonth: false,
                nextMonth: false
            });
        }

        // Calculate how many days to show from next month (to complete the grid)
        const totalDaysDisplayed = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
        const daysFromNextMonth = totalDaysDisplayed - days.length;

        // Add days from next month
        for (let i = 1; i <= daysFromNextMonth; i++) {
            const date = new Date(year, month + 1, i);
            days.push({
                day: i,
                date,
                currentMonth: false,
                prevMonth: false,
                nextMonth: true
            });
        }

        // Render the calendar grid
        const calendar = [];
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Add header row with weekday names
        calendar.push(
            <div key="header" className="calendar-header">
                {weekDays.map(day => (
                    <div key={day} className="calendar-weekday">
                        {day}
                    </div>
                ))}
            </div>
        );

        // Add day cells in rows of 7
        let rows = [];
        let cells = [];

        days.forEach((day, i) => {
            const today = new Date();
            const isToday =
                day.date.getDate() === today.getDate() &&
                day.date.getMonth() === today.getMonth() &&
                day.date.getFullYear() === today.getFullYear();

            const dayClass = `calendar-day ${day.currentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''}`;

            const isSelected = selectedDate &&
                selectedDate.getDate() === day.day &&
                selectedDate.getMonth() === (day.prevMonth
                    ? currentDate.getMonth() - 1
                    : day.nextMonth
                        ? currentDate.getMonth() + 1
                        : currentDate.getMonth());

            // Get events for this date
            const dayEvents = getEventsForDate(day.date);

            cells.push(
                <div
                    key={i}
                    className={`${dayClass} ${isSelected ? 'selected' : ''} ${dayEvents.length > 0 ? 'day-with-events' : ''}`}
                    onClick={() => handleDateClick(day.day)}
                >
                    <div className="day-number">{day.day}</div>
                    <div className="events-container">
                        {dayEvents.map((event, index) => (
                            <div
                                key={index}
                                className="event event-blue"
                                onClick={(e) => handleEventClick(event, e)}
                            >
                                {event.title}
                            </div>
                        ))}
                    </div>
                </div>
            );

            if ((i + 1) % 7 === 0) {
                rows.push(
                    <div key={i} className="calendar-row">
                        {cells}
                    </div>
                );
                cells = [];
            }
        });

        calendar.push(
            <div key="days" className="calendar-days">
                {rows}
            </div>
        );

        return calendar;
    };

    // Render the upcoming view with actual events from Firestore
    const renderUpcomingView = () => {
        return (
            <div className="upcoming-view">
                <div className="upcoming-events">
                    {loading ? (
                        <div className="loading-events">Loading events...</div>
                    ) : error ? (
                        <div className="error-message" style={{ color: 'red', textAlign: 'center' }}>
                            {error}
                        </div>
                    ) : upcomingEvents.length === 0 ? (
                        <div className="no-events">No upcoming events to display</div>
                    ) : (
                        <div className="event-list">
                            {upcomingEvents.map(event => (
                                <div
                                    key={event.id}
                                    className="upcoming-event-card"
                                    onClick={() => {
                                        setSelectedEvent(event);
                                        setIsEventModalOpen(true);
                                    }}
                                >
                                    <h3 className="event-title">{event.title}</h3>
                                    <div className="event-details">
                                        <p className="event-time">
                                            <span className="event-icon">📅</span> {event.formattedDate}
                                        </p>
                                        <p className="event-location">
                                            <span className="event-icon">📍</span> {event.address1}
                                        </p>
                                        {event.price > 0 && (
                                            <p className="event-price">
                                                <span className="event-icon">💰</span> ${event.price}
                                            </p>
                                        )}
                                        {event.price === 0 && (
                                            <p className="event-price">
                                                <span className="event-icon">💰</span> Free
                                            </p>
                                        )}
                                    </div>
                                    <p className="event-description">{event.description && (
                                        <div className={`event-detail ${event.description.length > 750 ? 'description' : ''}`}>
                                            <span className="event-icon">📝-</span>
                                            <div className="event-info">{event.description}</div>
                                        </div>
                                    )}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="calendar-layout">
            {notification.show && (
                <div className={`event-notification ${notification.isError ? 'error' : 'success'}`}>
                    {notification.message}
                </div>
            )}

            <div className="calendar-navigation">
                <div className="calendar-title">
                    {calendarTitle || 'Calendar'}
                </div>

                <div className="calendar-controls">
                    <button className="export-btn" onClick={handleExport}>Export (Google Calendar)</button>
                    {/* Only show delete button if this is not the Favorites calendar */}
                    {!isDefaultCalendar && (
                        <button className="delete-btn" onClick={handleDelete}>Delete</button>
                    )}
                </div>
            </div>

            <div className="calendar-toolbar">
                <div className="month-navigation">
                    <button className="nav-btn prev" onClick={goToPreviousMonth}>
                        &lt;
                    </button>
                    <div className="current-month">{formatMonthYear(currentDate)}</div>
                    <button className="nav-btn next" onClick={goToNextMonth}>
                        &gt;
                    </button>
                </div>

                <div className="view-options">
                    <div className="timezone-display">PDT</div>
                    <div className="view-toggle">
                        <button
                            className={`view-btn ${viewMode === 'month' ? 'active' : ''}`}
                            onClick={() => switchViewMode('month')}
                        >
                            Month
                        </button>
                        <button
                            className={`view-btn ${viewMode === 'upcoming' ? 'active' : ''}`}
                            onClick={() => switchViewMode('upcoming')}
                        >
                            Upcoming
                        </button>
                    </div>
                </div>
            </div>

            <div className="calendar-container">
                {viewMode === 'month' ? renderCalendarDays() : renderUpcomingView()}
            </div>

            {/* Calendar Event Modal */}
            <CalendarEventModal
                isOpen={isEventModalOpen}
                onClose={() => setIsEventModalOpen(false)}
                event={selectedEvent}
                calendarId={calendarId}
                onEventDelete={handleEventDelete}
                user={user}
                onNotification={handleNotification} // Pass the notification handler
            />
        </div>
    );
};

export default Calendar_layout;
