import React from 'react'
import { Link } from 'react-router-dom'
import HotelCardItem from './HotelCardItem'

function Hotels({ trip }) {
  return (
    <div>
      <h2 className='mt-5 text-xl font-bold'>Hotel Recommendations</h2>
      <div className='grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4'>
        {trip?.TripData?.hotelOptions?.map((hotel, index) => (
          <HotelCardItem key={hotel._id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}

export default Hotels