import React from 'react'
import './Profile.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import headerimage from '../../assets/profile-header-image.png';
import profileimage from '../../assets/profile-picture.png';


export const Profile = ({ sidebar }) => {
    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className={`container ${sidebar ? "" : 'large-container'}`}>
                <div className="profile">
                <div className="section-header">
                    <div className="profile-header">
                        <div className="profile-banner">
                            <div className="profile-banner-sizer">
                                <img className="profile-banner-image" src={headerimage} alt=""></img>
                            </div>
                            <img className="profile-picture" src={profileimage} alt=""></img>
                        </div>
                        <div className="profile-header-content">
                            <div className="header-caption">
                                <div className="header-names">
                                    <h1>Freakbob</h1>
                                </div>
                                <div className="header-details">
                                    <h2><span>30</span> Friends</h2>
                                    <h2><span>30</span> Posts</h2>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="profile-tabs">
                        <div className="horizontal-tabs">
                            <div className="tab-link">
                                <h3> About </h3>
                            </div>
                            <div className="tab-link">
                                <h3> My Calendars </h3>
                            </div>
                            <div className="tab-link">
                                <h3> Posts </h3>
                            </div>
                            <div className="tab-link">
                                <h3> Comments </h3>
                            </div>
                            <div className="tab-link">
                                <h3> Upvoted </h3>
                            </div>
                            <div className="tab-link">
                                <h3> Downvoted </h3>
                            </div>
                        </div>
                        <hr />
                    </div>
                </div>

                <div className="section-content">
                    <div className="profile-content">
                        <div className="content-tabs">
                            <h2> About </h2>
                            <p> My name is Yoshikage Kira. I'm 33 years old. My house is in the northeast section of Morioh, where all the villas are, and I am not married. I work as an employee for the Kame Yu department stores, and I get home every day by 8 PM at the latest. I don't smoke, but I occasionally drink. I'm in bed by 11 PM, and make sure I get eight hours of sleep, no matter what. After having a glass of warm milk and doing about twenty minutes of stretches before going to bed, I usually have no problems sleeping until morning. Just like a baby, I wake up without any fatigue or stress in the morning. I was told there were no issues at my last check-up. I'm trying to explain that I'm a person who wishes to live a very quiet life. I take care not to trouble myself with any enemies, like winning and losing, that would cause me to lose sleep at night. That is how I deal with society, and I know that is what brings me happiness. Although, if I were to fight I wouldn't lose to anyone. </p>
                            <hr />
                            <div className="profile-friends">
                                <h2> Friends (30) </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>


        </>




    )
}
