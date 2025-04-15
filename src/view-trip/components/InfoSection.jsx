import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'
import { IoMdSend } from "react-icons/io";
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import ImageWithFallback from '@/components/custom/ImageWithFallback';
import { Badge } from 'lucide-react';

function InfoSection({ trip }) {
  // Simplified photo handling
  const photoUrl = trip?.TripData?.hotelOptions?.[0]?.hotelImageUrl || '/road-trip-vacation.jpg';

  return (
    <div>
      <ImageWithFallback
        src={photoUrl}
        fallback="/road-trip-vacation.jpg"
        alt="Trip Location"
        className="h-[330px] w-full object-cover rounded-xl"
      />
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-2 my-6'>
          <h2 className='text-2xl font-bold'>
            {trip?.userSelection?.location?.label}
          </h2>
          <div className='flex flex-wrap gap-6 mt-4'>
            <Badge variant="secondary">🗓️ {trip?.userSelection?.noOfDays} Days</Badge>
            <Badge variant="secondary">👩‍👧‍👦 {trip?.userSelection?.traveler}</Badge>
            <Badge variant="secondary">💵 {trip?.userSelection?.budget} Budget</Badge>
          </div>
        </div>
        <Button>
          <IoMdSend />
        </Button>
      </div>
    </div>
  );
}

export default InfoSection