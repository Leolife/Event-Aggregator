import React, { useState } from 'react'
import './Calendar.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { ReactComponent as SlidersIcon } from '../../assets/sliders.svg';
import { ReactComponent as SearchIcon } from '../../assets/search-icon.svg';
import image0 from '../../assets/liked.jpg'
import CalendarLayout from '../../Components/Calendar/Calendar_layout';

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
    const [calendars, setCalendars] = useState([
        {
            id: 'favorites',
            name: 'Favorites',
            image: image0,
            events: 0,
            upcoming: 0
        }
    ]);

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

    const handleCreateCalendar = () => {
        if (newCalendarName.trim() && selectedImage) {
            const newCalendar = {
                id: `calendar-${Date.now()}`,
                name: newCalendarName,
                image: selectedImage,
                events: 0,
                upcoming: 0
            };
            
            setCalendars([...calendars, newCalendar]);
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
                                    <input type="text" placeholder='Search Calendars' />
                                    <SlidersIcon className="sliders-icon" />
                                </div>
                            </div>
                            <div className="mycalendars">
                                {calendars.map(calendar => (
                                    <div key={calendar.id} className="calendar-tile">
                                        <div className="img-sizer">
                                            <img src={calendar.image} alt="" />
                                        </div>

                                        <div className="tile-container">
                                            <h2 className="tile-name"> {calendar.name} </h2>
                                            <label className="tile-info"> {calendar.events} Events • {calendar.upcoming} Upcoming </label>
                                        </div>
                                    </div>
                                ))}
                                
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
                        calendarTitle="Favorites" 
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
                                disabled={!newCalendarName.trim() || !selectedImage}
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
