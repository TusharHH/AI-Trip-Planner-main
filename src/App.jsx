import Hero from './components/custom/Hero'
import './App.css'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_GATEWAY_API_KEY);
const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_GATEWAY_API_KEY);

function App() {


  return (
    <>
      <Elements stripe={stripePromise}>
        <Hero />
      </Elements>
    </>
  )
}

export default App
