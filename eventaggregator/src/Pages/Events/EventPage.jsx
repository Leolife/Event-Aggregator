import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import './EventPage.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { auth, firestore } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { formatDateTime } from '../../utils/FormatData'
import SaveEventButtons from '../../Components/Events/SaveEventButtons';
import AddToCalendarModal from '../../Components/Calendar/AddToCalendarModal';
import Alert from '../../Components/Notification/Alert';

export const EventPage = ({ sidebar, user }) => {
    const { eventId } = useParams();
    const [event, setEvent] = useState([{}])
    const [loading, setLoading] = useState(true);
    const [favoritedEvents, setFavoritedEvents] = useState([]);
    // State for the Add to Calendar modal
    const [isAddToCalendarModalOpen, setIsAddToCalendarModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
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

    // Handler for successful calendar add (callback from modal)
    const handleCalendarAddSuccess = (calendarName) => {
        const message = calendarName
            ? `Event added to "${calendarName}" calendar successfully!`
            : "Event added to calendar successfully!";

        showNotification(message, false);
    };

    // Handler for closing the Add to Calendar modal
    const handleCloseModal = () => {
        setIsAddToCalendarModalOpen(false);
        setSelectedEvent(null);
    };

    // Handler for calendar add error (callback from modal) 
    const handleCalendarAddError = (errorMessage) => {
        showNotification(errorMessage || "Failed to add event to calendar.", true);
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

    useEffect(() => {
        const getEvents = async () => {
            try {
                setLoading(true);
                const eventsCollection = collection(firestore, 'events');
                const calendarsCollection = collection(firestore, "calendars");
                const currentUser = user || auth.currentUser;
                const q = query(
                    calendarsCollection,
                    where("uid", "==", currentUser.uid),
                    where("name", "==", "Favorites"),
                    where("isDefault", "==", true)
                );
                const eventQuery = query(
                    eventsCollection,
                    where("__name__", "==", eventId)
                )
                const eventsSnapshot = await getDocs(eventQuery);
                const calendarSnapshot = await getDocs(q);

                const userFavorites = calendarSnapshot.docs
                    .flatMap(doc => {
                        const data = doc.data();
                        const eventsData = data.eventsData || [];
                        return eventsData.map(event => event.eventId);
                    })
                setFavoritedEvents(userFavorites)

                const fetchedEvents = eventsSnapshot.docs
                    .flatMap(doc => {
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
                            favorited: userFavorites.includes(data.id) ? false : true
                        };
                    })
                setEvent(fetchedEvents[0]);

            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        getEvents();
    }, [user, eventId]);
    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className={`container ${sidebar ? "" : 'large-container'}`}>
                <Alert notification={notification}> </Alert>
                {event ? (
                    <div className='event-listing'>
                        <div className='event-info'>
                            <div className='img-section'>
                                <div className='img-sizer'>
                                    <img src={event.image} alt="" />
                                </div>
                            </div>
                            <div className='event-info-section'>
                                <div className='event-header-section'>
                                    <h2 className='event-time'> 📅 {formatDateTime(event.date)} </h2>
                                    <h1 className='event-title'> {event.title} </h1>
                                    <div className='event-type-section'>
                                        <h2 className='event-type'> {event.eventType} </h2>
                                        <h2 className="price"> • {event.price === 0 ? "Free" : `$${event.price}`} </h2>
                                    </div>
                                    <div className='event-buttons'>
                                        <div className='event-tabs'>
                                            <button className='event-tab-btn'> About </button>
                                            <button className='event-tab-btn'> Discussions </button>
                                        </div>
                                        <SaveEventButtons user={user} event={event} favoritedEvents={favoritedEvents}
                                            onEventHeart={(newFavoritesList) => onEventHeart(newFavoritesList)}
                                            onEventAdd={(newSelectedEvent, newModalOpen) => onEventAdd(newSelectedEvent, newModalOpen)}
                                            showNotification={(message, isError) => showNotification(message, isError)} />
                                    </div>
                                </div>
                                <hr />
                                <div className='event-about'>
                                    <div className='event-description-section'>
                                        <h1 className='event-header'> Desciption </h1>
                                        <p className='event-description'> {event.description} </p>
                                    </div>
                                    <div className='event-location-section'>
                                        <h1 className='event-header'> Location </h1>
                                        <p className='event-location'> 📍 {event.location} </p>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                ) : (
                    // Displays an error message if the events have not loaded in
                    <label> Error Loading Events </label>
                )}
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
    )
}
