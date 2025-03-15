import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
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

const AddToCalendarModal = ({ isOpen, onClose, event, user }) => {
    const [calendars, setCalendars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCalendar, setSelectedCalendar] = useState(null);

    // Fetch user's calendars when the modal opens
    useEffect(() => {
        const fetchUserCalendars = async () => {
            if (!user || !isOpen) return;

            try {
                setLoading(true);
                const calendarsCollection = collection(firestore, 'calendars');
                const q = query(calendarsCollection, where("uid", "==", user.uid));
                const querySnapshot = await getDocs(q);
                
                const userCalendars = querySnapshot.docs.map(doc => {
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
            } finally {
                setLoading(false);
            }
        };

        fetchUserCalendars();
    }, [user, isOpen]);

    const handleCalendarSelect = (calendarId) => {
        setSelectedCalendar(calendarId);
    };

    const handleConfirm = () => {
        // Just close the modal as requested
        // The actual confirmation functionality will be implemented later
        onClose();
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
                
                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button 
                        className="confirm-btn" 
                        onClick={handleConfirm}
                        disabled={!selectedCalendar || loading}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddToCalendarModal;
