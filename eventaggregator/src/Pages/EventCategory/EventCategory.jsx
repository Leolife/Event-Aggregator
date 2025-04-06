import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './EventCategory.css';
import Sidebar from '../../Components/Sidebar/Sidebar'
import Header from '../../Components/Header/Header'
import AddToCalendarModal from '../../Components/Calendar/AddToCalendarModal';
import { auth, firestore } from '../../firebase';
import { collection, query, where, getDocs} from 'firebase/firestore';
import { formatCategoryName, formatDateTime, formatLocation } from '../../utils/FormatData';
import SaveEventButtons from '../../Components/Events/SaveEventButtons';
import Alert from '../../Components/Notification/Alert';
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
                        return eventsData.map(event => event.eventId);
                    })
                setFavoritedEvents(userFavorites)

                const fetchedEvents = eventsSnapshot.docs
                    .map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id || '',
                            eventId: data.id || '',
                            title: data.title || 'Unnamed Event',
                            description: data.description || '',
                            location: data.location || '',
                            date: data.date || new Date().toISOString(),
                            price: data.price != null ? data.price : 0,
                            eventType: data.eventType || '',
                            tags: data.tags || '',
                            image: data.image || "https://i.scdn.co/image/ab67616d0000b273dbc606d7a57e551c5b9d4ee3",
                            favorited: userFavorites.includes(data.id),
                        };
                    })
                setEvents(fetchedEvents);

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

    // Fetches 10 random events from the API
    useEffect(() => {
        async function fetchEvents() {
            const event = { NUMBER: 3 };
            const response = await fetch("/events/random", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(event)
            });
            const data = await response.json()
            data.forEach(item => {
                item["image"] = "https://images.igdb.com/igdb/image/upload/t_1080p/" + item["image"] + ".jpg" //Attaches URL to the image ID
                const eventHash = hash(item)
                handleStoreEvent(eventHash, item)
            })
            //setEvents(data)

        }
        fetchEvents();
    }, [])

    const handleStoreEvent = async (eventHash, event) => {
        const eventsCollection = collection(firestore, "events");
        const q = query(eventsCollection, where("id", '==', eventHash));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            const newEvent = {
                id: eventHash,
                title: event.title || 'Unnamed Event',
                description: event.description || '',
                location: formatLocation(event),
                date: event.date || new Date().toISOString(),
                price: event.price != null ? event.price : 0,
                eventType: event["event type"] || '',
                tags: event.tags || '',
                image: event.image || "https://i.scdn.co/image/ab67616d0000b273dbc606d7a57e551c5b9d4ee3"
            };
            /*
            setEvents([...events, newEvent])
            await addDoc(eventsCollection, newEvent);
            */
            }
    }
    // Grabs selected tags from the header
    useEffect(() => {
    }, [selectedTags, selectedSort])

    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className="events">
                <Header title={formatCategoryName(categoryName)} sidebar={sidebar} sendData={sendData} options={options} />
                <div className={`container ${sidebar ? "" : 'large-container'}`}>
                    <Alert notification = {notification}> </Alert>
                    <div className="feed">
                        {events && events.length > 0 ? (
                            events
                                .sort((a, b) => selectedSort === 1 ? new Date(a.date) - new Date(b.date) : 0) // If option 0, sort events alphebatically. If option 1, sort events by upcoming.
                                .filter(x => selectedTags.length === 0 || selectedTags.some(tag => x.tags && x.tags.includes(tag.category))) // Filters the events by category tags the user has selected. If no tags are selected then displays all.
                                .map((event, index) => (
                                    <div key={index} className="event-card" onClick={() => navigate(`/event/${event.id}`)}>
                                        <div className='img-sizer'>
                                            <img src={event.image} alt="" />
                                        </div>
                                        <div className="event-content">
                                            <div className="event-details">
                                                <div className="event-name">
                                                    <h2> {event.title} </h2>
                                                    <div className="category-box">
                                                        <label className="event-type"> {event.eventType} </label>
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
                                                            <label className="location-text"> {event.location} </label>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="footer">
                                                {/* If the price is 0, display it as free */}
                                                <label className="price"> Price: {event.price === 0 ? "Free" : `$${event.price}`} </label>
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
