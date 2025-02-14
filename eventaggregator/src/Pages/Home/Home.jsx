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
