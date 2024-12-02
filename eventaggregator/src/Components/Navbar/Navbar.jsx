import React, { useState } from 'react';
import '../../App.css';
import './Navbar.css';
import { ReactComponent as MenuIcon } from '../../assets/menu-icon.svg';
import { ReactComponent as SearchIcon } from '../../assets/search-icon.svg';
import { ReactComponent as ProfileIcon } from '../../assets/profile-icon.svg';
import logo from '../../assets/logo-text.png';
import Overlays from '../Overlays';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  const openModal = (type) => {
    setModalType(type);
    setIsOpen(true);
  }
  return (
    <>
      <Overlays isOpen={isOpen} />
      <nav className='flex-div'>
        <div className='nav-left flex-div'>
          <MenuIcon className="menu-icon" />
          <img className='logo' src={logo} alt="" />
          <h3>Events</h3>
          <h3>Forums</h3>
        </div>
        <div className="nav-middle flex-div">
          <div className="search-box flex-div">
            <input type="text" placeholder='Search' />
            <SearchIcon className="search-icon" />
          </div>

        </div>

        <div className="nav-right flex-div">
          <button class="button log-in" onClick={() => openModal('login')}>Login</button>
          <button class="button sign-up" onClick={() => openModal('signup')}> Sign Up</button>
          <Overlays modalType={modalType} isOpen={isOpen}  onClose={() => setIsOpen(false)} />
          <ProfileIcon className="profile-icon" />
        </div>
      </nav>
    </>
  )
}

export default Navbar
