import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { PricingSection } from '../ui/Pricing';

function Hero() {
  
  const navigate = useNavigate();

  const plans = [
    {
      title: "Basic Plan",
      description: "Perfect for individuals.",
      price: "9.99",
      duration: "month",
      stripePriceId: "price_12345",
      ctaText: "Get Started",
      features: ["Use Our AI to plan you Trips"],
    },
    {
      title: "Pro Plan",
      description: "Ideal for professionals.",
      price: "19.99",
      duration: "month",
      stripePriceId: "price_67890",
      ctaText: "Upgrade Now",
      features: ["Use Our AI to plan you Trips", "Get Access to our community", "Get custom and more detailed Plans", "Don't have bike??, Rent our Bullet bikes in cheap price"],
      onCtaClick: () => navigate('/community') 
    },
  ];

  return (
    <div className='flex flex-col items-center mx-auto px-4 sm:px-6 lg:px-8 gap-9 max-w-7xl'>
      <div className='text-center mt-16'>
        <h1 className='font-extrabold text-4xl sm:text-5xl lg:text-6xl'>
          <span className='text-[#f56551]'>Discover Your Next Adventure with AI:</span> 
          <br className='hidden sm:block'/>
          Personalized Itineraries at Your Fingertips
        </h1>

        <p className='mt-6 text-xl text-gray-500 max-w-3xl mx-auto'>
          Your personal trip planner and travel curator, creating custom itineraries 
          tailored to your interests and budget
        </p>
        
        <Link to={'/create-trip'} className='mt-8 inline-block'>
          <Button>Get Started, It&#39;s Free</Button>
        </Link>
      </div>

      <PricingSection heading="Choose Your Plan" description="Pick a plan that suits your needs." plans={plans} />
  
    </div>
  )
}

export default Hero;