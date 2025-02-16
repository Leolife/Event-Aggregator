import Sidebar from '../../Components/Sidebar/Sidebar'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import './EventCategory.css';
// import { ReactComponent as CalendarIcon } from '../../assets/calendar-icon.svg';
// import { ReactComponent as LocationIcon } from '../../assets/location-icon.svg';
import { ReactComponent as HeartIcon } from '../../assets/heart-icon.svg';
import { ReactComponent as SaveIcon } from '../../assets/save-icon.svg';
import thumbnail1 from '../../assets/event1.jpg'
import thumbnail2 from '../../assets/event2.jpg'
import thumbnail3 from '../../assets/event3.jpg'
import thumbnail4 from '../../assets/event4.jpg'
import thumbnail5 from '../../assets/event5.jpg'

import Header from '../../Components/Header/Header'

function formatCategoryName(categoryName) {
    return categoryName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export const EventCategory = ({ sidebar }) => {
    const { categoryName } = useParams();
    const [events, setEvents] = useState([{}])
    const [selectedTags, setSelectedTags] = useState([]);
    const thumbnails = [thumbnail1, thumbnail2, thumbnail3, thumbnail4, thumbnail5];

    function formatDateTime(dateString, timeZone = "America/Los_Angeles") {
        const date = new Date(dateString + "Z"); // Ensure UTC parsing
        const optionsDate = { weekday: "short", month: "short", day: "numeric" };
        const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true, timeZoneName: "short" };

        // Format date
        let formattedDate = date.toLocaleDateString("en-US", optionsDate);
        let day = date.getDate();

        // Add ordinal suffix
        const ordinal = (d) => (d > 3 && d < 21) ? "th" : ["st", "nd", "rd"][(d % 10) - 1] || "th";
        formattedDate += ordinal(day);

        // Format time
        let formattedTime = date.toLocaleTimeString("en-US", optionsTime);

        return `${formattedDate} @ ${formattedTime}`;
    }

    function sendData(data) {
        setSelectedTags(data)
    }


    useEffect(() => {
        async function fetchEvents() {
            const event = { NUMBER: 10 };
            const response = await fetch("/events/random", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(event)
            });
            setEvents(await response.json())
        }

        fetchEvents();
    }, [])

    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className="events">
                <Header title={formatCategoryName(categoryName)} sidebar={sidebar} sendData={sendData} />
                <div className={`container ${sidebar ? "" : 'large-container'}`}>
                    <div className="feed">
                        {events.map((event, index) => (
                            <div key={index} className="event-card">
                                <div className='img-sizer'>
                                    <img src={thumbnails[Math.floor(Math.random() * thumbnails.length)]} alt="" />
                                </div>
                                <div className="event-content">
                                    <div className="event-details">
                                        <div className="event-name">
                                            <h2> {event.title} </h2>
                                            <label className="event-type"> {event["event type"]} </label>
                                            <div className="tag-box">

                                            </div>
                                        </div>
                                        <div className="description-box">
                                            <span className="description"> {event.description}  </span>
                                        </div>
                                        <div className="timestamp-container">
                                            <div className="event-date">
                                                <span> 📅 </span>
                                                <label className="date-text"> {formatDateTime(event.date)} </label>
                                                <div className="event-location">
                                                    <span>📍</span>
                                                    <label className="location-text"> {event.address1}. {event.city}, {event.state} {event.zipcode} </label>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="footer">
                                        <label className="price"> Price: {event.price === 0 ? "Free" : `$${event.price}`} </label>
                                        <div className="add-options">
                                            <button className="heart-btn"> <HeartIcon className="heart-icon" /> </button>
                                            <button className="add-btn"> Add to Calendar </button>
                                            <button className="export-btn"> Export (Google Calendar) </button>
                                            <button className="save-btn"> <SaveIcon className="save-icon" /> </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default EventCategory
