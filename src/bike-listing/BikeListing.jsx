import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bike, Clock, Users, MapPin } from 'lucide-react';
import api from '../service/api'; // Adjust the path as needed

function BikeListing() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const data = await api.bikes.getAllBikes();
        setBikes(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch bikes');
      } finally {
        setLoading(false);
      }
    };

    fetchBikes();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Rent a Bike in India</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bikes.map((bike) => (
          <div key={bike._id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="h-48 overflow-hidden">
              <img 
                src={bike.image} 
                alt={bike.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">{bike.name}</h2>
                <span className={`px-2 py-1 rounded-full text-xs ${bike.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {bike.available ? 'Available' : 'Booked'}
                </span>
              </div>
              
              <div className="mt-2 flex items-center text-gray-600">
                <Bike className="w-4 h-4 mr-1" />
                <span className="text-sm">{bike.type} • {bike.engine}</span>
              </div>
              
              <div className="mt-2 flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{bike.location}</span>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-xs text-gray-500">Hourly</p>
                  <p className="font-bold">₹{bike.pricePerHour}</p>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <p className="text-xs text-gray-500">Daily</p>
                  <p className="font-bold">₹{bike.pricePerDay}</p>
                </div>
              </div>
              
              <Link 
                to={`/bikes/${bike._id}`} 
                className="mt-4 block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-2 rounded transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BikeListing;