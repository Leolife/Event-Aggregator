import React from 'react'
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

const Sidebar = ({sidebar}) => {
  return (
    <div className={`sidebar ${sidebar?"":"small-sidebar"}`}>
      <div className="events">
        <div className="side-link">
          <CalendarIcon className="calendar-icon" /><h3>Events</h3><TriangleIcon className="triangle-icon" />
        </div>
        <div className="side-link">
          <StarIcon className="star-icon" /><p>Recommended Events</p>
        </div>
        <div className="side-link">
          <TrendIcon className="trend-icon" /><p>All Categories</p>
        </div>
        <hr />
      </div>
      <div className="forums">
        <div className="side-link">
          <ForumsIcon className="forums-icon" /><h3>Forums</h3><TriangleIcon className="triangle-icon" />
        </div>
        <div className="side-link">
          <StarIcon className="star-icon" /><p>Recommended Posts</p>
        </div>
        <div className="side-link">
          <TrendIcon className="trend-icon" /><p>Hottest</p>
        </div>
        <div className="side-link">
          <BoltIcon className="bolt-icon" /><p>Latest</p>
        </div>
      </div>
      <hr />
      <div className="profile">
        <div className="side-link">
          <ProfileIcon className="profile-icon" /><h3>Profile</h3><TriangleIcon className="triangle-icon" />
        </div>
        <div className="side-link">
          <ProfileIcon className="profile-icon" /><p>My Profile</p>
        </div>
        <div className="side-link">
          <FriendIcon className="friend-icon" /><p>Friends</p>
        </div>
      </div>
      <hr />
      <div className="my-calendars">
        <div className="side-link">
          <CalendarIcon className="calendar-icon" />
          <h3>My Calendars</h3>
          <TriangleIcon className="triangle-icon" />
        </div>
        <div className="side-link">
          <HeartIcon className="heart-icon" /> <p>Favorites</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
