import React, { useState } from 'react';
import './CalendarEventModal.css';
import { doc, updateDoc, arrayRemove, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';

const CalendarEventModal = ({ isOpen, onClose, event, calendarId, onEventDelete, user, onNotification }) => {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    
    if (!isOpen || !event) return null;
    
    // Function to handle event deletion
    const handleDeleteEvent = async () => {
        if (!calendarId || !event || !user) {
            // Use the passed notification handler instead of local state
            onNotification({ show: true, message: "Unable to delete event. Missing required information.", isError: true });
            return;
        }
        
        try {
            // Find the calendar document
            const calendarsCollection = collection(firestore, 'calendars');
            const q = query(
                calendarsCollection,
                where("id", "==", calendarId),
                where("uid", "==", user.uid)
            );
            
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                onNotification({ 
                    show: true, 
                    message: "Calendar not found.", 
                    isError: true 
                });
                return;
            }
            
            // Get the calendar document
            const calendarDoc = querySnapshot.docs[0];
            const calendarDocRef = doc(firestore, 'calendars', calendarDoc.id);
            
            // Get current calendar data
            const calendarData = await getDoc(calendarDocRef);
            const currentData = calendarData.data();
            
            if (!currentData.eventsData) {
                onNotification({ 
                    show: true, 
                    message: "No events found in this calendar.", 
                    isError: true 
                });
                return;
            }
            
            // Find the event to remove
            const eventToRemove = currentData.eventsData.find(e => e.eventId === event.id);
            
            if (!eventToRemove) {
                onNotification({ 
                    show: true, 
                    message: "Event not found in calendar.", 
                    isError: true 
                });
                return;
            }
            
            // Remove the event from the eventsData array
            await updateDoc(calendarDocRef, {
                eventsData: arrayRemove(eventToRemove)
            });
            
            // Decrement the events count and upcoming count
            await updateDoc(calendarDocRef, {
                events: Math.max((currentData.events || 1) - 1, 0),
                upcoming: Math.max((currentData.upcoming || 1) - 1, 0)
            });

            // Close the modal immediately
            onClose();

            // In the case of a successful deletion, show notification through parent
            onNotification({ show: true, message: "Event deleted successfully!", isError: false });
            
            // Hide delete confirmation if deletion is successful
            setShowDeleteConfirmation(false);

            // Notify parent component to refresh events
            if (onEventDelete) {
                onEventDelete(event.id);
            }
            
        } catch (error) {
            console.error("Error deleting event:", error);
            onNotification({ 
                show: true, 
                message: "Failed to delete event. Please try again.", 
                isError: true 
            });
        }
    };
    
    // Format date and location for display
    const formatLocation = () => {
        return event.address1 || "No location specified";
    };
    
    // Get the date and time display
    const dateTimeDisplay = typeof event.formattedDate === 'string' 
        ? event.formattedDate 
        : new Date(event.date).toLocaleString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZoneName: 'short'
        });

    return (
        <div className="event-modal-overlay" onClick={onClose}>
            <div className="event-modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="event-modal-title">{event.title}</h2>
                
                <div className="event-modal-details">
                    <div className="event-detail">
                        <span className="event-icon">📅-</span>
                        <div className="event-info">{dateTimeDisplay}</div>
                    </div>
                    
                    <div className="event-detail">
                        <span className="event-icon">📍-</span>
                        <div className="event-info">{formatLocation()}</div>
                    </div>
                    
                    {event.description && (
                        <div className={`event-detail ${event.description.length > 1000 ? 'description' : ''}`}>
                            <span className="event-icon">📝-</span>
                            <div className="event-info">{event.description}</div>
                        </div>
                    )}
                    
                    {event.price !== undefined && (
                        <div className="event-detail">
                            <span className="event-icon">💰-</span>
                            <div className="event-info">
                                {event.price === 0 ? "Free" : `$${event.price}`}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="event-modal-actions">
                    {!showDeleteConfirmation ? (
                        <button className="delete-btn" onClick={() => setShowDeleteConfirmation(true)}>
                            Delete
                        </button>
                    ) : (
                        <div className="delete-confirmation">
                            <p>Are you sure you want to delete this event?</p>
                            <div className="confirmation-buttons">
                                <button className="cancel-delete-btn" onClick={() => setShowDeleteConfirmation(false)}>
                                    Cancel
                                </button>
                                <button className="confirm-delete-btn" onClick={handleDeleteEvent}>
                                    Confirm
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarEventModal;
