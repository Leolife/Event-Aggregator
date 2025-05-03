import { auth } from '../../../firebase'; // Adjusted for your firebase.js location
import UserData from '../../../utils/UserData';
import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import "./About.css"
import EventCard from '../../../Components/Events/EventCard'
const user = auth.currentUser;
const userData = user ? new UserData(user.uid) : null;

// import './About.css'
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

    return (
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
                <div className="profile-favorites-button"> 
                    <Link to={'/mycalendars'}>
                    <h2>Favorites</h2>
                    </Link>
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
    );
}

export default About;
