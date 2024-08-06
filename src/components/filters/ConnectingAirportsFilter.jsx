import React from 'react';

const ConnectingAirportsFilter = ({ airports, onAirportSelect }) => {
  return (
    <div className="connecting-airports-filter">
      <p>Connecting Airports</p>
      {airports.map((airport) => (
        <label key={airport.id}>
          <input 
            type="checkbox" 
            checked={airport.checked}
            onChange={() => onAirportSelect(airport.id)} 
          />
          {airport.name} ({airport.id})
        </label>
      ))}
    </div>
  );
};

export default React.memo(ConnectingAirportsFilter);