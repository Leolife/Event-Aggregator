import React from 'react'

const Alert = ({notification}) => {
    return (
        <>
            {/* Notification toast - moved from inside modal to parent component */}
            {notification.show && (
                <div className={`notification-toast ${notification.isError ? 'error' : 'success'}`}>
                    {notification.message}
                </div>
            )}
        </>
    )
}

export default Alert
