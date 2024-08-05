import React from 'react'

const TendaButton = ({disabled, buttonText}) => {
  return (
    <button className="btn btn-primary btn-lg" style={{width: "90%"}} disabled={disabled}>{buttonText}</button>
  )
}

export default TendaButton