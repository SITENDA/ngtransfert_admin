import React from 'react'

const NotFoundComponent = ({ item, availableOrFound }) => {
    return (
        <div className="text-center mt-5">
            <p>{item ? item : "Item"} not {availableOrFound ? availableOrFound : "found"}!</p>
        </div>
    )
}

export default NotFoundComponent