import React, { useState, useEffect } from 'react';
import '../../App.css';
import './Navbar.css';
import { ReactComponent as MenuIcon } from '../../assets/menu-icon.svg';
import { ReactComponent as SearchIcon } from '../../assets/search-icon.svg';
import { ReactComponent as ProfileIcon } from '../../assets/profile-icon.svg';
import { ReactComponent as SettingsIcon } from '../../assets/settings.svg';
import { ReactComponent as SlidersIcon } from '../../assets/sliders.svg';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import logo from '../../assets/logo-text.png';
import Overlays from '../Overlays';

const Navbar = ({ setSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const navigate = useNavigate();


  const openModal = (type) => {
    setModalType(type);
    setIsOpen(true);
    // Purely Debugging information for the user state
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
  
  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      openModal('login');
    }
  }

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // `true` if user exists, `false` otherwise
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <>
      <Overlays isOpen={isOpen} modalType={modalType} onClose={() => setIsOpen(false)} />
      <nav className='flex-div'>
        <div className='nav-left flex-div'>
          <MenuIcon className="menu-icon" onClick={() => setSidebar(prev => prev === false ? true : false)} />
          <Link to={'/'}><img className='logo' src={logo} alt="" /></Link>
          <h3>Events</h3>
          <h3><Link to={'/Forum'} style={{ color: 'inherit'}}> Forum </Link></h3>
          <h3 onClick={handleProfileClick} >Profile</h3>
        </div>
        <div className="nav-middle flex-div">
          <div className="search-box flex-div">
            <SearchIcon className="search-icon" />
            <input type="text" placeholder='Search' />
            <SlidersIcon className="sliders-icon" onClick={() => openModal('filters')} />
          </div>

        </div>

        <div className="nav-right flex-div">
          <Link to={'/debug'}><button class="button userdebug">UserDebug</button>
          </Link>

          <div className="user-login">
            {!isLoggedIn && (
              <>
                <button className="button log-in" onClick={() => {openModal('login')}}>
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
                <button className="button sign-up" onClick={() => {openModal('logout')}}> 
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
