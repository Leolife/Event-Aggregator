import React from 'react'
import { createPortal } from "react-dom";
import Login from './Account/Login';
import Signup from './Account/Signup';
import Filters from './Filters/Filters';
import Logout from './Account/Logout';
import LinkToPhoto from './Profile/LinkToPhoto';


const mountElement = document.getElementById("overlays")

const Overlays = ({ modalType, isOpen, onClose }) => {
    return (
        createPortal(
            <>
                {isOpen && (
                    <>
                        {modalType === 'login' && <Login isOpen={isOpen} onClose={onClose} />}
                        {modalType === 'signup' && <Signup isOpen={isOpen} onClose={onClose} />}
                        {modalType === 'filters' && <Filters isOpen={isOpen} onClose={onClose} />}
                        {modalType === 'logout' && <Logout isOpen={isOpen} onClose={onClose}/>}
                        {modalType === 'profile-pic-link' && <LinkToPhoto isOpen={isOpen} onClose={onClose}/>}
                    </>
                )}
            </>, 
            mountElement
        )
    );
};

export default Overlays

