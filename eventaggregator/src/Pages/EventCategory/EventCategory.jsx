import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom';
import './EventCategory.css';
import Sidebar from '../../Components/Sidebar/Sidebar'
import Header from '../../Components/Header/Header'
import AddToCalendarModal from '../../Components/Calendar/AddToCalendarModal';
import { auth, firestore } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { formatCategoryName, formatDateTime, formatLocation } from '../../utils/FormatData';
import SaveEventButtons from '../../Components/Events/SaveEventButtons';
import Alert from '../../Components/Notification/Alert';
import UserData from '../../utils/UserData';
var hash = require('object-hash');

export const EventCategory = ({ sidebar, user }) => {
    const navigate = useNavigate()
    const { categoryName } = useParams();
    const [events, setEvents] = useState([{}])
    const [selectedTags, setSelectedTags] = useState([]);
    // Stores the Sort By option the user has selected
    const [selectedSort, setSelectedSort] = useState(0);
    // State for the Add to Calendar modal
    const [isAddToCalendarModalOpen, setIsAddToCalendarModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    // State to track favorited events
    const [favoritedEvents, setFavoritedEvents] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    // Get the search paramater
    const queryParam = searchParams.get('q');
    
    // Combined notification state for both heart actions and calendar additions
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        isError: false
    });

    
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


    // fetch events by query
    // Takes a search query and returns 5 events
    async function fetchEventSearch(query) { 
        const itemsPerPage = 5; 
        const QUERY = query; 
        const NUMBER = itemsPerPage; 
        const data = { QUERY, NUMBER };
        const response = await fetch("/search", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const fetchedSearchedEvents = await response.json()
        setEvents(Object.values(fetchedSearchedEvents)) 
    }

    async function fetchEvents() {
        const itemsPerPage = 7;
        // Calculate START based on the current page
        const START = 1;
        const OFFSET = itemsPerPage;
        const data = { START, OFFSET };
        const response = await fetch("/get/offset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const fetchedEvents = await response.json()
        setEvents(Object.values(fetchedEvents))
    }


    // Fetch events from Firestore when component mounts and set user favorite events
    useEffect(() => {
        const getEvents = async () => {
            try {
                setLoading(true);

                const currentUser = user || auth.currentUser;
                const eventsCollection = collection(firestore, 'events');
                const calendarsCollection = collection(firestore, "calendars");
                const favoritesQuery = query(
                    calendarsCollection,
                    where("uid", "==", currentUser.uid),
                    where("name", "==", "Favorites"),
                    where("isDefault", "==", true)
                );

                const [eventsSnapshot, calendarSnapshot] = await Promise.all([
                    getDocs(eventsCollection),
                    getDocs(favoritesQuery)
                ])

                const userFavorites = calendarSnapshot.docs
                    .flatMap(doc => {
                        const data = doc.data();
                        const eventsData = data.eventsData || [];
                        return eventsData.map(id => id);
                    })
                setFavoritedEvents(userFavorites)

                // If the user searched, then display the events based on query
                if (queryParam) {
                    fetchEventSearch(queryParam)
                } else {
                    // Otherwise display events normally
                    fetchEvents()
                }
            
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        getEvents();
    }, [user]);

    // Retrieves tags and sort options from the header
    function sendData(tags_data, sort_data) {
        setSelectedTags(tags_data)
        setSelectedSort(sort_data)
    }

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

    // Sets favorited events passed from SaveEventButtons component
    const onEventHeart = (newFavoritesList) => {
        setFavoritedEvents(newFavoritesList)
    }

    // Sets selected event passed from SaveEventButtons component
    const onEventAdd = (newSelectedEvent, newModalOpen) => {
        setSelectedEvent(newSelectedEvent)
        setIsAddToCalendarModalOpen(newModalOpen)
    }

    // Grabs selected tags from the header
    useEffect(() => {
    }, [selectedTags, selectedSort])

    // Saves user interaction click and navigates to the event page
    const handleClick = async (id) => {
        navigate(`/event/${id}`)
        const user = auth.currentUser;
        console.log(user)
        if (user) {
            const userId = user.uid
            const userData = new UserData(userId);
            await userData.setEventClicks(id);
        }
    }

    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className="events">
                <Header title={formatCategoryName(categoryName)} sidebar={sidebar} sendData={sendData} options={options} />

                {/* ✅ New calendar button below header */}
                <div className="calendar-link-container">
                    <button
                        className="calendar-link-button"
                        onClick={() =>
                            navigate(`/calendar-static/${encodeURIComponent(formatCategoryName(categoryName).toLowerCase())}`)}>
                        📅 View {formatCategoryName(categoryName)} Calendar
                    </button>
                </div>

                <div className={`container ${sidebar ? "" : 'large-container'}`}>
                    <Alert notification={notification}> </Alert>
                    <div className="feed">
                        {events && events.length > 0 ? (
                            events
                                .sort((a, b) => selectedSort === 1 ? new Date(a.date) - new Date(b.date) : 0) // If option 0, sort events alphebatically. If option 1, sort events by upcoming.
                                //.filter(x => selectedTags.length === 0 || selectedTags.some(tag => x.tags && x.tags.includes(tag.category))) // Filters the events by category tags the user has selected. If no tags are selected then displays all.
                                .map((event, index) => (
                                    <div key={index} className="event-card" onClick={() => handleClick(event.id)}>
                                        <div className='img-sizer' style={{ backgroundImage: `url(${event.thumb})` }}>
                                            <div className="blur-layer"></div>
                                            <img src={event.thumb} alt="" />
                                        </div>
                                        <div className="event-content">
                                            <div className="event-details">
                                                <div className="event-name">
                                                    <h2 className='event-title'> {event.title} </h2>
                                                    <div className="category-box">
                                                        <div className="tag-box" style={{ display: "none" }}>
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
                                                    <span className="description" style={{ display: event.desc ? "inline" : "none" }}> {event.desc}  </span>
                                                </div>
                                                {/* Container for the date and location */}
                                                <div className="timestamp-container">
                                                    <div className="event-date">
                                                        <span> 📅 </span>
                                                        <label className="date-text"> {event.when} </label>
                                                        <div className="event-location" style={{ display: event.address1 ? "block" : "none" }}>
                                                            <span>📍</span>
                                                            <label className="location-text"> {event.address1} </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="footer">
                                                <SaveEventButtons user={user} event={event} favoritedEvents={favoritedEvents}
                                                    onEventHeart={(newFavoritesList) => onEventHeart(newFavoritesList)}
                                                    onEventAdd={(newSelectedEvent, newModalOpen) => onEventAdd(newSelectedEvent, newModalOpen)}
                                                    showNotification={(message, isError) => showNotification(message, isError)} />
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
