import React from 'react';

const CountryFlag = ({ flagUrl, alt }) => {
  return (
    <img src={flagUrl} alt={alt} style={{ width: '30px', height: '20px', marginLeft: '10px' }} />
  );
};

export default CountryFlag;
