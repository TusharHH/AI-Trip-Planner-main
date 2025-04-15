import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Bike, Clock, Calendar, MapPin, Users } from 'lucide-react';
import api from '../../service/api'; // Import your API service

function BikeDetails() {
  const { id } = useParams();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [rentalType, setRentalType] = useState('hour');
  const [duration, setDuration] = useState(1);
  const [insurance, setInsurance] = useState(false);
  const [helmet, setHelmet] = useState(0);

  const [showModal, setShowModal] = useState(false);  

  useEffect(() => {
    const fetchBikeDetails = async () => {
      try {
        setLoading(true);
        const bikeData = await api.bikes.getBikeById(id);
        console.log(bikeData);
        setBike(bikeData);
      } catch (err) {
        setError(err.message || 'Failed to fetch bike details');
      } finally {
        setLoading(false);
      }
    };

    fetchBikeDetails();
  }, [id]);

  const calculateTotal = () => {
    if (!bike) return 0;

    let basePrice = rentalType === 'hour'
      ? bike.pricePerHour * duration
      : bike.pricePerDay * duration;

    let insuranceCost = insurance ? (rentalType === 'hour' ? 50 * duration : 200 * duration) : 0;
    let helmetCost = helmet * 100;

    return basePrice + insuranceCost + helmetCost;
  };

  if (loading) return <div className="py-8 text-center">Loading bike details...</div>;
  if (error) return <div className="py-8 text-center text-red-500">Error: {error}</div>;
  if (!bike) return <div className="py-8 text-center">Bike not found</div>;

  return (
    <div className="container max-w-6xl px-4 py-8 mx-auto">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Bike Image */}
        <div className="overflow-hidden rounded-lg shadow-lg">
          <img
            src={bike.image}
            alt={bike.name}
            className="object-cover w-full h-full"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x400?text=Bike+Image+Not+Available';
            }}
          />
        </div>

        {/* Bike Details */}
        <div>
          <h1 className="text-3xl font-bold">{bike.name}</h1>

          <div className="flex items-center mt-2 text-gray-600">
            <MapPin className="w-5 h-5 mr-1" />
            <span>{bike.location}</span>
          </div>

          <div className="flex items-center mt-4 space-x-4">
            <div className="flex items-center text-gray-600">
              <Bike className="w-5 h-5 mr-1" />
              <span>{bike.type}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-5 h-5 mr-1" />
              <span>{bike.engine}</span>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="mt-2 text-gray-700">{bike.description || 'No description available'}</p>
          </div>

          {bike.features && bike.features.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold">Features</h2>
              <ul className="mt-2 space-y-2">
                {bike.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Price Calculator */}
      <div className="p-6 mt-12 rounded-lg shadow-md bg-gray-50">
        <h2 className="mb-6 text-2xl font-bold">Rental Calculator</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Rental Type</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setRentalType('hour')}
                className={`px-4 py-2 rounded ${rentalType === 'hour' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Hourly (₹{bike.pricePerHour}/hr)
              </button>
              <button
                onClick={() => setRentalType('day')}
                className={`px-4 py-2 rounded ${rentalType === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Daily (₹{bike.pricePerDay}/day)
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Duration ({rentalType === 'hour' ? 'Hours' : 'Days'})
            </label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={insurance}
                onChange={(e) => setInsurance(e.target.checked)}
                className="rounded"
              />
              <span>Add Insurance (₹{rentalType === 'hour' ? '50/hr' : '200/day'})</span>
            </label>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Additional Helmets (₹100 each)</label>
            <input
              type="number"
              min="0"
              max="3"
              value={helmet}
              onChange={(e) => setHelmet(Math.min(3, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        <div className="p-4 mt-8 bg-white border rounded">
          <h3 className="mb-2 text-lg font-semibold">Price Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Base Price:</span>
              <span>₹{rentalType === 'hour' ? bike.pricePerHour * duration : bike.pricePerDay * duration}</span>
            </div>
            {insurance && (
              <div className="flex justify-between">
                <span>Insurance:</span>
                <span>₹{rentalType === 'hour' ? 50 * duration : 200 * duration}</span>
              </div>
            )}
            {helmet > 0 && (
              <div className="flex justify-between">
                <span>Helmets ({helmet}):</span>
                <span>₹{helmet * 100}</span>
              </div>
            )}
            <div className="my-2 border-t border-gray-200"></div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>₹{calculateTotal()}</span>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full py-3 mt-6 text-lg font-bold text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
          >
            Book Now
          </button>

        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
            <h2 className="mb-4 text-2xl font-bold">Terms and Conditions</h2>
            <p className="mb-4 text-gray-700">
              Please make sure to read and understand our rental policies. Helmets must be worn at all times while riding. Damage or loss of the bike may incur additional charges.
            </p>
            <div className="mb-2">
              <strong>Contact Number:</strong> <a href="tel:8928198549" className="text-blue-600 hover:underline">8928198549</a>
            </div>
            <div className="mb-4">
              <strong>Address:</strong> <span>12th Floor, Tower A, Somaiya Bhavan, Vidyavihar (E), Mumbai, Maharashtra 400077</span>
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                onClick={() => {
                  setShowModal(false);
                  alert('Booking Confirmed!');
                }}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default BikeDetails;