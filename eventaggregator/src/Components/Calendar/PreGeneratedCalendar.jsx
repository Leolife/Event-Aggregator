import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PreGeneratedCalendar.css';

const PreGeneratedCalendar = () => {
  const { calendarType } = useParams();
  const [eventsByDate, setEventsByDate] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetch('/inventory/Final_Events.csv')
      .then((res) => res.text())
      .then((csvText) => {
        const rows = csvText.trim().split('\n');
        const headers = rows[0].split(',').map(h => h.trim());
  
        const events = rows.slice(1).map(row => {
          const values = row.split(',');
          const event = {};
          headers.forEach((header, i) => {
            event[header] = values[i]?.trim();
          });
          return event;
        });
  
        const groupedEvents = {};
  
        events.forEach(event => {
          const rawDate = event["Start Date"];
          const title = event["Title"] || "Untitled";
  
          if (!rawDate) return;
  
          let date;
          try {
            const fullDate = `${rawDate} 2025`; 
            date = new Date(fullDate);
            if (isNaN(date)) return;
          } catch {
            return;
          }
  
          const dateKey = date.toISOString().split('T')[0]; 
          if (!groupedEvents[dateKey]) groupedEvents[dateKey] = [];
          groupedEvents[dateKey].push({
            title,
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        });
  
        setEventsByDate(groupedEvents);
      });
  }, []);
  

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();

    const cells = [];

    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={`empty-${i}`} className="cell empty" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const events = eventsByDate[dateKey] || [];

      cells.push(
        <div key={day} className="cell">
          <div className="day-num">{day}</div>
          {events.map((event, i) => (
            <div key={i} className="event-block">
              <strong>{event.title.slice(0, 30)}...</strong><br />
              {event.time}
            </div>
          ))}
        </div>
      );
    }

    return cells;
  };

  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();

  return (
    <div className="calendar-container">
      <h2 className="calendar-title">
        {calendarType?.toUpperCase() || 'Events'} Calendar
      </h2>

      <div className="calendar-nav">
        <button onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}>
          &lt; Prev
        </button>
        <h3>{monthName} {year}</h3>
        <button onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}>
          Next &gt;
        </button>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="cell header">{day}</div>
        ))}
        {renderCalendar()}
      </div>
    </div>
  );
};

export default PreGeneratedCalendar;
