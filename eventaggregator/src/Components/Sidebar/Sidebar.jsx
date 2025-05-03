import React, { useState, useEffect } from 'react'
import './Sidebar.css'
import { ReactComponent as CalendarIcon } from '../../assets/calendar-icon.svg';
import { ReactComponent as ForumsIcon } from '../../assets/forums-icon.svg';
import { ReactComponent as StarIcon } from '../../assets/star-icon.svg';
import { ReactComponent as TrendIcon } from '../../assets/trend-icon.svg';
import { ReactComponent as ProfileIcon } from '../../assets/profile-icon.svg';
import { ReactComponent as FriendIcon } from '../../assets/friend-icon.svg';
import { ReactComponent as HeartIcon } from '../../assets/heart-icon.svg';
import { ReactComponent as BoltIcon } from '../../assets/bolt-icon.svg';
import { ReactComponent as TriangleIcon } from '../../assets/triangle-icon.svg';
import { Link, useNavigate, createSearchParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import Overlays from '../Overlays';
import { firestore } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Sidebar = ({ sidebar }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [friendRequests, setFriendRequests] = useState(0);

  // Fetch the number of friend requests
  useEffect(() => {
    const fetchFriendRequests = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) return;
      
      try {
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          const requests = userData.incomingFriendRequests || [];
          setFriendRequests(requests.length);
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };
    
    fetchFriendRequests();
    
    // Set up interval to check for new requests periodically
    const interval = setInterval(fetchFriendRequests, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  // Navigates to the forum page with the respective sort 
  function forumLink(sort) {
    navigate({
      pathname: "/forum",
      search: createSearchParams(
        { type: "post", sort: sort}
      ).toString()
    })
  }
  const openModal = (type) => {
    setModalType(type);
    setIsOpen(true);
  };

  const handleProfileClick = () => {
    const auth = getAuth();
    if (auth.currentUser) {
      navigate(`/profile/${getAuth().currentUser.uid}`);
    } else {
      openModal('login');
    }
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
    <>
      <Overlays isOpen={isOpen} modalType={modalType} onClose={() => setIsOpen(false)} />
      <div className={`sidebar ${sidebar ? "" : "small-sidebar"}`}>
        <div className="events">
          <div className="events-dropdown">
            <CalendarIcon className="calendar-icon" /><p>Events</p><TriangleIcon className="triangle-icon" />
          </div>
          <Link to={'/event/category/recommended'}>
            <div className="side-link">
              <StarIcon className="star-icon" /><p> Recommended Events </p>
            </div>
          </Link>
          <Link to={'/'}>
            <div className="side-link">
              <TrendIcon className="trend-icon" /><p>  All Categories </p>
            </div>
          </Link>
          <hr />
        </div>
        <div className="forums">
          <div className="forums-dropdown">
            <ForumsIcon className="forums-icon" /><p>Forums</p><TriangleIcon className="triangle-icon" />
          </div>
          <div className="side-link"
            onClick={() => forumLink("recommended")}
          >
            <StarIcon className="star-icon" /><p>Recommended Posts</p>
          </div>
            <div className="side-link"
              onClick={() => forumLink("hot")}
            >
              <TrendIcon className="trend-icon" /><p>Hottest</p>
            </div>
            <div className="side-link"
            onClick={() => forumLink("latest")}
            >
              <BoltIcon className="bolt-icon" /><p>Latest</p>
            </div>
        </div>
        <hr />
        <div className="profile">
          <div className="profile-dropdown">
            <ProfileIcon className="profile-icon" /><p>Profile</p><TriangleIcon className="triangle-icon" />
          </div>

          <div className="side-link"
            onClick={handleProfileClick}
          >
            <ProfileIcon className="profile-icon" /><p> My Profile </p>
          </div>

          <div className="side-link"
            onClick={handleFriendsClick}
          >
            <FriendIcon className="friend-icon" />
            <p>Friends</p>
            {friendRequests > 0 && (
              <span className="sidebar-request-badge">{friendRequests}</span>
            )}
          </div>
        </div>
        <hr />
        <div className="my-calendars">
          <div className="calendars-dropdown">
            <CalendarIcon className="calendar-icon" />
              <p>My Calendars</p>
            <TriangleIcon className="triangle-icon" />
          </div>
          <div className="side-link" onClick={handleFavoritesClick}>
            <HeartIcon className="heart-icon" />
              <p>Favorites</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
