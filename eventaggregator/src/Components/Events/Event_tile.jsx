import React from 'react'
import { Link } from 'react-router-dom'
import './Event_tile.css';
const Event_tile = ({ name, thumbnail, total_events, total_upcomming, tags, link }) => {
    return (
        <Link to={link} className='tile'>
            <div className='img-sizer'>
                <img src={thumbnail} alt="" />
            </div>
            <div className="name-box">
                <h2 className="event-name"> {name} </h2>
            </div>
            <h3 className="event-info"> {total_events} Events • {total_upcomming} Upcoming </h3>
            <div className="tag-box">
                {/* Iterates through the tag array and displays the tags in the tag-box*/}
                {tags.map((tag, index) => (
                    <div key={index} className="tag">
                        <label className="tag-name">{tag}</label>
                    </div>
                ))}
            </div>
        </Link>
    )
}

export default Event_tile
