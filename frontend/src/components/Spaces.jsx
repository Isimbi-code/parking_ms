import { useEffect, useState } from 'react';
import { getAvailableSpaces, createSpace, getParkings } from '../services/api';

const AvailableSpaces = () => {
  const [spaces, setSpaces] = useState([]);
  const [parkings, setParkings] = useState([]);
  const [selectedParkingId, setSelectedParkingId] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ 
    spaceNumber: '', 
    parkingId: selectedParkingId 
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // You can adjust this number

  // Fetch parkings and spaces
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all parkings for the dropdown
        const parkingsRes = await getParkings();
        setParkings(parkingsRes.data.data.parkings);
        
        // Set default parkingId if available
        if (parkingsRes.data.data.parkings.length > 0) {
          const defaultId = parkingsRes.data.data.parkings[0].id;
          setSelectedParkingId(defaultId);
          setForm(prev => ({ ...prev, parkingId: defaultId }));
        }
      } catch (err) {
        console.error('Failed to fetch parkings:', err);
      }
    };
    fetchData();
  }, []);

  // Fetch spaces when selectedParkingId changes
  useEffect(() => {
    if (!selectedParkingId) return;
    
    const fetchSpaces = async () => {
      try {
        const res = await getAvailableSpaces(selectedParkingId);
        setSpaces(res.data.data.spaces);
      } catch (err) {
        console.error('Failed to fetch spaces:', err);
      }
    };
    fetchSpaces();
  }, [selectedParkingId]);

  const handleAdd = async () => {
    try {

      // Validate spaceNumber is a number
      if (isNaN(form.spaceNumber)) {
        alert('Space number must be a valid number');
        return;
      }  
      await createSpace(form);
      alert('Space added successfully!');
      setShowAddModal(false);
      // Refresh spaces
      const res = await getAvailableSpaces(selectedParkingId);
      setSpaces(res.data.data.spaces);
    } catch (err) {
      console.error('Failed to add space:', err);
      alert('Failed to add space');
    }
  };

    // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = parkings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(parkings.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);



  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Available Spaces</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Space
        </button>
      </div>

      {/* Parking Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Parking:
        </label>
        <select
          value={selectedParkingId}
          onChange={(e) => {
            setSelectedParkingId(e.target.value);
            setForm(prev => ({ ...prev, parkingId: e.target.value }));
          }}
          className="w-full md:w-64 border border-gray-300 rounded-md p-2"
        >
          {parkings.map(parking => (
            <option key={parking.id} value={parking.id}>
              {parking.name} (ID: {parking.id})
            </option>
          ))}
        </select>
      </div>

      {/* Spaces Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Space Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parking ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {spaces.length > 0 ? (
              spaces.map(space => (
                <tr key={space.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {space.spaceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {space.parkingId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {space.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                  No spaces available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
          {totalPages >= 1 && (
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">
                      {indexOfLastItem > parkings.length ? parkings.length : indexOfLastItem}
                    </span>{' '}
                    of <span className="font-medium">{parkings.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => paginate(1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">First</span>
                      &laquo;
                    </button>
                    <button
                      onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === number
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Next
                    </button>
                    <button
                      onClick={() => paginate(totalPages)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Last</span>
                      &raquo;
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}



      {/* Add Space Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add New Space</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Space Number
                </label>
                <input
                  type="text"
                  value={form.spaceNumber}
                  onChange={(e) => setForm({ ...form, spaceNumber: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="e.g., 101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parking
                </label>
                <select
                  value={form.parkingId}
                  onChange={(e) => setForm({ ...form, parkingId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  {parkings.map(parking => (
                    <option key={parking.id} value={parking.id}>
                      {parking.name} (ID: {parking.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Space
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableSpaces;