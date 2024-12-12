import React from 'react'
import Sidebar from '../../Components/Sidebar/Sidebar'
import Events from '../../Components/Events/Events'
import { useParams } from 'react-router-dom'

export const EventCategory = ({ sidebar }) => {

    const {categoryName} = useParams();

    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className={`container ${sidebar ? "" : 'large-container'}`}>
                <Events categoryName={categoryName}/>
            </div>
        </>
    )
}

export default EventCategory
