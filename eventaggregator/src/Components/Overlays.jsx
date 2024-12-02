import React from 'react'
import { createPortal } from "react-dom";
import Login from './Account/Login';
import Signup from './Account/Signup';

const mountElement = document.getElementById("overlays")

const Overlays = ({modalType, isOpen, onClose}) => {
  return (
    createPortal(<>{isOpen && (
    <>
    {modalType === 'login' && <Login isOpen={isOpen} onClose={onClose} />}
    {modalType === 'signup' && <Signup isOpen={isOpen} onClose={onClose} />}
    </>
    )}
    </>
    , mountElement)
  )
}

export default Overlays

