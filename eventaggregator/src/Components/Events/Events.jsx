import React from 'react'
import './Events.css';
import { ReactComponent as CalendarIcon } from '../../assets/calendar-icon.svg';
import { ReactComponent as LocationIcon } from '../../assets/location-icon.svg';
import { ReactComponent as HeartIcon } from '../../assets/heart-icon.svg';
import { ReactComponent as SaveIcon } from '../../assets/save-icon.svg';
import thumbnail1 from '../../assets/wide-thumbnail1.jpg'

const Events = () => {
  return (
    <div className="events">
      <div className="topbar">
        <h1> League of Legends </h1>
      </div>
      <div className="feed">
        <div className="event-card">
          <div className='img-sizer'>
            <img src={thumbnail1} alt="" />
          </div>
          <span className="event-content">
            <div className="event-name">
              <h2> The Game </h2>
            </div>
            <div className="event-date">
              <h3> <CalendarIcon className="calendar-icon" />  Wed, December 25th @ 2:00 PM (PDT) </h3>
            </div>
            <div className="event-location">
              <h3> <LocationIcon className="location-icon" />  Riot Games Arena</h3>
            </div>
          
          <div className="event-add">
            <span className="add-options">
              <button className="heart-btn"> <HeartIcon className="heart-icon"/> </button>
              <button className="add-btn"> Add to Calendar </button>
              <button className="export-btn"> Export (Google Calendar) </button>
              <button className="save-btn"> <SaveIcon className="save-icon"/> </button>
            </span>
          </div>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Events
