import { useEffect, useState } from 'react';
import { getParkings } from '../services/api';

const Overview = () => {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await getParkings();
      const parkings = res.data.data.parkings;

      const formatted = parkings.map((p) => ({
        name: p.name,
        code: p.code,
        fee: p.Fee,
        location: p.location,
      }));

      setSummary(formatted);
    }

    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Parking Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {summary.map((item) => (
          <div key={item.code} className="bg-gray-800 text-white p-4 rounded">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p>Code: {item.code}</p>
            <p>Location: {item.location}</p>
            <p>Fee: {item.fee} RWF/hr</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
