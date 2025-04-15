import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserTripCardItem from './components/UserTripCardItem';

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const tripApi = {
  getUserTrips: (email) => api.get(`/trips/user/${email}`),
};

function MyTrips() {
    const navigate = useNavigate();
    const [userTrips, setUserTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserTrips();
    }, []);

    const getUserTrips = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const response = await tripApi.getUserTrips(user.email);
            
            if (response.data && Array.isArray(response.data)) {
                // Transform data to match your frontend expectations
                const transformedTrips = response.data.map(trip => ({
                    ...trip,
                    TripData: trip.tripData,  // Map tripData to TripData
                    userSelection: trip.userSelections  // Map userSelections to userSelection
                }));
                setUserTrips(transformedTrips);
            } else {
                setUserTrips([]);
            }
        } catch (error) {
            console.error("Error fetching trips:", error);
            // Handle error (show toast, etc.)
        } finally {
            setLoading(false);
        }
    };
   
    return (
        <div className='px-5 mt-12 sm:px-10 md:px-32 lg:px-56 xl:px-72"'>
            <h2 className='mb-10 text-3xl font-bold'>My Trips</h2>
            <div className='grid grid-cols-2 gap-5 my-3 md:grid-cols-3'>
                {loading ? (
                    // Skeleton loading
                    [1,2,3,4,5,6].map((item, index) => (
                        <div key={index} className='h-[200px] w-full bg-slate-200 animate-pulse rounded-xl'></div>
                    ))
                ) : userTrips.length > 0 ? (
                    userTrips.map((trip, index) => (
                        <UserTripCardItem trip={trip} key={trip._id || index} />
                    ))
                ) : (
                    <div className="py-10 text-center col-span-full">
                        <p>No trips found. Start by creating a new trip!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyTrips;