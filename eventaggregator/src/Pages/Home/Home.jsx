//home.jsx
import React, { useState, useEffect } from 'react'
import PropTypes from "prop-types";
import './Home.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import Header from '../../Components/Header/Header'
import { eventInfo } from './TempEvents'
import EventTile from '../../Components/Events/CategoryCard'
import EventCard from '../../Components/Events/EventCard';
import { ReactComponent as LiveIcon } from '../../assets/live-icon.svg';


export const Home = ({ sidebar }) => {

  // Stores the tags the user has selected
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [events, setEvents] = useState([{}])
  const [streams, setStreams] = useState([]);
  const totalPages = 5

  // Sort options located in the header
  const options = [
    "Recommended For You",
    "All"
  ]

  // Retrives tags from the header
  function sendData(data) {
    setSelectedTags(data)
  }

  // Convert twitch stream start time to time ago
  function timeElapsed(startTime) {
    const start = new Date(startTime);
    const now = new Date();
    const diffInSeconds = Math.floor((now - start) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
    }
  }

  // Convert twitch viewer numbers to abbreviated number
  function convertToAbbreviation(number) {
    const formatter = new Intl.NumberFormat('en', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumSignificantDigits: 2
    });

    return formatter.format(number);
  }

  useEffect(() => {
  }, [selectedTags])

  async function fetchEvents() {
    const itemsPerPage = 7;
    const START = (currentPage - 1) * itemsPerPage + 1;
    const OFFSET = itemsPerPage;
    const data = { START, OFFSET };
    const response = await fetch("/get/offset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    const fetchedEvents = await response.json()
    setEvents(Object.values(fetchedEvents))
  }

  // Fetch live events from the API
  useEffect(() => {
    async function fetchEvents() {
      const response = await fetch("/streams", {
        method: "GET",
      });
      const data = await response.json()
      const width = 440;
      const height = 248;
      const streams = data.map((stream) => {
        // Set the thumbnail width and height 
        const thumbnail = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${stream.user_login}-${width}x${height}.jpg`;
        return {
          ...stream,
          thumbnail, // attach the new thumbnail url
        };
      })
      setStreams(streams)
    }
    fetchEvents();
  }, [])



  useEffect(() => {
    fetchEvents()
  }, [currentPage])



  return (
    <>
      <Sidebar sidebar={sidebar} />
      <div className="home">
        <Header title={"All Categories"} sidebar={sidebar} sendData={sendData} options={options} />
        <div className={`container ${sidebar ? "" : 'large-container'}`}>
          <div className='all-events-container'>
            <div className='all-events-feed'>
              {events ? (
                events.map((event) => (
                  <EventCard event={event}> </EventCard>
                ))
              ) : (
                // Displays an error message if the events have not loaded in
                <label> Error Loading Events </label>
              )}
            </div>
            <div className='event-nav'>
              <button
                className='event-nav-btn'
                onClick={() => setCurrentPage(currentPage - 1)}
                style={{ visibility: currentPage === 1 ? 'hidden' : 'visible' }}>
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    className='event-nav-btn'
                    onClick={() => setCurrentPage(page)}
                    style={{
                      backgroundColor: page === currentPage ? "#6b34c9" : "var(--primary)",
                    }}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                className='event-nav-btn'
                onClick={() => setCurrentPage(currentPage + 1)}
                style={{ visibility: currentPage === totalPages ? 'hidden' : 'visible' }}>
                Next
              </button>
            </div>
          </div>
          <div className="feed-container">
            <div className="feed">
              {/* Filters the event tiles based on selected category tags */}
              {eventInfo.filter(e => selectedTags.length === 0 || selectedTags.some(tag => e.tags.includes(tag.category)))
                .map((tile, index) => (
                  <EventTile key={index} {...tile} />
                ))}
            </div>
          </div>
          {/* Display live ongoing events*/}
          <div className='live-feed-container'>
            <h1 className='live-events'> 🔴 Live Events </h1>
            <div className='live-feed'>
              {streams && streams.length > 0 ? (
                streams.map((stream, index) => (
                  <div className='live-card'>
                    <div className='live-card-thumbnail-container'>
                      {/* Link to the Twitch Stream when user clicks on the thumbnail */}
                      <a href={`https://twitch.tv/${stream.user_name}`} style={{ display: "table-cell" }} target="_blank" rel="noopener noreferrer" >
                        <img className='live-card-thumbnail' src={stream.thumbnail} alt="" />
                        <div className="live-box"> <LiveIcon /> LIVE </div>
                      </a>
                    </div>
                    <div className='live-card-details'>
                      <h1 className='live-card-title'> {stream.title} </h1>
                      <label className='live-card-broadcaster'> {stream.user_name} </label>
                      <label className='live-card-game'> {stream.game_name} </label>
                      <label className='live-card-viewers'>  {convertToAbbreviation(stream.viewer_count)} watching • {timeElapsed(stream.started_at)}  </label>
                    </div>
                  </div>
                )
                )
              ) : (
                // Displays message if the streams have not loaded in
                <label> No live events! </label>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
