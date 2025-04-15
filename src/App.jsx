import Hero from './components/custom/Hero'
import './App.css'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_GATEWAY_API_KEY);
const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_GATEWAY_API_KEY);


function App() {

  // In your App component
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Elements stripe={stripePromise}>
        <Hero />
      </Elements>
    </>
  )
}

export default App
