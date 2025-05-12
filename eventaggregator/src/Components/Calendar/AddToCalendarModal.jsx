import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { firestore } from '../../firebase';
import './AddToCalendarModal.css';

// Function to generate consistent colors based on calendar name
const getColorForCalendar = (calendarName) => {
    const colors = [
        '#FF6B6B', // Red
        '#4ECDC4', // Teal
        '#45B7D1', // Light Blue
        '#FFA600', // Orange
        '#7A77FF', // Purple
        '#36D7B7', // Green
        '#FF9066', // Coral
        '#F25F5C', // Salmon
        '#27AE60', // Emerald
        '#3498DB', // Blue
        '#9B59B6', // Violet
        '#F1C40F'  // Yellow
    ];

    // Simple hash function to get consistent color for the same name
    let hash = 0;
    for (let i = 0; i < calendarName.length; i++) {
        hash = calendarName.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
};

const AddToCalendarModal = ({ isOpen, onClose, event, user, onSuccess, onError }) => {
    const [calendars, setCalendars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCalendar, setSelectedCalendar] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Fetch user's calendars when the modal opens
    useEffect(() => {
        const fetchUserCalendars = async () => {
            if (!user || !isOpen) return;

            try {
                setLoading(true);
                const calendarsCollection = collection(firestore, 'calendars');
                const q = query(calendarsCollection, where("uid", "==", user.uid));
                const querySnapshot = await getDocs(q);

                const userCalendars = querySnapshot.docs.filter(doc => (doc.data().name || 'Unnamed Calendar') !== 'Favorites').map(doc => {
                    const data = doc.data();
                    return {
                        id: data.id || doc.id,
                        name: data.name || 'Unnamed Calendar',
                        firestoreId: doc.id,
                        color: getColorForCalendar(data.name || 'Unnamed Calendar')
                    };
                });

                setCalendars(userCalendars);
                // If there are calendars, preselect the first one
                if (userCalendars.length > 0) {
                    setSelectedCalendar(userCalendars[0].id);
                }
            } catch (error) {
                console.error('Error fetching user calendars:', error);
                setError('Failed to load calendars. Please try again.');
                if (onError) onError('Failed to load calendars. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserCalendars();
    }, [user, isOpen, onError]);

    const handleCalendarSelect = (calendarId) => {
        setSelectedCalendar(calendarId);
    };

    // Function to add the event to a calendar
    const addEventToCalendar = async () => {
        if (!event || !selectedCalendar || !user) {
            setError('Missing required information. Please try again.');
            if (onError) onError('Missing required information. Please try again.');
            return;
        }

        try {
            setSaving(true);
            setError('');

            console.log('Adding event to calendar:', selectedCalendar);
            console.log('Event data:', event);

            // Find the selected calendar document
            const selectedCalendarObj = calendars.find(cal => cal.id === selectedCalendar);
            if (!selectedCalendarObj) {
                throw new Error('Selected calendar not found');
            }

            // Safely get properties with null/undefined checks
            const safeLocation = () => {
                // Convert any non-string values to strings and then check if they're empty
                const address = typeof event.address1 === 'string' ? event.address1 : String(event.address1 || '');
                const city = typeof event.city === 'string' ? event.city : String(event.city || '');
                const state = typeof event.state === 'string' ? event.state : String(event.state || '');
                const zip = typeof event.zipcode === 'string' ? event.zipcode : String(event.zipcode || '');

                const parts = [address, city, state, zip].filter(part => part && part.trim && part.trim() !== '');
                return parts.join(', ');
            };
          
            // Create event data
            const eventData = {
                eventId: event.id || event.eventId || `event-${Date.now()}`,
                title: event.title || 'Unnamed Event',
                description: event.description || '',
                location: safeLocation(),
                date: event.date || new Date().toISOString(),
                price: event.price != null ? event.price : 0,
                eventType: event.eventType || '',
                tags: event.tags || '',
                createdAt: new Date().toISOString(),
            };

            console.log('Formatted event data:', eventData);

            // Update the calendar document to include the new event
            const calendarsCollection = collection(firestore, 'calendars');
            const q = query(
                calendarsCollection,
                where("id", "==", selectedCalendar)
            );

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const calendarDoc = querySnapshot.docs[0];
                const calendarData = calendarDoc.data();

                // Check if events array exists, if not create one
                const alreadyExists = calendarData.eventsData?.includes(event.id);
                if (!alreadyExists) {
                    await updateDoc(doc(firestore, 'calendars', calendarDoc.id), {
                        eventsData: arrayUnion(event.id),
                        // Increment the events count and upcoming count
                        events: (calendarData.events || 0) + 1,
                        upcoming: (calendarData.upcoming || 0) + 1
                    });
                }
                
                console.log('Calendar updated with new event');
            } else {
                throw new Error('Calendar document not found');
            }

            // Call the success callback with the calendar name
            if (onSuccess) {
                onSuccess(selectedCalendarObj.name);
            }

            // Close the modal
            onClose();

        } catch (error) {
            console.error('Error adding event to calendar:', error);
            setError('Failed to add event to calendar. Please try again.');

            // Call the error callback
            if (onError) {
                onError('Failed to add event to calendar. Please try again.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleConfirm = () => {
        addEventToCalendar();
    };

    // Get first letter of calendar name
    const getFirstLetter = (name) => {
        return name.charAt(0).toUpperCase();
    };

    // If the modal isn't open, don't render anything
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="add-to-calendar-modal">
                <h2>Which calendar would you like to add this event to?</h2>

                {loading ? (
                    <div className="loading-spinner">Loading your calendars...</div>
                ) : calendars.length === 0 ? (
                    <div className="no-calendars-message">
                        <p>You don't have any calendars yet.</p>
                        <p>Please create a calendar first in the Calendar section.</p>
                    </div>
                ) : (
                    <div className="calendar-list">
                        {calendars.map(calendar => (
                            <div
                                key={calendar.id}
                                className={`calendar-option ${selectedCalendar === calendar.id ? 'selected' : ''}`}
                                onClick={() => handleCalendarSelect(calendar.id)}
                            >
                                <div
                                    className="calendar-icon"
                                    style={{ backgroundColor: calendar.color }}
                                >
                                    {getFirstLetter(calendar.name)}
                                </div>
                                <div className="calendar-details">
                                    <label htmlFor={`calendar-${calendar.id}`}>
                                        {calendar.name}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div className="error-message" style={{ color: 'red', textAlign: 'center', margin: '10px 0' }}>
                        {error}
                    </div>
                )}

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="confirm-btn"
                        onClick={handleConfirm}
                        disabled={!selectedCalendar || loading || saving}
                    >
                        {saving ? 'Adding...' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddToCalendarModal;
