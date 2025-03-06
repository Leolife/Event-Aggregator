import React, { useState } from 'react';
import './Calendar_layout.css';

const Calendar_layout = ({ calendarTitle, onChangeMonth, onDelete }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [viewMode, setViewMode] = useState('month'); // 'month' or 'upcoming'

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
        days.push({
            day: daysInPrevMonth - i,
            currentMonth: false,
            prevMonth: true,
            nextMonth: false
        });
        }
        
        // Add days from current month
        for (let i = 1; i <= daysInMonth; i++) {
        days.push({
            day: i,
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
        days.push({
            day: i,
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
        const dayClass = day.currentMonth 
            ? 'calendar-day current-month' 
            : 'calendar-day other-month';
            
        const isSelected = selectedDate && 
            selectedDate.getDate() === day.day && 
            selectedDate.getMonth() === (day.prevMonth 
            ? currentDate.getMonth() - 1 
            : day.nextMonth 
                ? currentDate.getMonth() + 1 
                : currentDate.getMonth());
                
        cells.push(
            <div 
            key={i}
            className={`${dayClass} ${isSelected ? 'selected' : ''}`} 
            onClick={() => handleDateClick(day.day)}
            >
            <div className="day-number">{day.day}</div>
            <div className="events-container">
                {/* Events will be populated here */}
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

    // Render the upcoming view (placeholder for now)
    const renderUpcomingView = () => {
        return (
        <div className="upcoming-view">
            <div className="upcoming-events">
            {/* List of upcoming events would be rendered here but idk what to do with this yet*/}
            <div className="no-events">No upcoming events to display</div>
            </div>
        </div>
        );
    };

    return (
        <div className="calendar-layout">
        <div className="calendar-navigation">
            <div className="calendar-title">
            {calendarTitle || 'Calendar'} 
            <span className="calendar-dropdown">▼</span>
            </div>
            
            <div className="calendar-controls">
            <button className="export-btn" onClick={handleExport}> Export (Google Calendar)</button>
            <button className="delete-btn" onClick={handleDelete}> Delete</button>
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
        </div>
    );
};

export default Calendar_layout;
