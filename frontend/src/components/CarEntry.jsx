import { useState } from 'react';
import { enterCar } from '../services/api'; // already defined

const CarEntry = () => {
  const [form, setForm] = useState({ parkingCode: '', plateNumber: '' });
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const res = await enterCar({ ...form, userId });
      setTicket(res.data.ticket); // assume response contains ticket
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Entry failed');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Car Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Parking Code"
          value={form.parkingCode}
          onChange={(e) => setForm({ ...form, parkingCode: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Plate Number"
          value={form.plateNumber}
          onChange={(e) => setForm({ ...form, plateNumber: e.target.value })}
          className="border p-2 w-full"
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
      </form>

      {ticket && (
        <div className="mt-6 p-4 bg-gray-800 text-white rounded">
          <h3 className="text-lg font-bold">Ticket Generated</h3>
          <p>Ticket ID: {ticket.id}</p>
          <p>Amount: {ticket.amount} RWF</p>
          <p>Parking Code: {ticket.parkingCode}</p>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default CarEntry;
