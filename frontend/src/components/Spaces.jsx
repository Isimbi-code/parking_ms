import { useEffect, useState } from 'react';
import { getAvailableSpaces, createSpace } from '../services/api';

const AvailableSpaces = () => {
  const [spaces, setSpaces] = useState([]);
  const [form, setForm] = useState({ spaceNumber: '', parkingId: '' });

  useEffect(() => {
    async function fetchSpaces() {
      const res = await getAvailableSpaces();
      setSpaces(res.data.data.spaces);
    }
    fetchSpaces();
  }, []);

  const handleAdd = async () => {
    await createSpace(form);
    alert('Space added!');
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Available Spaces</h2>
      <ul className="list-disc ml-6 text-white">
        {spaces.map((s) => (
          <li key={s.id}>Space {s.spaceNumber} - Parking ID: {s.parkingId}</li>
        ))}
      </ul>

      {/* Admin Form */}
      <div className="mt-6 bg-gray-900 p-4 rounded text-white">
        <h3 className="text-lg">Add New Space (Admin)</h3>
        <input
          type="text"
          placeholder="Space Number"
          className="border p-2 w-full my-2"
          onChange={(e) => setForm({ ...form, spaceNumber: e.target.value })}
        />
        <input
          type="text"
          placeholder="Parking ID"
          className="border p-2 w-full my-2"
          onChange={(e) => setForm({ ...form, parkingId: e.target.value })}
        />
        <button onClick={handleAdd} className="bg-blue-500 px-4 py-2 rounded">Add Space</button>
      </div>
    </div>
  );
};

export default AvailableSpaces;
