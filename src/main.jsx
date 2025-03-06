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

const steps = [
  {
    selector: '.first-step',
    content: 'Enter the state or city you want to go!',
  },
  {
    selector: '.second-step',
    content: 'Select the number of days you want to go!',
  },
  {
    selector: '.third-step',
    content: 'Enter your Budget',
  },
  {
    selector: '.fourth-step',
    content: 'With who are you coming?',
  },
  {
    selector: '.fifth-step',
    content: 'Fianly press this button to make the plan!',
  }
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/create-trip',
    element: <CreateTrip />,
  },
  {
    path: '/view-trip/:tripId',
    element: <Viewtrip />,
  },
  {
    path: '/my-trips',
    element: <MyTrips />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <TourProvider
        steps={steps}
        styles={{
          popover: (base) => ({
            ...base,
            backgroundColor: '#1e293b',
            color: '#fff',
            borderRadius: '10px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
            padding: '16px',
          }),
          dot: (base, { current }) => ({
            ...base,
            backgroundColor: current ? '#06b6d4' : '#94a3b8',
          }),
          close: (base) => ({
            ...base,
            color: '#fff',
            fontSize: '18px',
          }),
          arrow: (base) => ({
            ...base,
            color: '#1e293b',
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
                    setIsOpen(false); // Close the tour on the last step
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