import { auth } from '../../../firebase'; // Adjusted for your firebase.js location
import UserData from '../../../utils/UserData';
import { useState } from 'react';
import "./About.css"
import EventCard from '../../../Components/Events/EventCard'
const user = auth.currentUser;
const userData = user ? new UserData(user.uid) : null;

// import './About.css'
function About({ editMode, bio, setBio, favorites }) {
    const userFavorites = favorites.eventsData
    const handleBioChange = (e) => {
        setBio(e.target.value);
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
            <div className="profile-friends">
                <h2>Friends (30)</h2>
            </div>
            <hr />
            {/* Display the favorites section if the user has favorited events */}
            <div style={{ display: favorites?.eventsData ? "inline" : "none" }} className="profile-favorites">
                <h2>Favorites {favorites?.eventsData ? `(${favorites.eventsData.length})` : "(0)"}</h2>
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
