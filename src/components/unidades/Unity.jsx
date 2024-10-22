import React, { useEffect, useState } from 'react';
import { useFetchUnity } from '../../shared/hooks/useFetchUnity.jsx'; // Adjust this as needed

export const Unity = () => {
  const [updatedUnits, setUpdatedUnits] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpdatedUnits = async () => {
      try {
        const response = await fetch('/api/unidades/today');
        if (!response.ok) {
          throw new Error('Error fetching updated units');
        }
        const data = await response.json();
        setUpdatedUnits(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUpdatedUnits();
  }, []);

  return (
    <div>
      <h2>Updated Units Today</h2>
      {error && <p>{error}</p>}
      {updatedUnits.length > 0 ? (
        <ul>
          {updatedUnits.map((unit) => (
            <li key={unit._id}>{unit.nameUnity} - Workers: {unit.numberOfWorkers}</li>
          ))}
        </ul>
      ) : (
        <p>No units updated today.</p>
      )}
    </div>
  );
};
