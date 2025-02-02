import React from 'react'
import './Filters.css';

const Filters = ({ isOpen, onClose }) => {
    return (
        <div className="modal">
            <div className="modal-content filters">
                <button className="close-btn" onClick={onClose}> &times; </button>
                <div className='flex-div'>
                </div>
            </div>
        </div>
    )
}

export default Filters
