import React, { useState, useEffect, useRef } from 'react'
import './Calendar.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { ReactComponent as SlidersIcon } from '../../assets/sliders.svg';
import { ReactComponent as SearchIcon } from '../../assets/search-icon.svg';
import { ReactComponent as PinIcon } from '../../assets/pushpin-icon.svg';
import image0 from '../../assets/liked.jpg'
import CalendarLayout from '../../Components/Calendar/Calendar_layout';
import { firestore } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, query, where, getDoc, onSnapshot } from 'firebase/firestore';

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
import ContextMenu from '../../Components/ContextMenu/ContextMenu';
import DropArea from '../../Components/DropArea/DropArea';

export const Calendar = ({ sidebar, user }) => {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newPosition, setNewPosition] = useState(null);
    const [newCalendarName, setNewCalendarName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [calendars, setCalendars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCalendar, setSelectedCalendar] = useState(null);
    const [activeTile, setActiveTile] = useState(null);
    const [tempSelectedCalendar, setTempSelectedCalendar] = useState(null);
    const [deleteCalendar, setDeleteCalendar] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const contextMenuRef = useRef(null)
    const [contextMenu, setContextMenu] = useState({
        position: {
            x: 0,
            y: 0
        },
        toggled: false
    })

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

    // Check if a calendar is the Favorites calendar
    const isFavoritesCalendar = (calendar) => {
        return calendar.name === "Favorites" && calendar.isDefault === true;
    };

    // Displays context menu when calendar tile is right clicked
    function handleOnContextMenu(e, rightClickTile) {
        e.preventDefault();
        if (rightClickTile.name !== "Favorites") {
            setTempSelectedCalendar(rightClickTile)
            const contextMenuAttr = contextMenuRef.current.getBoundingClientRect()

            const isLeft = e.clientX < window?.innerWidth / 2
            let x
            let y = e.clientY

            if (isLeft) {
                x = e.clientX
            } else {
                x = e.clientX - contextMenuAttr.width
            }

            setContextMenu({
                position: {
                    x,
                    y
                },
                toggled: true
            })
        }
    }

    // Hides the context menu and sets the tempSelectedCalendar to null
    const resetContextMenu = () => {
        if (!showDeleteModal && !showModal) {
            setTempSelectedCalendar(null)
        }
        setContextMenu({
            position: {
                x: 0,
                y: 0
            },
            toggled: false
        })
    }

    // Hides context menu when the user clicks elsewhere on the screen
    useEffect(() => {
        function handler(e) {
            if (contextMenuRef.current) {
                if (!contextMenuRef.current.contains(e.target)) {
                    resetContextMenu()
                }
            }
        }
        document.addEventListener('click', handler)

        return () => {
            document.removeEventListener('click', handler)
        }

    })


    // Fetch calendars from Firestore when component mounts
    useEffect(() => {
        // Move the function definition inside the effect
        const createFavoritesCalendar = async () => {
            if (!user) return;

            try {
                // Check if a Favorites calendar already exists for this user
                const calendarsCollection = collection(firestore, 'calendars');
                const q = query(
                    calendarsCollection,
                    where("uid", "==", user.uid),
                    where("name", "==", "Favorites"),
                    where("isDefault", "==", true)
                );

                const querySnapshot = await getDocs(q);

                // If Favorites calendar doesn't exist, create it
                if (querySnapshot.empty) {
                    const favoritesCalendar = {
                        id: `favorites-${Date.now()}`,
                        name: "Favorites",
                        image: 0, // Using image0 (liked.jpg)
                        events: 0,
                        upcoming: 0,
                        uid: user.uid,
                        isDefault: true, // Mark as default/system calendar
                        position: 0,
                        pinned: true,
                    };

                    // Save to Firestore
                    await addDoc(collection(firestore, 'calendars'), favoritesCalendar);

                    console.log('Favorites calendar created');
                    return true;
                }

                return false;
            } catch (error) {
                console.error('Error creating Favorites calendar:', error);
                return false;
            }
        };

        const fetchCalendars = async () => {
            try {
                setLoading(true);

                // Make sure we have a user
                if (!user) {
                    setCalendars([]);
                    setLoading(false);
                    return;
                }

                // Ensure Favorites calendar exists
                await createFavoritesCalendar();

                // Fetch all calendars for the user
                const calendarsCollection = collection(firestore, 'calendars');
                const calendarsSnapshot = await getDocs(calendarsCollection);

                const fetchedCalendars = calendarsSnapshot.docs
                    .map(doc => {
                        const data = doc.data();
                        return {
                            id: data.id || doc.id,
                            firestoreId: doc.id, // Store the Firestore document ID
                            name: data.name || 'Unnamed Calendar',
                            image: getImageByNumber(data.image),
                            imageNumber: data.image,
                            events: data.events || 0,
                            upcoming: data.upcoming || 0,
                            uid: data.uid || '',
                            isDefault: data.isDefault || false, // Include the isDefault flag
                            position: data.position || 0,
                            timestamp: data.timestamp ? Math.floor((Date.now() - data.timestamp.toDate()) / 60000) : 0,
                            pinned: data.pinned || false,
                        };
                    })
                    // Filter to only include calendars that belong to the current user
                    .filter(calendar => calendar.uid === user.uid);

                // Sort calendars to put Favorites first
                const sortedCalendars = [...fetchedCalendars].sort((a, b) => a.position - b.position);
                setCalendars(sortedCalendars);

                // Set the first calendar (Favorites) as the selected one if available
                if (sortedCalendars.length > 0) {
                    setSelectedCalendar(sortedCalendars[0]);
                }
            } catch (error) {
                console.error('Error fetching calendars:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCalendars();
    }, [user]);

    // Update calendars locally whenever a change is made
    useEffect(() => {
        const calendarsCollection = collection(firestore, 'calendars');
        const unsubscribe = onSnapshot(calendarsCollection, (snapshot) => {
            const newData = snapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() })).filter(calendar => calendar.uid === user.uid)
            // Set the images properly
            newData.forEach(calendarData => {
                calendarData.imageNumber = calendarData.image
                calendarData.image = getImageByNumber(calendarData.imageNumber)
            })
            setCalendars(newData.sort((a, b) => a.position - b.position))
        });

        return () => unsubscribe();
    }, [user]);


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
            const docRef = await addDoc(calendarsRef, calendarData);
            // Create the new calendar with image object instead of number and attach firestoreId
            const imageNumber = calendarData.image
            const newCalendar = {
                ...calendarData,
                image: getImageByNumber(imageNumber),
                imageNumber: imageNumber,
                firestoreId: docRef.id
            };

            // Add to local state
            setCalendars([...calendars, newCalendar]);

            // Set the newly created calendar as the selected one
            setSelectedCalendar(newCalendar);
            if (newPosition) {
                updateTilePosition(newCalendar, newPosition)
                setNewPosition(null);
            }
            setNewCalendarName('');
            setSelectedImage(null);
            setShowModal(false);
            console.log('Calendar saved to Firestore');
        } catch (error) {
            console.error('Error saving calendar:', error);
        }
    };

    // Function to delete calendar from Firestore
    const deleteCalendarFromFirestore = async (calendarId) => {
        try {
            // Find the calendar document in Firestore
            const calendarsRef = collection(firestore, 'calendars');
            const q = query(calendarsRef,
                where("id", "==", calendarId),
                where("uid", "==", user.uid)
            );

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Check if this is the Favorites calendar
                const calendarDoc = querySnapshot.docs[0];
                const calendarData = calendarDoc.data();

                if (calendarData.name === "Favorites" && calendarData.isDefault === true) {
                    console.error('Cannot delete the Favorites calendar');
                    return false;
                }

                // Delete the document
                await deleteDoc(doc(firestore, 'calendars', calendarDoc.id));
                console.log('Calendar deleted from Firestore');
                return true;
            } else if (selectedCalendar && selectedCalendar.firestoreId) {
                // Try using the stored Firestore ID directly
                const calendarDocRef = doc(firestore, 'calendars', selectedCalendar.firestoreId);
                const calendarDoc = await getDoc(calendarDocRef);

                if (calendarDoc.exists()) {
                    const calendarData = calendarDoc.data();
                    if (calendarData.name === "Favorites" && calendarData.isDefault === true) {
                        console.error('Cannot delete the Favorites calendar');
                        return false;
                    }
                }

                await deleteDoc(calendarDocRef);
                console.log('Calendar deleted from Firestore using firestoreId');
                return true;
            } else {
                console.error('Calendar document not found');
                return false;
            }
        } catch (error) {
            console.error('Error deleting calendar:', error);
            return false;
        }
    };

    const handleCreateCalendar = () => {
        if (newCalendarName.trim() && user) {
            const imageNumber = handleImageForDatabase();
            const pos = calendars.length;
            const newCalendar = {
                id: `calendar-${Date.now()}`,
                name: newCalendarName,
                image: imageNumber,
                events: 0,
                upcoming: 0,
                uid: user.uid,
                isDefault: false, // Regular user-created calendar
                position: pos,
                timestamp: new Date(),
                pinned: false,
            };

            // Save to Firestore
            saveCalendarToFirestore(newCalendar);
            
        }
    };

    const handleCancel = () => {
        setNewCalendarName('');
        setSelectedImage(null);
        setNewPosition(null);
        setShowModal(false);
    };

    const handleDeleteClick = () => {
        if (selectedCalendar) {
            // Check if this is the Favorites calendar
            if (isFavoritesCalendar(selectedCalendar) && !tempSelectedCalendar) {
                alert("The Favorites calendar cannot be deleted.");
                return;
            }
            setDeleteCalendar(selectedCalendar)
            if (tempSelectedCalendar) {
                // Handles deleting the calendar tile if it was right clicked on
                setDeleteCalendar(tempSelectedCalendar)
                resetContextMenu()
            }
            setShowDeleteModal(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedCalendar) {
            // Double-check that we're not trying to delete Favorites calendar
            if (isFavoritesCalendar(deleteCalendar)) {
                alert("The Favorites calendar cannot be deleted.");
                setShowDeleteModal(false);
                return;
            }
            const success = await deleteCalendarFromFirestore(deleteCalendar.id);

            if (success) {
                // Update the local state
                const updatedCalendars = calendars.filter(cal => cal.id !== deleteCalendar.id);
                setCalendars(updatedCalendars);

                // Set a new selected calendar or null if none left
                if (updatedCalendars.length > 0) {
                    setSelectedCalendar(updatedCalendars[0]);
                } else {
                    setSelectedCalendar(null);
                }
            }
            setShowDeleteModal(false);
            setDeleteCalendar(null);
            setTempSelectedCalendar(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    // Function to handle clicking on a calendar tile
    const handleCalendarSelect = (calendar) => {
        setSelectedCalendar(calendar);
    };

    // Function to filter calendars based on search term
    const filteredCalendars = calendars.filter(calendar =>
        calendar.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Function to update the calendar in the database 
    const updateCalendar = async (calendar, field, newValue) => {
        try {
            const calendarDocRef = doc(firestore, 'calendars', calendar.firestoreId)
            await updateDoc(calendarDocRef, {
                [field]: newValue,
            });
        } catch (error) {
            console.error('Error updating Calendar:', error);
        }
    }


    // Handles positioning the calendar tile when the user drags and drops it into a new spot
    const updateTilePosition = (tile, position) => {
        const updatedCalendars = calendars.filter((_, index) => index !== tile.position) // Removes the dragged calendar tile from the calendars list
        updatedCalendars.splice(position, 0, { // Inserts it into its respective position while adjusting the positions of the other calendar tiles as well
            ...tile
        })
        updatedCalendars.map((calendar, index) => (
            updateCalendar(calendar, "position", index)
        ))
    }

    const onDrop = (position) => {
        updateTilePosition(calendars[activeTile], position)
        setActiveTile(null)
    }


    // Function to handle displaying the edits form
    const handleEditDetails = () => {
        if (tempSelectedCalendar) {
            setNewCalendarName(tempSelectedCalendar.name)
            setSelectedImage(getImageByNumber(tempSelectedCalendar.imageNumber))
            setShowModal(true)
            // Hide the context menu without setting tempSelectedCalendar to null
            setContextMenu({
                position: {
                    x: 0,
                    y: 0
                },
                toggled: false
            })
        }
    }

    // Function to handle saving edits made to the calendar tile
    const handleSaveEdits = () => {
        updateCalendar(tempSelectedCalendar, "name", newCalendarName)
        if (selectedImage) {
            const imageNumber = handleImageForDatabase();
            updateCalendar(tempSelectedCalendar, "image", imageNumber)
        }
        setNewCalendarName('');
        setSelectedImage(null);
        setShowModal(false)
    }

    // Function to handle pinning a calendar tile
    const handlePin = () => {
        if (!tempSelectedCalendar.pinned) {
            // If the tile is to be pinned, place it after the farthest pinned tile
            const pinnedCalendars = calendars.filter((calendar) => calendar.pinned === true)
            const farthestPinned = Math.max(...pinnedCalendars.map(calendar => calendar.position)) + 1
            updateTilePosition(tempSelectedCalendar, farthestPinned)
        }
        updateCalendar(tempSelectedCalendar, "pinned", !tempSelectedCalendar.pinned)
        resetContextMenu()
    }

    // Function to handle creating calendar at the selected position
    const handleCreateCalendarAtPos = () => {
        if (tempSelectedCalendar) {
            setNewPosition(tempSelectedCalendar.position + 1)
            setShowModal(true)
            // Hide the context menu without setting tempSelectedCalendar to null
            setContextMenu({
                position: {
                    x: 0,
                    y: 0
                },
                toggled: false
            })
        }
    }

    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className={`container ${sidebar ? "" : 'large-container'}`}>
                <div className="calendar">
                    <div className="mycalendars-overlay" style={{ opacity: activeTile ? 0.5 : 0 }} ></div>
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
                            <div className="mycalendars">   {/* My Calendars Section */}
                                {loading ? (
                                    <div>Loading calendars...</div>
                                ) : filteredCalendars.length === 0 ? (
                                    <div>No calendars found. Create one to get started!</div>
                                ) : (
                                    calendars.map((calendar, index) => (
                                        // Calendar Tile
                                        <>
                                            <div
                                                key={calendar.id}
                                                className={`calendar-tile ${selectedCalendar && selectedCalendar.id === calendar.id ? 'selected-calendar' : ''}`}
                                                onClick={() => handleCalendarSelect(calendar)}
                                                onContextMenu={(e) => handleOnContextMenu(e, calendar)}
                                                draggable={calendar.name !== "Favorites" ? true : false}
                                                onDragStart={() => setActiveTile(calendar.position)}
                                                onDragEnd={() => setActiveTile(null)}
                                                style={{ zIndex: activeTile === calendar.position ? 2 : 0 }}
                                            >
                                                <div className="img-sizer">
                                                    <img src={calendar.image} draggable="false" alt="" />
                                                </div>

                                                <div className="tile-container">
                                                    <h2 className="tile-name"> {calendar.name} </h2>
                                                    <span className='tile-info-section'>
                                                        {/* Display Pin Icon if the calendar is pinned */}
                                                        <PinIcon style={{ display: calendar.pinned ? "inline" : "none" }} />
                                                        <label className="tile-info">
                                                            {calendar.events} Events • {calendar.upcoming} Upcoming
                                                        </label>
                                                    </span>
                                                </div>
                                            </div>
                                            <DropArea activeTile={calendars[activeTile]} index={index} onDrop={(pos) => onDrop(pos)} />
                                        </>
                                    ))
                                )}
                                <ContextMenu
                                    contextMenuRef={contextMenuRef}
                                    isToggled={contextMenu.toggled}
                                    positionX={contextMenu.position.x}
                                    positionY={contextMenu.position.y}
                                    buttons={[
                                        {
                                            text: "Edit details",
                                            icon: "✏️",
                                            onClick: handleEditDetails,
                                            isSpacer: false
                                        },
                                        {
                                            text: "Delete",
                                            icon: "🗑️",
                                            onClick: handleDeleteClick,
                                        },
                                        {
                                            isSpacer: true
                                        },
                                        {
                                            text: "Create Calendar",
                                            icon: "➕",
                                            onClick: handleCreateCalendarAtPos,
                                        },
                                        {
                                            text: tempSelectedCalendar?.pinned ? "Unpin Calendar" : "Pin Calendar",
                                            icon: "📌",
                                            onClick: handlePin,
                                        },
                                        {
                                            isSpacer: true
                                        },
                                        {
                                            text: "Export",
                                            icon: "➦",
                                            onClick: () => window.open('https://open.spotify.com/playlist/1H163taKSeBERTtCu3R7bp'),
                                        },
                                    ]}
                                />

                                <div
                                    className="new-calendar-button"
                                    onClick={() => setShowModal(true)}
                                >
                                    New Calendar
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="calendar-section">   {/* This is where the calendar to be displayed is chosen */}
                        <CalendarLayout
                            calendarTitle={selectedCalendar ? selectedCalendar.name : "Calendar"}
                            calendarId={selectedCalendar ? selectedCalendar.id : null}
                            onChangeMonth={(newDate) => console.log('Month changed:', newDate)}
                            onDelete={handleDeleteClick}
                            isDefaultCalendar={selectedCalendar && isFavoritesCalendar(selectedCalendar)}
                            user={user}
                        />
                    </div>
                </div>
            </div>

            {/* New Calendar Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{tempSelectedCalendar && !newPosition ? "Edit Calendar" : "Create New Calendar"}</h2>

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
                                onClick={tempSelectedCalendar && !newPosition ? handleSaveEdits : handleCreateCalendar} // Determines whether this button saves edits or creates a new calendar
                                disabled={!newCalendarName.trim() || !selectedImage || !user}
                            >
                                {tempSelectedCalendar && !newPosition ? "Save" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="delete-modal-content">
                        <h2>Delete Calendar</h2>
                        <p>Are you sure you want to delete this calendar?</p>
                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={handleCancelDelete}
                            >
                                Cancel
                            </button>
                            <button
                                className="delete-confirm-btn"
                                onClick={handleConfirmDelete}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Calendar;
