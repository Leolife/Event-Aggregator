import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import "./About.css"
import EventCard from '../../../Components/Events/EventCard'
import Overlays from '../../../Components/Overlays';

function About({ editMode, bio, setBio, favorites }) {
    const navigate = useNavigate();
    const userFavorites = favorites.eventsData
    const handleBioChange = (e) => {
        setBio(e.target.value);
    };

    // modal control for editing mode
    const [modalType, setModalType] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const openModal = (type) => {
        setModalType(type);
        setIsOpen(true);
    };

    const handleFriendsClick = () => {
        const auth = getAuth();
        if (auth.currentUser) {
            navigate('/Friends');
        } else {
            openModal('login')
        }
    };

    const handleFavoritesClick = () => {
        const auth = getAuth();
        if (auth.currentUser) {
            navigate('/mycalendars');
        } else {
            openModal('login')
        }
    };

    return (
        <><Overlays isOpen={isOpen} modalType={modalType} onClose={() => setIsOpen(false)} />
        <div className="About">
            <h2>About</h2>
            {editMode ? (
                <textarea className="userBioChange"
                    value={bio}
                    onChange={handleBioChange}
                    rows="5"
                    cols="50"
                />
            ) : (
                <p className="userBio">{bio}</p>
            )}
            <hr />
            <div className="profile-friends" onClick={handleFriendsClick} >
                <h2>Friends</h2> 
            </div>
            <hr />
            {/* Display the favorites section if the user has favorited events */}
            <div style={{ display: favorites?.eventsData ? "inline" : "none" }} className="profile-favorites">
                <div className="profile-favorites-button" onClick={handleFavoritesClick}> 
                    <h2>Favorites</h2>
                </div>
                <div className="favorites-container">
                    {userFavorites && userFavorites.length > 0 ? (
                        userFavorites.map((event) => (
                            <EventCard event={event}> </EventCard>
                        ))
                    ) : (
                        // Displays an error message if the events have not loaded in
                        <label> Error Loading Events </label>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}

export default About;
