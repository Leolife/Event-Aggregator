import React from 'react'
import Sidebar from '../../Components/Sidebar/Sidebar'
import Events from '../../Components/Events/Events'

export const EventCategory = ({ sidebar }) => {
    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className={`container ${sidebar ? "" : 'large-container'}`}>
                <Events/>
            </div>
        </>
    )
}

export default EventCategory
