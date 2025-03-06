import React, { useState, useEffect } from 'react'
import './Calendar.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { ReactComponent as SlidersIcon } from '../../assets/sliders.svg';
import { ReactComponent as SearchIcon } from '../../assets/search-icon.svg';
import image0 from '../../assets/liked.jpg'
import CalendarLayout from '../../Components/Calendar/Calendar_layout';
import { firestore } from '../../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

// Import sample images for new calendars
import image1 from '../../assets/thumbnail1.png'
import image2 from '../../assets/thumbnail2.jpg'
import image3 from '../../assets/thumbnail3.png'
import image4 from '../../assets/thumbnail4.jpg'
import image5 from '../../assets/thumbnail5.png'
import image6 from '../../assets/thumbnail6.png'
import image7 from '../../assets/thumbnail7.jpg'
import image8 from '../../assets/thumbnail8.png'
import image9 from '../../assets/thumbnail9.jpg'
import image10 from '../../assets/thumbnail10.png'
import image11 from '../../assets/thumbnail11.jpg'
import image12 from '../../assets/thumbnail12.png'

export const Calendar = ({ sidebar, user }) => {
    const [showModal, setShowModal] = useState(false);
    const [newCalendarName, setNewCalendarName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [calendars, setCalendars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCalendar, setSelectedCalendar] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Function to map image number from database to actual image
    const getImageByNumber = (imageNumber) => {
        const imageMap = {
            0: image0,
            1: image1,
            2: image2,
            3: image3,
            4: image4,
            5: image5,
            6: image6,
            7: image7,
            8: image8,
            9: image9,
            10: image10,
            11: image11,
            12: image12
        };
        return imageMap[imageNumber] || image0; // Default to image0 if not found
    };

    // Fetch calendars from Firestore when component mounts
    useEffect(() => {
        const fetchCalendars = async () => {
            try {
                setLoading(true);
                
                // Make sure we have a user
                if (!user) {
                    setCalendars([]);
                    setLoading(false);
                    return;
                }
                
                const calendarsCollection = collection(firestore, 'calendars');
                const calendarsSnapshot = await getDocs(calendarsCollection);
                
                const fetchedCalendars = calendarsSnapshot.docs
                    .map(doc => {
                        const data = doc.data();
                        return {
                            id: data.id || doc.id,
                            name: data.name || 'Unnamed Calendar',
                            image: getImageByNumber(data.image),
                            events: data.events || 0,
                            upcoming: data.upcoming || 0,
                            uid: data.uid || ''
                        };
                    })
                    // Filter to only include calendars that belong to the current user
                    .filter(calendar => calendar.uid === user.uid);
                
                setCalendars(fetchedCalendars);
                
                // Set the first calendar as the selected one if available
                if (fetchedCalendars.length > 0) {
                    setSelectedCalendar(fetchedCalendars[0]);
                }
            } catch (error) {
                console.error('Error fetching calendars:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCalendars();
    }, [user]); // Add user as a dependency so this runs when the user changes

    // Sample images for the modal
    const calendarImages = [
        { id: 'img1', src: image1 },
        { id: 'img2', src: image2 },
        { id: 'img3', src: image3 },
        { id: 'img4', src: image4 },
        { id: 'img5', src: image5 },
        { id: 'img6', src: image6 },
        { id: 'img7', src: image7 },
        { id: 'img8', src: image8 },
        { id: 'img9', src: image9 },
        { id: 'img10', src: image10 },
        { id: 'img11', src: image11 },
        { id: 'img12', src: image12 }
    ];

    const handleImageForDatabase = () => {
        if (selectedImage === image0) return 0;
        else if (selectedImage === image1) return 1;
        else if (selectedImage === image2) return 2;
        else if (selectedImage === image3) return 3;
        else if (selectedImage === image4) return 4;
        else if (selectedImage === image5) return 5;
        else if (selectedImage === image6) return 6;
        else if (selectedImage === image7) return 7;
        else if (selectedImage === image8) return 8;
        else if (selectedImage === image9) return 9;
        else if (selectedImage === image10) return 10;
        else if (selectedImage === image11) return 11;
        else if (selectedImage === image12) return 12;
    }

    // Function to save calendar to Firestore
    const saveCalendarToFirestore = async (calendarData) => {
        try {
            const calendarsRef = collection(firestore, 'calendars');
            await addDoc(calendarsRef, calendarData);
            console.log('Calendar saved to Firestore');
        } catch (error) {
            console.error('Error saving calendar:', error);
        }
    };

    const handleCreateCalendar = () => {
        if (newCalendarName.trim() && user) {
            const imageNumber = handleImageForDatabase();
            
            const newCalendar = {
                id: `calendar-${Date.now()}`,
                name: newCalendarName,
                image: imageNumber,
                events: 0,
                upcoming: 0,
                uid: user.uid
            };
            
            // Save to Firestore
            saveCalendarToFirestore(newCalendar);
            
            // Create the new calendar with image object instead of number
            const newCalendarWithImage = {
                ...newCalendar,
                image: getImageByNumber(imageNumber)
            };
            
            // Add to local state
            setCalendars([...calendars, newCalendarWithImage]);
            
            // Set the newly created calendar as the selected one
            setSelectedCalendar(newCalendarWithImage);
            
            setNewCalendarName('');
            setSelectedImage(null);
            setShowModal(false);
        }
    };

    const handleCancel = () => {
        setNewCalendarName('');
        setSelectedImage(null);
        setShowModal(false);
    };

    // Function to handle clicking on a calendar tile
    const handleCalendarSelect = (calendar) => {
        setSelectedCalendar(calendar);
    };

    // Function to filter calendars based on search term
    const filteredCalendars = calendars.filter(calendar => 
        calendar.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className={`container ${sidebar ? "" : 'large-container'}`}>
                <div className="calendar">
                    <div className="mycalendars-section">
                        <div className="mycalendars-container">
                            <div className="mycalendars-header">
                                <h1> My Calendars </h1>
                                <div className="search-box flex-div">
                                    <SearchIcon className="search-icon" />
                                    <input 
                                        type="text" 
                                        placeholder='Search Calendars' 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <SlidersIcon className="sliders-icon" />
                                </div>
                            </div>
                            <div className="mycalendars">
                                {loading ? (
                                    <div>Loading calendars...</div>
                                ) : filteredCalendars.length === 0 ? (
                                    <div>No calendars found. Create one to get started!</div>
                                ) : (
                                    filteredCalendars.map(calendar => (
                                        <div 
                                            key={calendar.id} 
                                            className={`calendar-tile ${selectedCalendar && selectedCalendar.id === calendar.id ? 'selected-calendar' : ''}`}
                                            onClick={() => handleCalendarSelect(calendar)}
                                        >
                                            <div className="img-sizer">
                                                <img src={calendar.image} alt="" />
                                            </div>

                                            <div className="tile-container">
                                                <h2 className="tile-name"> {calendar.name} </h2>
                                                <label className="tile-info"> {calendar.events} Events • {calendar.upcoming} Upcoming </label>
                                            </div>
                                        </div>
                                    ))
                                )}
                                
                                <div 
                                    className="new-calendar-button" 
                                    onClick={() => setShowModal(true)}
                                >
                                    New Calendar
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="calendar-section">
                        <CalendarLayout 
                            calendarTitle={selectedCalendar ? selectedCalendar.name : "Calendar"}
                            onChangeMonth={(newDate) => console.log('Month changed:', newDate)} 
                        />
                    </div>
                </div>
            </div>

            {/* New Calendar Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Create New Calendar</h2>
                        
                        <div className="modal-input-group">
                            <label htmlFor="calendar-name">Calendar Name</label>
                            <input 
                                type="text" 
                                id="calendar-name"
                                value={newCalendarName}
                                onChange={(e) => setNewCalendarName(e.target.value)}
                                placeholder="Enter calendar name"
                            />
                        </div>
                        
                        <div className="modal-image-selection">
                            <h3>Select an Image</h3>
                            <div className="image-grid">
                                {calendarImages.map(image => (
                                    <div 
                                        key={image.id}
                                        className={`image-option ${selectedImage === image.src ? 'selected' : ''}`}
                                        onClick={() => setSelectedImage(image.src)}
                                    >
                                        <img src={image.src} alt="" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="modal-actions">
                            <button 
                                className="cancel-btn"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button 
                                className="create-btn"
                                onClick={handleCreateCalendar}
                                disabled={!newCalendarName.trim() || !selectedImage || !user}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Calendar;
