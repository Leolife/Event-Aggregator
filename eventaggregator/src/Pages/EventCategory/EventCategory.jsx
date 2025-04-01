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
import AddToCalendarModal from '../../Components/Calendar/AddToCalendarModal';
import { auth, firestore } from '../../firebase';
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';

// Takes the category name from the url and reformats it to be placed in the header
function formatCategoryName(categoryName) {
    return categoryName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export const EventCategory = ({ sidebar, user }) => {
    const { categoryName } = useParams();
    const [events, setEvents] = useState([{}])
    const [selectedTags, setSelectedTags] = useState([]);
    // Stores the Sort By option the user has selected
    const [selectedSort, setSelectedSort] = useState(0);
    // State for the Add to Calendar modal
    const [isAddToCalendarModalOpen, setIsAddToCalendarModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Combined notification state for both heart actions and calendar additions
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        isError: false
    });

    // State to track favorited events
    const [favoritedEvents, setFavoritedEvents] = useState([]);

    // Function to show notification
    const showNotification = (message, isError = false) => {
        setNotification({
            show: true,
            message,
            isError
        });

        // Auto-hide notification after 3 seconds
        setTimeout(() => {
            setNotification({
                show: false,
                message: '',
                isError: false
            });
        }, 3000);
    };

    // Dropdown options for sorting
    const options = [
        "All",
        "Upcoming"
    ]
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

    // Retrieves tags and sort options from the header
    function sendData(tags_data, sort_data) {
        setSelectedTags(tags_data)
        setSelectedSort(sort_data)
    }

    // Handler for opening the Add to Calendar modal
    const handleAddToCalendarClick = (event) => {
        // Check if user is logged in
        const currentUser = user || auth.currentUser;
        if (!currentUser) {
            // Use notification instead of alert
            showNotification("Please log in to add events to calendars.", true);
            return;
        }

        setSelectedEvent(event);
        setIsAddToCalendarModalOpen(true);
    };

    // Handler for successful calendar add (callback from modal)
    const handleCalendarAddSuccess = (calendarName) => {
        const message = calendarName
            ? `Event added to "${calendarName}" calendar successfully!`
            : "Event added to calendar successfully!";

        showNotification(message, false);
    };

    // Handler for calendar add error (callback from modal) 
    const handleCalendarAddError = (errorMessage) => {
        showNotification(errorMessage || "Failed to add event to calendar.", true);
    };

    // Handler for closing the Add to Calendar modal
    const handleCloseModal = () => {
        setIsAddToCalendarModalOpen(false);
        setSelectedEvent(null);
    };

    // Function to add event to the Favorites calendar when heart button is clicked
    const handleHeartClick = async (event) => {
        // Check if user is logged in
        const currentUser = user || auth.currentUser;
        if (!currentUser) {
            // User is not logged in, show notification
            showNotification("Please log in to add events to favorites.", true);
            return;
        }

        try {
            // Find the Favorites calendar
            const calendarsCollection = collection(firestore, 'calendars');
            const q = query(
                calendarsCollection,
                where("uid", "==", currentUser.uid),
                where("name", "==", "Favorites"),
                where("isDefault", "==", true)
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                showNotification("Favorites calendar not found. Please visit the Calendar page to set it up.", true);
                return;
            }

            // Get the Favorites calendar document
            const calendarDoc = querySnapshot.docs[0];
            const calendarDocRef = doc(firestore, 'calendars', calendarDoc.id);
            const calendarData = calendarDoc.data();

            // Create event data
            const safeLocation = () => {
                // Convert any non-string values to strings and then check if they're empty
                const address = typeof event.address1 === 'string' ? event.address1 : String(event.address1 || '');
                const city = typeof event.city === 'string' ? event.city : String(event.city || '');
                const state = typeof event.state === 'string' ? event.state : String(event.state || '');
                const zip = typeof event.zipcode === 'string' ? event.zipcode : String(event.zipcode || '');

                const parts = [address, city, state, zip].filter(part => part && part.trim && part.trim() !== '');
                return parts.join(', ');
            };

            const eventId = `event-${Date.now()}`;
            const eventData = {
                eventId: eventId,
                title: event.title || 'Unnamed Event',
                description: event.description || '',
                location: safeLocation(),
                date: event.date || new Date().toISOString(),
                price: event.price != null ? event.price : 0,
                eventType: event["event type"] || '',
                tags: event.tags || '',
                createdAt: new Date().toISOString(),
                image: event.image || "https://i.scdn.co/image/ab67616d0000b273dbc606d7a57e551c5b9d4ee3"
            };

            // Check if the event is already in favorites by creating a simple signature
            // This is a basic check that might need to be enhanced in a production environment
            const eventSignature = `${event.title}-${event.date}`;

            if (favoritedEvents.includes(eventSignature)) {
                showNotification("This event is already in your favorites!");
                return;
            }

            // Update calendar document to include the new event
            if (!calendarData.eventsData) {
                await updateDoc(calendarDocRef, {
                    eventsData: [eventData]
                });
            } else {
                // Add event to existing events array
                await updateDoc(calendarDocRef, {
                    eventsData: arrayUnion(eventData)
                });
            }

            // Increment the events count and upcoming count
            await updateDoc(calendarDocRef, {
                events: (calendarData.events || 0) + 1,
                upcoming: (calendarData.upcoming || 0) + 1
            });

            // Update the favorited events state
            setFavoritedEvents([...favoritedEvents, eventSignature]);

            // Show success message
            showNotification("Event added to favorites!");

        } catch (error) {
            console.error('Error adding event to favorites:', error);
            showNotification("Error adding to favorites. Please try again.", true);
        }
    };

    // Fetches 10 random events from the API
    useEffect(() => {
        async function fetchEvents() {
            const event = { NUMBER: 5 };
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

    useEffect(() => {
        console.log(events)
    }, [events])

    // Grabs selected tags from the header
    useEffect(() => {
    }, [selectedTags, selectedSort])

    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className="events">
                <Header title={formatCategoryName(categoryName)} sidebar={sidebar} sendData={sendData} options={options} />
                <div className={`container ${sidebar ? "" : 'large-container'}`}>
                    {/* Notification toast - moved from inside modal to parent component */}
                    {notification.show && (
                        <div className={`notification-toast ${notification.isError ? 'error' : 'success'}`}>
                            {notification.message}
                        </div>
                    )}
                    <div className="feed">
                        {events && events.length > 0 ? (
                            events
                                .sort((a, b) => selectedSort === 1 ? new Date(a.date) - new Date(b.date) : selectedSort === 0 ? a.title.localeCompare(b.title) : 0) // If option 0, sort events alphebatically. If option 1, sort events by upcoming.
                                .filter(x => selectedTags.length === 0 || selectedTags.some(tag => x.tags && x.tags.includes(tag.category))) // Filters the events by category tags the user has selected. If no tags are selected then displays all.
                                .map((event, index) => (
                                    <div key={index} className="event-card">
                                        <div className='img-sizer'>
                                            {/* Selects a random thumbnail, will be changed later */}
                                            <img src={event["image"] ? event["image"]: thumbnails[Math.floor(Math.random() * thumbnails.length)]} alt="" />
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
                                                    <button
                                                        className="heart-btn"
                                                        onClick={() => handleHeartClick(event)}
                                                    >
                                                        <HeartIcon className="heart-icon" />
                                                    </button>
                                                    <button
                                                        className="add-btn"
                                                        onClick={() => handleAddToCalendarClick(event)}
                                                    >
                                                        Add to Calendar
                                                    </button>
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

            {/* Add to Calendar Modal with new callback props */}
            <AddToCalendarModal
                isOpen={isAddToCalendarModalOpen}
                onClose={handleCloseModal}
                event={selectedEvent}
                user={user || auth.currentUser}
                onSuccess={handleCalendarAddSuccess}
                onError={handleCalendarAddError}
            />
        </>
    );
}
export default EventCategory
