//home.jsx
import React, { useState } from 'react'
import './Home.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { ReactComponent as SearchIcon } from '../../assets/search-icon.svg';
import { eventInfo } from './TempEvents'
import EventTile from '../../Components/Events/Event_tile'


export const Home = ({ sidebar }) => {
  const [isActive, setActive] = useState(false)
  return (
    <>
      <Sidebar sidebar={sidebar} />
      <div className="home">
        <div className={`header-container ${sidebar ? "" : 'large-header-container'}`}>
          <div className="header">
            <h1> All Categories</h1>
            <div className="filters">
              <div className="category">
                <div className="dropdown-search">
                  <div className="search-box flex-div">
                    <SearchIcon className="search-icon" />
                    <input type="text" placeholder='Search Category Tags' onFocus={() => setActive(true)} onBlur={() => setActive(false)} />
                  </div>
                  {isActive &&
                    <div className="dropdown-content">
                      <ul>
                        <li className="dropdown-item"> Stealth </li>
                        <li className="dropdown-item"> Action </li>
                        <li className="dropdown-item"> Horror </li>
                        <li className="dropdown-item"> Fighting </li>
                        <li className="dropdown-item"> Open World </li>
                        <li className="dropdown-item"> Point and Click </li>
                        <li className="dropdown-item"> Creative </li>
                        <li className="dropdown-item"> MMO </li>
                        <li className="dropdown-item"> Tabletop </li>
                        <li className="dropdown-item"> Shooter </li>
                      </ul>
                    </div>
                  }
                </div>
              </div>
              <div className="relevance">
                <div className="dropdown-sort">
                  <label> Sort By: </label>
                  <select className="sortby">
                    <option> Recommended For You </option>
                    <option> All </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`container ${sidebar ? "" : 'large-container'}`}>
          <div className="feed">
          {eventInfo.map((tile, index) => (
                    <EventTile key={index} {...tile} />
                ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
