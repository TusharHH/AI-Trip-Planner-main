import React from 'react'
import PlaceCardItem from './PlaceCardItem'

function PlacesToVisit({ trip }) {
  return (
    <div>
      <h2 className='text-xl font-bold'>Places to Visit</h2>
      {trip?.TripData?.itinerary?.map((day) => (
        <div key={day._id} className="my-6">
          <h2 className='mb-4 text-lg font-medium'>Day {day.day}</h2>
          <div className='grid gap-4 md:grid-cols-2'>
            {day.plan?.map((place) => (
              <div key={place._id} className='my-3'>
                <h2 className='text-sm font-medium text-orange-600'>
                  {place.timeTravel}
                </h2>
                <PlaceCardItem place={place} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
export default PlacesToVisit
