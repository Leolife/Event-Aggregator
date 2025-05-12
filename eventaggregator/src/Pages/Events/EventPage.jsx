import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import './EventPage.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { auth, firestore } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { formatDateTime } from '../../utils/FormatData'
import SaveEventButtons from '../../Components/Events/SaveEventButtons';
import AddToCalendarModal from '../../Components/Calendar/AddToCalendarModal';
import Placeholder from '../../assets/placeholder.png';
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
        async function fetchEvents() {
            const data = { ID: eventId };
            const response = await fetch("/get/single_event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const fetchedEvent = await response.json()
            setEvent(Object.values(fetchedEvent)[0])
        }
        fetchEvents();
    }, [])

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
                                    <img src={event.thumb || Placeholder} alt={event.title || 'Event image'} />
                                </div>
                            </div>
                            <div className='event-info-section'>
                                <div className='event-header-section'>
                                    <h2 className='event-time'> 📅 {event.when} </h2>
                                    <h1 className='event-title'> {event.title} </h1>
                                    <div className='event-buttons'>
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
                                        <p className='event-description'> {event.desc} </p>
                                        {event.mainpage && (
                                            <p>
                                                <a className='event-url' href={event.mainpage} target="_blank" rel="noopener noreferrer">
                                                    Visit main page
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                    <div className='event-location-section'>
                                        <h1 className='event-header'> Location </h1>
                                        <p className='event-location'> 📍 {event.address1} </p>
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
