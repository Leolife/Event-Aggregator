import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './EventCategory.css';
import Sidebar from '../../Components/Sidebar/Sidebar'
import { ReactComponent as HeartIcon } from '../../assets/heart-icon.svg';
import { ReactComponent as SaveIcon } from '../../assets/save-icon.svg';
import thumbnail1 from '../../assets/event1.jpg'
import thumbnail2 from '../../assets/event2.jpg'
import thumbnail3 from '../../assets/event3.jpg'
import thumbnail4 from '../../assets/event4.jpg'
import thumbnail5 from '../../assets/event5.jpg'
import Header from '../../Components/Header/Header'

// Takes the category name from the url and reformats it to be placed in the header
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


    // Fetches 10 random events from the API
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

    // Grabs selected tags from the header
    useEffect(() => {
    }, [selectedTags])

    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className="events">
                <Header title={formatCategoryName(categoryName)} sidebar={sidebar} sendData={sendData} />
                <div className={`container ${sidebar ? "" : 'large-container'}`}>
                    <div className="feed">
                        {events && events.length > 0 ? (
                            // Filters the events by category tags the user has selected. If no tags are selected then displays all.
                            events.filter(e => selectedTags.length === 0 || selectedTags.some(tag => e.tags.includes(tag.category))).map((event, index) => (
                                <div key={index} className="event-card">
                                    <div className='img-sizer'>
                                        {/* Selects a random thumbnail, will be changed later */}
                                        <img src={thumbnails[Math.floor(Math.random() * thumbnails.length)]} alt="" />
                                    </div>
                                    <div className="event-content">
                                        <div className="event-details">
                                            <div className="event-name">
                                                <h2> {event.title} </h2>
                                                <div className="category-box">
                                                    <label className="event-type"> {event["event type"]} </label>
                                                    <div className="tag-box">
                                                        {/* Checks if the event has tags associated with it */}
                                                        {event.tags &&
                                                            // Converts the tag string into a JSON object
                                                            JSON.parse(event.tags.replace(/'/g, '"')).map((tag, index) => (
                                                                // Displays each tag
                                                                <div key={index} className="tag">
                                                                    <label className="tag-name">{tag}</label>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="description-box">
                                                <span className="description"> {event.description}  </span>
                                            </div>
                                            {/* Container for the date and location */}
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
                                            {/* If the price is 0, display it as free */}
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
                            ))
                        ) : (
                            // Displays an error message if the events have not loaded in
                            <label> Error Loading Events </label>
                        )}

                    </div>
                </div>
            </div>
        </>
    )
}
export default EventCategory
