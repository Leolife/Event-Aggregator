import React, { useState } from 'react'
import './DropArea.css'

const DropArea = ({ activeTile, index, onDrop }) => {
    const [showDrop, setShowDrop] = useState(false)
    const checkPos = () => {
        if (activeTile) {   // Exclude uwanted draggable elements
            if (activeTile.name !== "Favorites") {    // Exclude Favorites calendar
                if (activeTile.pinned === false) {
                    if ((activeTile.position === index || activeTile.position === index + 1)) { // Prevent calander tile from being dragged above/below itself
                        return false
                    } else return true // Otherwise clear to proceed
                }
            }
        }
    }

    const handleShowDrop = (state) => {
        if (checkPos()) {
            setShowDrop(state)  // Displays or hides the drop area preview
        }
    }

    // Adjusts the position to account for placing a tile above another tile
    const getDropPosition = () => {
        if (activeTile.position > index) {
            return index + 1
        } else return index
    }

    return (
        <section
            onDragEnter={() => handleShowDrop(true)}
            onDragLeave={() => handleShowDrop(false)}
            onDrop={() => {
                if (checkPos()) {
                    onDrop(getDropPosition()) // Sends the new drop position to the onDrop function in Calendar.jsx
                    setShowDrop(false)        // Hides the drop area preview
                }
            }}
            onDragOver={(e) => e.preventDefault()}
            className={showDrop ? 'drop-area' : 'hide-drop'}
        > </section>
    )
}

export default DropArea
