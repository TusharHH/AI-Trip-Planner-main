import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';

export const PricingCard = ({ plan, loading, stripeReady }) => {
  return (
    <div className="flex flex-col max-w-lg p-6 mx-auto text-center bg-white border rounded-lg shadow-lg dark:bg-gray-800 dark:text-white">
      <h3 className="mb-4 text-2xl font-semibold">{plan.title}</h3>
      <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">{plan.description}</p>
      <div className="flex items-baseline justify-center my-8">
        <span className="mr-2 text-5xl font-extrabold">${plan.price}</span>
        <span className="text-gray-500 dark:text-gray-400">/{plan.duration}</span>
      </div>
      <ul className="mb-8 space-y-4 text-left">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      {/* Render the form if it exists */}
      {plan.form && (
        <div className="mb-4">
          {plan.form}
        </div>
      )}
      
      <button 
        onClick={plan.onCtaClick}
        disabled={loading || !stripeReady}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : plan.ctaText}
      </button>
    </div>
  );
};

export const PricingSection = ({ heading, description, plans, loading, stripeReady }) => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6">
        <div className="max-w-screen-md mx-auto mb-8 text-center lg:mb-12">
          <h2 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-white">{heading}</h2>
          <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">{description}</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <PricingCard 
              key={index} 
              plan={plan}
              loading={loading}
              stripeReady={stripeReady}
            />
          ))}
        </div>
      </div>
    </section>
  );
};