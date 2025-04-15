import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';
import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const tripApi = {
  getTrip: (id) => api.get(`/trips/${id}`),
};

function ViewTrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId) {
      getTripData();
    }
  }, [tripId]);

  const getTripData = async () => {
    try {
      setLoading(true);
      const response = await tripApi.getTrip(tripId);
      
      if (response.data) {
        const transformedData = {
          ...response.data,
          TripData: response.data.tripData, // Map tripData to TripData
          userSelection: response.data.userSelections // Map userSelections to userSelection
        };
        console.log("Trip data:", transformedData);
        setTrip(transformedData);
      } else {
        toast.error('No trip found!');
      }
    } catch (error) {
      console.error("Error fetching trip:", error);
      toast.error('Failed to load trip data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">No trip data available</p>
      </div>
    );
  }

  return (
    <div className='p-12 md:px-25 lg:px-44 xl:px:56'>
      <InfoSection trip={trip} />
      <Hotels trip={trip} />
      <PlacesToVisit trip={trip} />
      <Footer trip={trip} />
    </div>
  );
}

export default ViewTrip;