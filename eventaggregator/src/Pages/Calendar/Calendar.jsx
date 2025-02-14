import React from 'react'
import './Calendar.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { ReactComponent as SlidersIcon } from '../../assets/sliders.svg';
import { ReactComponent as SearchIcon } from '../../assets/search-icon.svg';
import liked from '../../assets/liked.jpg'

export const Calendar = ({ sidebar }) => {
    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className={`container ${sidebar ? "" : 'large-container'}`}>
                <div className="calendar">
                    <div className="mycalendars-section">
                        <div className="mycalendars-container">
                            <div className="mycalendars-header">
                                <h1> My Calendars </h1>
                                <div className="search-box flex-div">
                                    <SearchIcon className="search-icon" />
                                    <input type="text" placeholder='Search Calendars' />
                                    <SlidersIcon className="sliders-icon" />
                                </div>
                            </div>
                            <div className="mycalendars">
                                <div className="calendar-tile">
                                    <div className="img-sizer">
                                        <img src={liked} alt="" />
                                    </div>

                                    <div className="tile-container">
                                        <h2 className="tile-name"> Favorites </h2>
                                        <label className="tile-info"> 21 Events • 4 Upcoming </label>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="calendar-section">

                    </div>
                </div>
            </div>
        </>
    )
}
