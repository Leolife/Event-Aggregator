import React from 'react'
import { useNavigate } from 'react-router-dom'
import './EventCard.css'
import { formatDateTime } from '../../utils/FormatData';
import { ReactComponent as HeartIcon } from '../../assets/heart-icon.svg';
import { ReactComponent as MessageIcon } from '../../assets/message-icon.svg';

const EventCard = ({ event }) => {
    console.log(event)
    const navigate = useNavigate()
    return (
        <div className='event-card-container' onClick={() => navigate(`/event/${event.id}`)}>
            <div className='event-card-thumb-container'>
                <img src={event.image} alt="" />
            </div>
            <div className='event-card-info-container'>
                <label className="event-card-date"> {formatDateTime(event.date)} </label>
                <h3 className='event-card-title'> {event.title} </h3>
                <label className='event-card-favorites'> </label>
                <div className='event-card-interactions-container'>
                    <div className='event-card-interactions'>
                        <MessageIcon> </MessageIcon>
                        <label> 0 </label>
                    </div>
                    <div className='event-card-interactions'>
                        <HeartIcon> </HeartIcon>
                        <label> 0 </label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventCard
