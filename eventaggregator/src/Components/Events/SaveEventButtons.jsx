import React from 'react';
import { ReactComponent as HeartIcon } from '../../assets/heart-icon.svg';
import { ReactComponent as SaveIcon } from '../../assets/save-icon.svg';
import { auth, firestore } from '../../firebase';
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import './SaveEventButtons.css'
import { sendRandomEventSuggestions } from '../../utils/sendRandomEventSuggestion';


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
            const eventId = event.id;
            console.log(eventId)

            // Check if the event is already in favorites 
            const alreadyFavorited = querySnapshot.docs.filter(doc => {
                const eventsData = doc.data().eventsData || [];
                return eventsData.some(id  => id  === eventId);
            }).length === 1
            if (alreadyFavorited) {
                const eventToRemove = calendarData.eventsData.find(id => id === eventId);

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
                    eventsData: arrayUnion(event.id)
                });
            } else {
                // Add event to existing events array
                await updateDoc(calendarDocRef, {
                    eventsData: arrayUnion(event.id)
                });
            }

            // Increment the events count and upcoming count
            await updateDoc(calendarDocRef, {
                events: (calendarData.events || 0) + 1,
                upcoming: (calendarData.upcoming || 0) + 1
            });

            // Update the favorited events state
            onEventHeart([...favoritedEvents, eventId]);
            console.log(favoritedEvents)

            // Show success message
            showNotification("Event added to favorites!");

            await sendRandomEventSuggestions(currentUser.uid, currentUser.email, currentUser.displayName);


        } catch (error) {
            console.error('Error adding event to favorites:', error);
            showNotification("Error adding to favorites. Please try again.", true);
        }
    };
    return (
        <div className="add-options">
            <button
                className={favoritedEvents.includes(event.id) ? 'heartfilled-btn' : 'heart-btn'}
                onClick={(e) => handleHeartClick(e, event)}
            >
                <HeartIcon className="heart-icon" />
                {favoritedEvents.includes(event.id) ? 'Unfavorite' : 'Favorite'}

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
