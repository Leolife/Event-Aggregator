import React from 'react'
import { createPortal } from "react-dom";
import Login from './Account/Login';
import Signup from './Account/Signup';
import Filters from './Filters/Filters';
import Logout from './Account/Logout';
import SubmitProfilePicture from './Profile/SubmitProfilePicture';
import SubmitProfileBanner from './Profile/SubmitProfileBanner';


const mountElement = document.getElementById("overlays")

const Overlays = ({ modalType, isOpen, onClose, onSubmitBanner, onSubmitPicture }) => {
    return (
        createPortal(
            <>
                {isOpen && (
                    <>
                        {modalType === 'login' && <Login isOpen={isOpen} onClose={onClose} />}
                        {modalType === 'signup' && <Signup isOpen={isOpen} onClose={onClose} />}
                        {modalType === 'filters' && <Filters isOpen={isOpen} onClose={onClose} />}
                        {modalType === 'logout' && <Logout isOpen={isOpen} onClose={onClose}/>}
                        {modalType === 'submit-prof-pic' && <SubmitProfilePicture isOpen={isOpen} onClose={onClose} onSubmit={onSubmitPicture}/>}
                        {modalType === 'submit-prof-ban' && <SubmitProfileBanner isOpen={isOpen} onClose={onClose} onSubmit={onSubmitBanner} />}
                    </>
                )}
            </>, 
            mountElement
        )
    );
};

export default Overlays

