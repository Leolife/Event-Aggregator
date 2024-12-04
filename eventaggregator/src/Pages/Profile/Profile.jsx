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
                        <div className="profile-header-more">
                        </div>
                    </div>
                </div>
                <div className="profile-nav">

                </div>
                <div className="profile-friends">

                </div>

            </div>

        </>


    )
}
