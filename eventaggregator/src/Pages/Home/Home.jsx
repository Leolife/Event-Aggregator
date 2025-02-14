//home.jsx
import React, { useState } from 'react'
import './Home.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { ReactComponent as SearchIcon } from '../../assets/search-icon.svg';
import { eventInfo } from './TempEvents'
import EventTile from '../../Components/Events/Event_tile'

const Categories = [
  "RPG",
  "Strategy",
  "Shooter",
  "Action",
  "IRL",
  "Fighting",
  "Platformer",
  "VTuber",
  "Rhythm & Music Game",
  "Tabletop"
]

let nextId = 0;

export const Home = ({ sidebar }) => {
  const [isActive, setActive] = useState(false)
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  return (
    <>
      <Sidebar sidebar={sidebar} />
      <div className="home">
        <div className={`header-container ${sidebar ? "" : 'large-header-container'}`}>
          <div className="header">
            <h1> All Categories</h1>
            <div className="filters">
              <div className="category">
                <div className="dropdown-search">
                  <div className="search-box flex-div">
                    <SearchIcon className="search-icon" />
                    {/* Displays dropdown menu when the search bar is focused 
                        Filters dropdown menu based on search query
                    */}
                    <input type="text" placeholder='Search Category Tags'
                      onFocus={() => setActive(true)}
                      onBlur={() => setActive(false)}
                      onChange={e => setQuery(e.target.value)}
                    />
                  </div>
                  {isActive &&
                    <div className="dropdown-content" >
                      <ul>
                        {/* Adds tags to the category filter, limited to 3 tags */}
                        {Categories.filter(category =>
                          category.toLowerCase().includes(query.toLowerCase()) &&
                          !selectedTags.some(tag => tag.category === category)).map((category, index) => (
                          <li key={index} className="dropdown-item" onMouseDown={() => {
                            if (selectedTags.length < 3) {
                              setSelectedTags([
                                ...selectedTags,
                                { id: nextId++, category: category }
                              ]);
                            }
                          }}>
                            {category}
                          </li>
                        ))}
                      </ul>
                    </div>
                  }
                </div>
              </div>
              <div className="tag-box">
                {/* Removes tag from the filter when they are clicked on */}
                {selectedTags.map((tag) => (
                  <div key={tag.id} className="tag">
                    <label className="tag-name" onClick={() => {
                      setSelectedTags(
                        selectedTags.filter(e =>
                          e.id !== tag.id
                        )
                      )
                    }}> {tag.category} ˣ </label>
                  </div>
                ))}
              </div>
              <div className="relevance">
                <div className="dropdown-sort">
                  <label> Sort By: </label>
                  <select className="sortby">
                    <option> Recommended For You </option>
                    <option> All </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
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
