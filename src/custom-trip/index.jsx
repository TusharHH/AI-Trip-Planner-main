import React from 'react';

const trips = [
  {
    id: 1,
    name: "Mumbai Explorer",
    places: [
      {
        id: "ChIJwe1EZjDG5zsRaYxkjY_tpF0",
        name: "Mumbai",
        image: "https://lh3.googleusercontent.com/a-/ALV-UjUiD2XCXtmMSeVVORrPRzxoEjtcLqjwzxk9GKoeQSBxfjnqUmRjrg=s100-p-k-no-mo",
        link: "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sCIHM0ogKEICAgIDy8LjK9gE!2e10"
      }
    ]
  },
  {
    id: 2,
    name: "Goa Beach Getaway",
    places: [
      {
        id: "ChIJG2U48Nq5vzsRIT7vXy5xL3U",
        name: "Goa",
        image: "https://example.com/goa-image.jpg",
        link: "https://www.google.com/maps?q=Goa"
      }
    ]
  },
  {
    id: 3,
    name: "Delhi Heritage Tour",
    places: [
      {
        id: "ChIJL_P_CXMEDTkRw0ZdG-0GVvw",
        name: "Delhi",
        image: "https://example.com/delhi-image.jpg",
        link: "https://www.google.com/maps?q=Delhi"
      }
    ]
  }
];

function CustomTrip() {
  return (
    <div className='p-8'>
      <h1 className='mb-4 text-2xl font-bold'>Custom Trips</h1>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {trips.map((trip) => (
          <div key={trip.id} className='p-4 border rounded-lg shadow-lg'>
            <h2 className='mb-2 text-xl font-semibold'>{trip.name}</h2>
            {trip.places.map((place) => (
              <div key={place.id} className='mb-4'>
                <img src={place.image} alt={place.name} className='object-cover w-full h-40 rounded-lg' />
                <h3 className='mt-2 text-lg font-medium'>{place.name}</h3>
                <a href={place.link} target='_blank' rel='noopener noreferrer' className='text-blue-500'>View on Google Maps</a>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomTrip;
