import React from 'react'
import PlaceCardItem from './PlaceCardItem'

function PlacesToVisit({ trip }) {
  // ✅ Ensure itinerary is always an array
  const itinerary = Array.isArray(trip?.TripData?.itinerary)
    ? trip?.TripData?.itinerary
    : trip?.TripData?.itinerary
      ? [trip?.TripData?.itinerary]
      : []

  return (
    <div>
      <h2 className='font-bold text-xl'>Places to Visit</h2>
      <div>
        {itinerary.map((item, index) => (
          <div key={index}>
            <h2 className='font-medium text-lg'>Day {item?.day}</h2>
            <div className='grid md:grid-cols-2 gap-4'>
              {(Array.isArray(item?.plan) ? item?.plan : item?.plan ? [item?.plan] : []).map((place, idx) => (
                <div key={idx} className='my-3'>
                  <h2 className='font-medium text-sm text-orange-600'>{place?.timeTravel}</h2>
                  <PlaceCardItem place={place} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlacesToVisit
