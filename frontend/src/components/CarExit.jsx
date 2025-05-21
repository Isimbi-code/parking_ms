import { useState } from 'react';
import { exitCar } from '../services/api';

const CarExit = () => {
  const [parkingCode, setParkingCode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const res = await exitCar({ parkingCode, userId });
      setResult(res.data); // { totalFee, durationHours, bill }
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Exit failed');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Car Exit</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Parking Code"
          value={parkingCode}
          onChange={(e) => setParkingCode(e.target.value)}
          className="border p-2 w-full"
        />
        <button className="bg-red-500 text-white px-4 py-2 rounded">Exit</button>
      </form>

      {result && (
        <div className="mt-6 bg-gray-800 p-4 rounded text-white">
          <h3 className="text-lg font-bold">Bill Generated</h3>
          <p>Total Fee: {result.totalFee} RWF</p>
          <p>Duration: {result.durationHours} hrs</p>
          <p>Bill ID: {result.bill.id}</p>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default CarExit;
