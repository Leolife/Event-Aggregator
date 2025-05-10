//home.jsx
import React, { useState, useEffect } from 'react'
import PropTypes from "prop-types";
import './Home.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import Header from '../../Components/Header/Header'
import { eventInfo } from './TempEvents'
import EventTile from '../../Components/Events/CategoryCard'
import EventCard from '../../Components/Events/EventCard';



export const Home = ({ sidebar }) => {

  // Stores the tags the user has selected
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [events, setEvents] = useState([{}])
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
          <div className='live-feed-container'>
            <h1> 🔴 Live </h1>
            <div className='live-feed'>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
