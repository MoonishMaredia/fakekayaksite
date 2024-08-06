import React from 'react';

const StopsFilter = ({ stops, setStops }) => {
  return (
    <div className="stops-filter">
      {[100, 0, 1, 2].map((option) => (
        <label key={option}>
          <input
            type="checkbox"
            value={option}
            checked={stops === option}
            onChange={(e) => setStops(Number(e.target.value))}
          />
          {option === 100 ? 'Any number of stops' :
           option === 0 ? 'Nonstop only' :
           option === 1 ? '1 stop or fewer' : '2 stops or fewer'}
        </label>
      ))}
    </div>
  );
};

export default React.memo(StopsFilter);