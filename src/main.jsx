import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import CreateTrip from './create-trip/index.jsx';
import Header from './components/custom/Header.jsx';
import { Toaster } from './components/ui/sonner.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Viewtrip from './view-trip/[tripId]/index.jsx';
import MyTrips from './my-trips/index.jsx';
import { TourProvider } from '@reactour/tour';
import { Button } from './components/ui/button.jsx';
import CustomTrip from './custom-trip/index.jsx';
import CommunityPage from './community/Community.jsx';
import BikeListing from './bike-listing/BikeListing.jsx';
import BikeDetails from './bike-listing/bike-details/BikeDetails.jsx';

const steps = [
  {
    selector: '.first-step',
    content: 'Enter the state/city you would like to visit!',
  },
  {
    selector: '.second-step',
    content: 'Enter the days of stay!',
  },
  {
    selector: '.third-step',
    content: 'Select your budget',
  },
  {
    selector: '.fourth-step',
    content: 'With who are you coming?',
  },
  {
    selector: '.fifth-step',
    content: 'Get started!',
  }
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/community',
    element: <CommunityPage/>
  },
  {
    path: '/create-trip',
    element: <CreateTrip />,
  },
  {
    path:'/bikes',
    element:<BikeListing/>
  },
  {
    path:'bikes/:id',
    element:<BikeDetails/>
  },
  {
    path: '/view-trip/:tripId',
    element: <Viewtrip />,
  },
  {
    path: '/my-trips',
    element: <MyTrips />,
  },
  {
    path: '/custom-trip',
    element: <CustomTrip />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <TourProvider
        steps={steps}
        styles={{
          popover: (base) => ({
            ...base,
            backgroundColor: 'hsl(var(--popover))',
            color: 'hsl(var(--popover-foreground))',
            borderRadius: 'var(--radius)',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
            padding: '20px',
            maxWidth: '300px',
          }),
          dot: (base, { current }) => ({
            ...base,
            backgroundColor: current ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
          }),
          close: (base) => ({
            ...base,
            color: 'hsl(var(--primary))',
            fontSize: '18px',
            top: '10px',
            right: '10px',
          }),
          arrow: (base) => ({
            ...base,
            color: 'hsl(var(--popover))',
          }),
        }}
        components={{
          Navigation: ({ currentStep, steps, setCurrentStep, setIsOpen }) => (
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => setCurrentStep((s) => (s > 0 ? s - 1 : s))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button
                onClick={() => {
                  if (currentStep === steps.length - 1) {
                    setIsOpen(false);
                  } else {
                    setCurrentStep((s) => s + 1);
                  }
                }}
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          ),
        }}
      >
        <Header />
        <Toaster />
        <RouterProvider router={router} />
      </TourProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);