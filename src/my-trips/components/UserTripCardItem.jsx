import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function UserTripCardItem({trip}) {
  const [photoUrl,setPhotoUrl] = useState();

  useEffect(()=>{
    trip&&GetPlacePhoto();
    console.log(trip._id)
  },[trip])

  const GetPlacePhoto=async()=>{
    const data={
      textQuery:trip?.userSelection?.location.label
    }
    const result= await GetPlaceDetails(data).then(resp=>{
      const photoUrl=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[3].name)
      setPhotoUrl(photoUrl);
    })
  }
  return (
   <Link to={'/view-trip/'+trip?._id}>
    <div className='transition-all hover:scale-105 hover:shadow-sm'>
     <img src={photoUrl ? photoUrl : '/public/road-trip-vacation.jpg'}  className='rounded-xl h-[200px] w-full object-cover'/>
      <div>
      <h2 className='text-lg font-medium'>{trip?.userSelection?.location?.label}</h2>
      <h2 className="text-sm text-gray-600" >{trip?.userSelection?.noOfDays} Days trip with {trip?.userSelection?.budget} </h2>
      </div>
    </div>
   </Link>
  )
}

export default UserTripCardItem
