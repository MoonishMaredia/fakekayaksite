import React from 'react';

const PriceFilter = ({ price, setPrice, maxPrice }) => {
  return (
    <div className="price-filter">
      <p>Up to ${price}</p>
      <input
        type="range"
        min="0"
        max={maxPrice}
        value={price}
        step={1}
        onChange={(e) => setPrice(Number(e.target.value))}
      />
    </div>
  );
};

export default React.memo(PriceFilter);