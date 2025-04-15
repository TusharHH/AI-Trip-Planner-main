import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { PricingSection } from '../ui/Pricing';
import { payment } from '../../service/api';
import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

function Hero() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const user = JSON.parse(localStorage.getItem('user'));
  const [selectedPlan, setSelectedPlan] = useState(null);

  const openPaymentModal = (plan) => {
    setPaymentError('');
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };
  const handlePayment = async (stripePriceId, planType) => {
    if (!stripe || !elements) {
      console.error('Stripe not initialized');
      return;
    }

    try {
      setLoading(true);
      setPaymentError('');

      // Create payment intent with user type
      const { clientSecret } = await payment.createPaymentIntent({
        userId: user?._id,
        stripePriceId,
        userType: user?.type || 'user', // Send current user type
        planType // 'basic' or 'pro'
      });

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setPaymentError("Payment failed: Card element not found.");
        return;
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement }
      });

      if (error) {
        setPaymentError(error.message);
        throw error;
      }

      // Handle successful payment with user type
      const response = await payment.handlePaymentSuccess({
        paymentIntentId: paymentIntent.id,
        userId: user._id,
        planType, // Send which plan was purchased
        userType: user?.type || 'user'
      });

      setShowPaymentModal(false);
      console.log('Payment successful:', response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/custom-trip');
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentError(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const closePaymentModal = () => {
    setShowPaymentModal(false);
  };

  // Modify the basic plan CTA to trigger the payment popup
  const plans = [
    {
      title: "Free Plan",
      description: "Try our service for free.",
      price: "0.00",
      duration: "lifetime",
      stripePriceId: null,
      ctaText: "Get Started",
      features: ["Use Our AI to plan your Trips"],
      onCtaClick: () => {
        if (user) {
          navigate('/create-trip');
        } else {
          navigate('/login');
        }
      }
    },
    {
      title: "Basic Plan",
      description: "Perfect for individuals.",
      price: "9.99",
      duration: "lifetime",
      stripePriceId: "price_12345",
      ctaText: "Upgrade Now",
      planType: "subscribedUser",
      features: [
        "Use Our AI to plan your Trips",
        "Get Access to our community",
      ],
      onCtaClick: () => openPaymentModal(plans[1])
    },
    {
      title: "Pro Plan",
      description: "Ideal for Tirp lovers.",
      price: "19.99",
      duration: "lifetime",
      stripePriceId: "price_67890",
      planType: "proUser",
      ctaText: "Upgrade Now",
      features: [
        "Use Our AI to plan your Trips",
        "Get Access to our community",
        "Rent our Bullet bikes at cheap prices"
      ],
      onCtaClick: () => openPaymentModal(plans[2])
    }
  ];

  return (
    <div className='flex flex-col items-center px-4 mx-auto sm:px-6 lg:px-8 gap-9 max-w-7xl'>
      <div className='mt-16 text-center'>
        <h1 className='text-4xl font-extrabold sm:text-5xl lg:text-6xl'>
          <span className='text-[#f56551]'>Discover Your Next Adventure with AI:</span>
          <br className='hidden sm:block' />
          Personalized Itineraries at Your Fingertips
        </h1>

        <p className='max-w-3xl mx-auto mt-6 text-xl text-gray-500'>
          Your personal trip planner and travel curator, creating custom itineraries
          tailored to your interests and budget
        </p>

        <Link to={'/create-trip'} className='inline-block mt-8'>
          <Button>Get Started, It&apos;s Free</Button>
        </Link>
      </div>

      <PricingSection
        heading="Choose Your Plan"
        description="Pick a plan that suits your needs."
        plans={plans}
        loading={loading}
        stripeReady={!!stripe && !!elements}
      />

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-bold">Enter Payment Details</h2>
            <div className="mt-4">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
              {paymentError && (
                <div className="mt-2 text-sm text-red-500">{paymentError}</div>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={closePaymentModal} disabled={loading}>Cancel</Button>
              <Button
                onClick={() => handlePayment(selectedPlan.stripePriceId, selectedPlan.planType)}
                disabled={loading}
              >
                {loading ? 'Processing...' : `Pay $${selectedPlan.price}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hero;
