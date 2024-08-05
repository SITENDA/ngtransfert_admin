import React from 'react';
import '../../assets/img/logo-30.png';
const Logo = () => {
  return (
      <div className='logo-frame'>
      <div className="logo-icon">
        <img src={require('../../assets/img/logo-30.png')} alt="Logo" className="logo-image" />
    </div>
    </div>
  )
}

export default Logo;
