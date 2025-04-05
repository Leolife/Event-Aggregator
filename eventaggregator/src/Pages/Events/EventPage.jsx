import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

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

    const safeLocation = (event) => {
        // Convert any non-string values to strings and then check if they're empty
        const address = typeof event.address1 === 'string' ? event.address1 : String(event.address1 || '');
        const city = typeof event.city === 'string' ? event.city : String(event.city || '');
        const state = typeof event.state === 'string' ? event.state : String(event.state || '');
        const zip = typeof event.zipcode === 'string' ? event.zipcode : String(event.zipcode || '');

        const parts = [address, city, state, zip].filter(part => part && part.trim && part.trim() !== '');
        return parts.join(', ');
    };

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
                            location: safeLocation(data),
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
                        <div className='details-section'>
                            <div className='event-details'>
                            </div>
                        </div>
                        <div className='img-section'>
                            <div className='img-sizer'>
                                <img src={event.image} alt="" />
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
