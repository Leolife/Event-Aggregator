import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import './EventPage.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { auth, firestore } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ReactComponent as HeartIcon } from '../../assets/heart-icon.svg';
import { ReactComponent as SaveIcon } from '../../assets/save-icon.svg';


export const EventPage = ({ sidebar, user }) => {
    const { eventId } = useParams();
    const [event, setEvent] = useState([{}])
    const [loading, setLoading] = useState(true);
    const [favoritedEvents, setFavoritedEvents] = useState([]);

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

    useEffect(() => {
        console.log(event)
    }, [event])
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
                        console.log(userFavorites.includes(data.id), data.title, data.id)
                        return {
                            firestoreId: doc.id || '',
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
    }, []);
    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className={`container ${sidebar ? "" : 'large-container'}`}>
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
                                        <div className="add-options">
                                            <button
                                                className={favoritedEvents.includes(event.eventId) ? 'heartfilled-btn' : 'heart-btn'}
                                                //onClick={() => handleHeartClick(event)}
                                            >
                                                <HeartIcon className="heart-icon" />
                                                {favoritedEvents.includes(event.eventId) ? 'Unfavorite' : 'Favorite'}

                                            </button>
                                            <button
                                                className="add-btn"
                                                //onClick={() => handleAddToCalendarClick(event)}
                                            >
                                                Add to Calendar
                                            </button>
                                            <button className="export-btn"> Export (Google Calendar) </button>
                                            <button className="save-btn"> <SaveIcon className="save-icon" /> </button>
                                        </div>
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

                                    <div className='event-buttons-section'>

                                    </div>
                                    <div className='event-tags'>
                                        <h1> Tags </h1>
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
        </>
    )
}
