import React from 'react';
import {backend} from "../../util/backend";

const CurrencyLogo = ({ logoUrl, alt }) => {
  const imageSource = backend.imagesUrl + logoUrl;
  return (
    <img src={imageSource} alt={alt} style={{ width: '30px', height: '30px', marginRight: '10px' }} />
  );
};

export default CurrencyLogo;
