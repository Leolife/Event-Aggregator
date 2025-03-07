import React, { useState, useEffect, useRef } from 'react';
import '../../App.css';
import './Navbar.css';
import { ReactComponent as MenuIcon } from '../../assets/menu-icon.svg';
import { ReactComponent as SearchIcon } from '../../assets/search-icon.svg';
import { ReactComponent as ProfileIcon } from '../../assets/profile-icon.svg';
import { ReactComponent as SettingsIcon } from '../../assets/settings.svg';
import { ReactComponent as SlidersIcon } from '../../assets/sliders.svg';
import { ReactComponent as XCircle } from '../../assets/x-circle.svg';
import { createSearchParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { fetchForumEvents } from '../../Pages/Forum/ForumPosts';
import logo from '../../assets/logo-text.png';
import Overlays from '../Overlays';



const Navbar = ({ setSidebar }) => {
  // Whether the dropdown is active or not
  const [searchParams] = useSearchParams();
  const [isActive, setActive] = useState(false);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const navigate = useNavigate();
  const typeParam = searchParams.get('type');
  const sortParam = searchParams.get('sort');
  const timeParam = searchParams.get('t');
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

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
    const auth = getAuth();
    // Check if the user is logged in before accessing uid
    if (auth.currentUser) {
      console.log("User:", auth.currentUser);
      console.log("User UID:", auth.currentUser.uid);
    } else {
      console.log("No user is currently signed in.");
      // Handle the case when no user is signed in, e.g., show a login modal or a message
    }
  }

  function forumNav() {
    navigate({
      pathname: "forum",
      search: createSearchParams(
        Object.fromEntries(Object.entries({ q: query, type: typeParam, sort: sortParam, t: timeParam }).filter(([_, v]) => v != null))
      ).toString()
    })
  }

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      openModal('login');
    }
  }

  useEffect(() => {
    let sortedEvents = [...events];
    sortedEvents = events.filter(e =>
      e.eventName.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredEvents(sortedEvents);
    console.log(query)
    console.log(filteredEvents)
    if (query == "") {
      document.getElementById("search").value = ""
      forumNav()
    }
  }, [query])
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // `true` if user exists, `false` otherwise
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  let queryRef = useRef(null);

  useEffect(() => {
    let handler = (e) => {
      if (!queryRef.current.contains(e.target)) {
        setActive(false);
      }
    };
    document.addEventListener("mousedown", handler)
  });

  return (
    <>
      <Overlays isOpen={isOpen} modalType={modalType} onClose={() => setIsOpen(false)} />
      <nav className='flex-div'>
        <div className='nav-left flex-div'>
          <MenuIcon className="menu-icon" onClick={() => setSidebar(prev => prev === false ? true : false)} />
          <Link to={'/'}><img className='logo' src={logo} alt="" /></Link>
          <a className="nav-menu-title" >Events</a>
          <a className="nav-menu-title"><Link to={'/forum'} style={{ color: 'inherit' }}> Forum </Link></a>
          <a className="nav-menu-title" onClick={handleProfileClick} >Profile</a>
        </div>
        <div className="nav-middle flex-div">
          <div className="dropdown-search" ref={queryRef}>
            <div className="search-box flex-div">
              <SearchIcon className="search-icon" />
              <input autocomplete="off" id="search" type="text" placeholder='Search'
                onInput={e => setQuery(e.target.value) & setActive(e.target.value.length > 0)}
                onMouseDown={() => setActive(query.length > 0)}
              />
              <XCircle className="x-circle"
                style={{
                  visibility: isActive ? "visible" : "hidden",
                }}
                onClick={() => setQuery("") & setActive(false)} />
            </div>
            {isActive &&
              <div className="dropdown-content">
                <ul>
                  <li className="dropdown-item">
                    <a className="search-events" onClick={() => setActive(false)}>
                      <span className="list-option-text"> {query} </span>
                      <span className="list-option-suffix"> in Events </span>
                    </a>
                  </li>

                  <li className="dropdown-item" onClick={() =>
                    forumNav()
                    & setActive(false)} >
                    <a className="search-forums">
                      <span className="list-option-text"> {query} </span>
                      <span className="list-option-suffix"> in Forums </span>
                    </a>
                  </li>
                  {filteredEvents.map((event, index) => (
                    <li className="dropdown-item"  key={index} value={index} onClick={() =>
                      forumNav()
                      & setActive(false)} >
                      <a className="search-forums">
                        <span className="list-option-event-name"> {event.eventName} </span>
                        <span className="list-option-suffix"> in Forums </span>
                      </a>
                    </li>
                  ))}


                </ul>
              </div>
            }
          </div>
        </div>

        <div className="nav-right flex-div">
          <Link to={'/debug'}><button class="button userdebug">UserDebug</button>
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
                <button className="button sign-up" onClick={() => { openModal('logout') }}>
                  Log out
                </button>
              </>
            )}
          </div>

          <Overlays modalType={modalType} isOpen={isOpen} onClose={() => setIsOpen(false)} />
          <ProfileIcon className="profile-icon" />

          <Link to={'/settings'}><SettingsIcon className="settings-icon"></SettingsIcon></Link>
        </div>
      </nav>
    </>
  )
}

export default Navbar
