import React from 'react'
import { useNavigate } from 'react-router-dom'
import './EventCard.css'
import { formatDateTime } from '../../utils/FormatData';
import { ReactComponent as HeartIcon } from '../../assets/heart-icon.svg';
import { ReactComponent as MessageIcon } from '../../assets/message-icon.svg';
import { auth } from '../../firebase';
import Placeholder from '../../assets/placeholder.png';
import UserData from '../../utils/UserData';




const EventCard = ({event}) => {
    const navigate = useNavigate()
    const handleClick = async () => {
        navigate(`/event/${event.id}`)
        const user = auth.currentUser;
        if (auth.currentUser) {
            const userId = user.uid
            const userData = new UserData(userId);
            await userData.setEventClicks(event.id);
        }
    }
    return (
        <div className='event-card-container' onClick={handleClick}>
            <div className='event-card-thumb-container'>
                <img src={event.image || event.thumb || Placeholder} alt={event.title || 'Event image'} />
            </div>
            <div className='event-card-info-container'>
                <label className="event-card-date"> {event.when} </label>
                <h3 className='event-card-title'> {event.title} </h3>
                <label className='event-card-favorites'> </label>
                <div className='event-card-interactions-container' style={{display: 'none'}}>
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
