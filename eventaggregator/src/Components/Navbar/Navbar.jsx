import React, { useState, useEffect, useRef } from 'react';
import '../../App.css';
import './Navbar.css';
import UserData from '../../utils/UserData';
import { ReactComponent as MenuIcon } from '../../assets/menu-icon.svg';
import { ReactComponent as SearchIcon } from '../../assets/search-icon.svg';
import { ReactComponent as ProfileIcon } from '../../assets/profile-icon.svg';
import { ReactComponent as SettingsIcon } from '../../assets/settings.svg';
import { ReactComponent as ForumIcon } from '../../assets/forum-search-icon.svg';
import { ReactComponent as EventIcon } from '../../assets/event-search-icon.svg';
import { ReactComponent as XCircle } from '../../assets/x-circle.svg';
import { createSearchParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { fetchForumEvents } from '../../Pages/Forum/ForumPosts';
import logo from '../../assets/logo-text.png';
import Overlays from '../Overlays';
import NotificationDropdown from '../../Components/Notification/NotificationDropdown.jsx';




const Navbar = ({ setSidebar }) => {
  // Whether the dropdown is active or not
  const [searchParams] = useSearchParams();
  const [isActive, setActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const navigate = useNavigate();
  const typeParam = searchParams.get('type');
  const sortParam = searchParams.get('sort');
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [profilePicture, setProfilePicture] = useState("");
  const [username, setUsername] = useState("");
  const auth = getAuth();

  // Fetches event names attached to the forums
  useEffect(() => {

    const loadEvents = async () => {
      const fetchedEvents = await fetchForumEvents();
      setEvents(fetchedEvents);
    };
    loadEvents();
  }, []);


  const openModal = (type) => {
    setModalType(type);
    setIsOpen(true);

    // Below is Purely Debugging information for the user state (not critical for openModal)

    // Check if the user is logged in before accessing uid
    if (auth.currentUser) {
      console.log("User:", auth.currentUser);
      console.log("User UID:", auth.currentUser.uid);
    } else {
      console.log("No user is currently signed in.");
      // Handle the case when no user is signed in, e.g., show a login modal or a message
    }
  }


  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate(`/profile/${auth.currentUser.uid}`);
    } else {
      openModal('login');
    }
  }



  // Populates the search dropdown with event name suggestions
  useEffect(() => {
    let sortedEvents = [...events];
    sortedEvents = events.filter(e =>
      e.toLowerCase().startsWith(searchText.toLowerCase())
    )
    setFilteredEvents(sortedEvents);
  }, [searchText, events])

  function forumNav(query) {
    navigate({
      pathname: "forum",
      search: createSearchParams(
        Object.fromEntries(Object.entries({ q: query, type: typeParam, sort: sortParam }).filter(([_, v]) => v != null)) // If any of these parameters are empty, then don't include them
      ).toString()
    })
  }

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoggedIn(!!user); // `true` if user exists, `false` otherwise
      if (user) {
        const userData = new UserData(user.uid);
        const picture = await userData.getProfilePicture();
        const username = await userData.getName();
        setProfilePicture(picture)
        setUsername(username)
      }
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Closes the search dropdown if the user clicks anywhere else on the screen
  let queryRef = useRef(null);
  useEffect(() => {
    let handler = (e) => {
      if (queryRef.current && !queryRef.current.contains(e.target)) {
        setActive(false);
      }
    };
    document.addEventListener("mousedown", handler)
  });

  return (
    <>
      <Overlays isOpen={isOpen} modalType={modalType} onClose={() => setIsOpen(false)} />
      <nav className='nav-bar'>
        <div className='nav-left '>
          <MenuIcon className="menu-icon" onClick={() => setSidebar(prev => prev === false ? true : false)} />
          <Link to={'/'}><img className='logo' src={logo} alt="" /></Link>
          <div className="nav-menu-link-container">
            <a href={() => false} className="nav-menu-link"><Link to={'/'} style={{ color: 'inherit' }}>Events</Link></a>
            <a href={() => false} className="nav-menu-link"><Link to={'/forum'} style={{ color: 'inherit' }}> Forum </Link></a>
            <a href={() => false} className="nav-menu-link" onClick={handleProfileClick} >Profile</a>
          </div>
        </div>
        <div className="nav-middle">
          <div className="dropdown-search" ref={queryRef}>
            <div className="search-box">
              <SearchIcon className="search-icon" />
              <input autoComplete="off" id="search" type="text" placeholder='Search'
                onInput={e => setSearchText(e.target.value) & setActive(e.target.value.length > 0)}  // If the user has typed into the search, display the dropdown
                value={searchText}
                onMouseDown={() => setActive(searchText.length > 0)}
              />
              <XCircle className="x-circle"   // Button to delete the search query 
                style={{
                  visibility: isActive ? "visible" : "hidden",  // Only displays when the user has typed something
                }}
                onClick={() => setSearchText("") & setActive(false)} />
            </div>
            {isActive &&
              <div className="dropdown-content">
                <ul>
                  <li className="dropdown-item">
                    {/* Search in events */}
                    <a href={() => false} className="dropdown-anchor" onClick={() => setActive(false)}>
                      <span className="dropdown-icons"> <EventIcon className="event-icon" /> </span>
                      <span className="list-option-text"> {searchText} </span>
                      <span className="list-option-suffix"> in Events </span>
                    </a>
                  </li>

                  <li className="dropdown-item" onClick={() =>
                    forumNav(searchText)
                    & setActive(false)} >
                    {/* Search in forums */}
                    <a href={() => false} className="dropdown-anchor">
                      <span className="dropdown-icons"> <ForumIcon className="forum-icon" /> </span>
                      <span className="list-option-text"> {searchText} </span>
                      <span className="list-option-suffix"> in Forums </span>
                    </a>
                  </li>
                  {filteredEvents.slice(0, 3).map((event, index) => ( // Recommends 3 event names that best match the search query in search dropdown
                    <li className="dropdown-item" key={index} value={index} onClick={() =>
                      setSearchText(event)
                      & forumNav(event)
                      & setActive(false)} >
                      <a href={() => false} className="dropdown-anchor">
                        <span className="dropdown-icons"> <ForumIcon className="forum-icon" /> </span>
                        <span className="list-option-event-name"> {event} </span>
                        <span className="list-option-suffix"> in Forums </span>
                      </a>
                    </li>
                  ))}


                </ul>
              </div>
            }
          </div>
        </div>

        <div className="nav-right">
          <Link to={'/debug'}><button className="button userdebug">UserDebug</button>
          </Link>

          <div className="user-login">
            {!isLoggedIn && (
              <>
                <button className="button log-in" onClick={() => { openModal('login') }}>
                  Login
                </button>
              </>
            )}
            {!isLoggedIn && (
              <>
                <button className="button sign-up" onClick={() => openModal('signup')}>
                  Sign Up
                </button>
              </>
            )}
            {isLoggedIn && (
              <>
                <button className="button log-out" onClick={() => { openModal('logout') }}>
                  Log out
                </button>
              </>
            )}
          </div>
          {isLoggedIn && (
            <NotificationDropdown />
          )}


          <Overlays modalType={modalType} isOpen={isOpen} onClose={() => setIsOpen(false)} />
            {/* If the user is logged in, replace the default profile icon with their profile picture */}
          {profilePicture ? (
            <div className='nav-user-container'>
              <div className="nav-profile-picture-container">
                <img
                  // Display user's profile picture
                  className="nav-profile-picture"
                  src={profilePicture}
                  alt="Profile Picture"
                />

              </div>
              <label className='nav-profile-name'> {username} </label>
            </div>
          ) : (
            // Display default profile icon
            <ProfileIcon className="profile-icon" />
          )}

          <Link to={'/settings'}><SettingsIcon className="settings-icon" style={{ "display": isLoggedIn ? "inline" : "none" }}></SettingsIcon></Link>
        </div>
      </nav>
    </>
  )
}

export default Navbar
