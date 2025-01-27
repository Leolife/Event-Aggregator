//home.jsx
import React from 'react'
import './Home.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import thumbnail1 from '../../assets/thumbnail1.png'
import thumbnail2 from '../../assets/thumbnail2.jpg'
import thumbnail3 from '../../assets/thumbnail3.png'
import thumbnail4 from '../../assets/thumbnail4.jpg'
import thumbnail5 from '../../assets/thumbnail5.png'
import thumbnail6 from '../../assets/thumbnail6.png'
import thumbnail7 from '../../assets/thumbnail7.jpg'
import thumbnail8 from '../../assets/thumbnail8.png'
import thumbnail9 from '../../assets/thumbnail9.jpg'
import thumbnail10 from '../../assets/thumbnail10.png'
import thumbnail11 from '../../assets/thumbnail11.jpg'
import thumbnail12 from '../../assets/thumbnail12.png'
import { Link } from 'react-router-dom'


export const Home = ({ sidebar, user, data}) => {
  return (
    <>
      <Sidebar sidebar={sidebar} />
      <div className={`container ${sidebar ? "" : 'large-container'}`}>
        <div className="feed">
          <Link to = {'event/category/league-of-legends'} className='card'>
            <div className='img-sizer'>
              <img src={thumbnail1} alt="" />
            </div>
            <h2> {data} </h2>
            <h3> 25 Events • 6 Upcoming </h3>
          </Link>
          <div className='card'>
            <div className='img-sizer'>
              <img src={thumbnail2} alt="" />
            </div>
            <h2> Marvel Rivals </h2>
            <h3> 25 Events • 6 Upcoming </h3>
          </div>
          <div className='card'>
            <div className='img-sizer'>
              <img src={thumbnail3} alt="" />
            </div>
            <h2> Music </h2>
            <h3> 25 Events • 6 Upcoming </h3>
          </div>
          <div className='card'>
            <div className='img-sizer'>
              <img src={thumbnail4} alt="" />
            </div>
            <h2> Super Smash Bros... </h2>
            <h3> 25 Events • 6 Upcoming </h3>
          </div>
          <div className='card'>
            <div className='img-sizer'>
              <img src={thumbnail5} alt="" />
            </div>
            <h2> Sports (Fake) </h2>
            <h3> 25 Events • 6 Upcoming </h3>
          </div>
          <div className='card'>
            <div className='img-sizer'>
              <img src={thumbnail6} alt="" />
            </div>
            <h2> Valorant </h2>
            <h3> 25 Events • 6 Upcoming </h3>
          </div>
          <div className='card'>
            <div className='img-sizer'>
              <img src={thumbnail7} alt="" />
            </div>
            <h2> VRChat </h2>
            <h3> 25 Events • 6 Upcoming </h3>
          </div>
          <div className='card'>
            <div className='img-sizer'>
              <img src={thumbnail8} alt="" />
            </div>
            <h2> Hololive </h2>
            <h3> 25 Events • 6 Upcoming </h3>
          </div>
          <div className='card'>
            <div className='img-sizer'>
              <img src={thumbnail9} alt="" />
            </div>
            <h2> Osu! </h2>
            <h3> 25 Events • 6 Upcoming </h3>
          </div>
          <div className='card'>
            <div className='img-sizer'>
              <img src={thumbnail10} alt="" />
            </div>
            <h2> Magic the Gathering </h2>
            <h3> 25 Events • 6 Upcoming </h3>
          </div>
          <div className='card'>
            <div className='img-sizer'>
              <img src={thumbnail11} alt="" />
            </div>
            <h2> Pokemon TCG </h2>
            <h3> 25 Events • 6 Upcoming </h3>
          </div>
          <div className='card'>
            <div className='img-sizer'>
              <img src={thumbnail12} alt="" />
            </div>
            <h2> One Piece TCG </h2>
            <h3> 25 Events • 6 Upcoming </h3>
          </div>

        </div>
      </div>
    </>
  )
}

export default Home
