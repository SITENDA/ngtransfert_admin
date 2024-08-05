import React from 'react';
import '../../assets/img/profile-30.png';
const UserProfile = () => {
  return (
      <div className='logo-frame'>
      <div className="logo-icon">
      <img src={require('../../assets/img/profile-30.png')} alt="Logo" className="logo-image" />
    </div>
    </div>
  )
}

export default UserProfile