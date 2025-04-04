//home.jsx
import React, { useState, useEffect } from 'react'
import './Home.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import Header from '../../Components/Header/Header'
import { eventInfo } from './TempEvents'
import EventTile from '../../Components/Events/Event_tile'



export const Home = ({ sidebar }) => {

  // Stores the tags the user has selected
  const [selectedTags, setSelectedTags] = useState([]);

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


  return (
    <>
      <Sidebar sidebar={sidebar} />
      <div className="home">
        <Header title={"All Categories"} sidebar={sidebar} sendData={sendData} options={options} />
        <div className={`container ${sidebar ? "" : 'large-container'}`}>
          <div className="feed-container">
            <div className="feed">
              {/* Filters the event tiles based on selected category tags */}
              {eventInfo.filter(e => selectedTags.length === 0 || selectedTags.some(tag => e.tags.includes(tag.category)))
                .map((tile, index) => (
                  <EventTile key={index} {...tile} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
