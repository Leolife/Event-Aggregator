import React from 'react'
import './Profile.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import headerimage from '../../assets/profile-header-image.jpg';

export const Profile = ({ sidebar }) => {
    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className={`container ${sidebar ? "" : 'large-container'}`}>
                <div className="profile-header">
                   
                    <div className="profile-header-top">
                        <div className="header-caption">
                            <div className="header-names">
                                <h1>Rizzo</h1>
                            </div>
                            <div className="header-details">
                            </div>
                        </div>
                        <div className="profile-header-more">
                        </div>
                    </div>
                    <img className="profile-header-image" src={headerimage} alt = ""></img>
                </div>
                <div className="profile-nav">

                </div>
                <div className="profile-friends">

                </div>

            </div>

        </>


    )
}
