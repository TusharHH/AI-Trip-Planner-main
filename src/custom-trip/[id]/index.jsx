import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Divider,
} from '@mui/material';

// Dummy data for the trip plan (Replace with API data when available)
const dummyTripPlan = [
  {
    day: 1,
    title: "Arrival and City Tour",
    activities: [
      { time: "09:00", description: "Arrival at the destination and check in at the hotel." },
      { time: "11:00", description: "City tour: Visit the museum, park, and historical landmarks." },
      { time: "14:00", description: "Lunch at a local restaurant." },
      { time: "17:00", description: "Evening stroll through the local market." },
    ],
  },
  {
    day: 2,
    title: "Adventure and Leisure",
    activities: [
      { time: "08:00", description: "Breakfast at the hotel." },
      { time: "10:00", description: "Outdoor adventure: Hiking on nearby trails." },
      { time: "13:00", description: "Picnic lunch amidst nature." },
      { time: "16:00", description: "Relax at the beach or indulge in a spa session." },
    ],
  },
  {
    day: 3,
    title: "Cultural Experience",
    activities: [
      { time: "09:00", description: "Visit local markets." },
      { time: "11:00", description: "Participate in a cooking class for regional cuisine." },
      { time: "14:00", description: "Lunch and a cultural exchange session." },
      { time: "16:00", description: "Attend a local cultural show." },
    ],
  },
];

const TripPlanPage = () => {
  const [tripPlan, setTripPlan] = useState([]);

  // Simulate API call using useEffect
  useEffect(() => {
    // In a real scenario, replace this with an API call (using fetch/axios)
    // For example:
    // fetch('https://api.example.com/tripPlan')
    //   .then(response => response.json())
    //   .then(data => setTripPlan(data));
    
    // Using dummy data for now:
    setTripPlan(dummyTripPlan);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 4 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Trip Itinerary
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Detailed plan for your trip, day-by-day.
      </Typography>
      <Divider sx={{ marginY: 2 }} />
      <Grid container spacing={4}>
        {tripPlan.map((dayPlan) => (
          <Grid item xs={12} md={4} key={dayPlan.day}>
            <Card elevation={3}>
              <CardHeader
                title={`Day ${dayPlan.day}: ${dayPlan.title}`}
                sx={{ backgroundColor: 'primary.main', color: 'white' }}
              />
              <CardContent>
                {dayPlan.activities.map((activity, index) => (
                  <Box key={index} mb={2}>
                    <Typography variant="subtitle2" color="textSecondary">
                      {activity.time}
                    </Typography>
                    <Typography variant="body1">
                      {activity.description}
                    </Typography>
                    {index !== dayPlan.activities.length - 1 && (
                      <Divider sx={{ marginY: 1 }} />
                    )}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TripPlanPage;
