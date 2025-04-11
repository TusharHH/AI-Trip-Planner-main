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

  useEffect(() => {
    const fetchBikeDetails = async () => {
      try {
        setLoading(true);
        const bikeData = await api.bikes.getBikeById(id);
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

  if (loading) return <div className="text-center py-8">Loading bike details...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!bike) return <div className="text-center py-8">Bike not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bike Image */}
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img 
            src={bike.image} 
            alt={bike.name} 
            className="w-full h-full object-cover"
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
          
          <div className="mt-4 flex items-center space-x-4">
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
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Price Calculator */}
      <div className="mt-12 bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Rental Calculator</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rental Type</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Helmets (₹100 each)</label>
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
        
        <div className="mt-8 p-4 bg-white rounded border">
          <h3 className="text-lg font-semibold mb-2">Price Breakdown</h3>
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
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₹{calculateTotal()}</span>
            </div>
          </div>
          
          <button className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold text-lg transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default BikeDetails;