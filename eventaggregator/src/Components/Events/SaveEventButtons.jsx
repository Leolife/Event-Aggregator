import React from 'react';
import { ReactComponent as HeartIcon } from '../../assets/heart-icon.svg';
import { ReactComponent as SaveIcon } from '../../assets/save-icon.svg';
import { auth, firestore } from '../../firebase';
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import './SaveEventButtons.css'


const SaveEventButtons = ({user, event, favoritedEvents, onEventHeart, onEventAdd, showNotification}) => {
    const handleAddToCalendarClick = (e, event) => {
        e.stopPropagation(); // Prevents navigating to event page when clicked
        // Check if user is logged in
        const currentUser = user || auth.currentUser;
        if (!currentUser) {
            // Use notification instead of alert
            showNotification("Please log in to add events to calendars.", true);
            return;
        }
        onEventAdd(event, true)
    };


    // Function to add event to the Favorites calendar when heart button is clicked
    const handleHeartClick = async (e, event) => {
        e.stopPropagation(); // Prevents navigating to event page when clicked
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
            const eventId = event.eventId;
            const eventData = {
                id: event.id,
                eventId: eventId,
                title: event.title || 'Unnamed Event',
                description: event.description || '',
                location: event.location || '',
                date: event.date || new Date().toISOString(),
                price: event.price != null ? event.price : 0,
                eventType: event["event type"] || '',
                tags: event.tags || '',
                image: event.image || "https://i.scdn.co/image/ab67616d0000b273dbc606d7a57e551c5b9d4ee3"
            };

            // Check if the event is already in favorites 
            const alreadyFavorited = querySnapshot.docs.filter(doc => {
                const eventsData = doc.data().eventsData || [];
                return eventsData.some(event => event.eventId === eventId);
            }).length === 1
            if (alreadyFavorited) {
                const eventToRemove = calendarData.eventsData.find(e => e.eventId === eventId);

                if (!eventToRemove) {
                    return
                }

                // Remove the event from the eventsData array
                await updateDoc(calendarDocRef, {
                    eventsData: arrayRemove(eventToRemove)
                });
                await updateDoc(calendarDocRef, {
                    events: Math.max((calendarData.events || 1) - 1, 0),
                    upcoming: Math.max((calendarData.upcoming || 1) - 1, 0)
                });
                onEventHeart(prev => prev.filter(id => id !== eventId));
                showNotification("Event removed from favorites");
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
            onEventHeart([...favoritedEvents, eventId]);

            // Show success message
            showNotification("Event added to favorites!");

        } catch (error) {
            console.error('Error adding event to favorites:', error);
            showNotification("Error adding to favorites. Please try again.", true);
        }
    };
    return (
        <div className="add-options">
            <button
                className={favoritedEvents.includes(event.eventId) ? 'heartfilled-btn' : 'heart-btn'}
                onClick={(e) => handleHeartClick(e, event)}
            >
                <HeartIcon className="heart-icon" />
                {favoritedEvents.includes(event.eventId) ? 'Unfavorite' : 'Favorite'}

            </button>
            <button
                className="add-btn"
                onClick={(e) => handleAddToCalendarClick(e, event)}
            >
                Add to Calendar
            </button>
            <button className="export-btn"> Export (Google Calendar) </button>
            <button className="save-btn"> <SaveIcon className="save-icon" /> </button>
        </div>
    )
}

export default SaveEventButtons
