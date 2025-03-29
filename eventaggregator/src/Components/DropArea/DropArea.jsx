import React, { useState } from 'react'
import './DropArea.css'

const DropArea = ({onDrop}) => {
    const [showDrop, setShowDrop] = useState(false)
    return (
        <section
            onDragEnter={() => setShowDrop(true)}
            onDragLeave={() => setShowDrop(false)}
            onDrop={() => {
                onDrop()
                setShowDrop(false)
            }}
            onDragOver={(e) => e.preventDefault()}
            className={showDrop ? 'drop-area' : 'hide-drop'}
        > </section>
    )
}

export default DropArea
