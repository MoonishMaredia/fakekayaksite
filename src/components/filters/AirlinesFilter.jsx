import React, { useCallback } from 'react';

const AirlinesFilter = ({ airlines, setAirlines }) => {
  const handleChange = useCallback((airline) => {
    setAirlines(prev => ({
      ...prev,
      [airline]: !prev[airline],
    }));
  }, [setAirlines]);

  return (
    <div className="airlines-filter">
      {Object.keys(airlines).map((airline) => (
        <label key={airline}>
          <input
            type="checkbox"
            checked={airlines[airline]}
            onChange={() => handleChange(airline)}
          />
          {airline}
        </label>
      ))}
    </div>
  );
};

export default React.memo(AirlinesFilter);