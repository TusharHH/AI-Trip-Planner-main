import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { getFunctions, httpsCallable } from "firebase/functions";
import { Button } from "./button";
// import { app } from "../service/firebaseConfig";

const stripePromise = loadStripe("pk_test_51R6FKRGjQv52GoWegbFU1DVwkUrOIGCs4OL3dFISnuamSU1HM2jolwkO76pYcVDibIfoaLDeMnrzjLLcyO7kbeJm008vJ9ZGsI");

const PricingCard = ({ plan }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // const functions = getFunctions(app);
      // const createCheckoutSession = httpsCallable(functions, "createStripeCheckoutSession");

      // const { data } = await createCheckoutSession({
      //   priceId: plan.stripePriceId, 
      //   successUrl: `${window.location.origin}/success`,
      //   cancelUrl: `${window.location.origin}/cancel`,
      // });

      // const stripe = await stripePromise;
      // const { error } = await stripe.redirectToCheckout({
      //   sessionId: data.sessionId, 
      // });

      // if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col p-6 mx-auto max-w-lg text-center bg-white rounded-lg border shadow-lg dark:bg-gray-800 dark:text-white">
      <h3 className="mb-4 text-2xl font-semibold">{plan?.title}</h3>
      <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">{plan?.description}</p>
      <div className="flex justify-center items-baseline my-8">
        <span className="mr-2 text-5xl font-extrabold">${plan?.price}</span>
        <span className="text-gray-500 dark:text-gray-400">/{plan?.duration}</span>
      </div>
      <ul className="mb-8 space-y-4 text-left">
        {plan?.features?.map((feature, index) => (
          <li key={index} className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button onClick={plan.onCtaClick || (() => {})}>
        {plan.ctaText}
      </Button>
      
      {/* <button 
        onClick={handleCheckout}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : plan?.ctaText}
      </button>
       */}

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
    </div>
  );
};

export const PricingSection = ({ heading, description, plans }) => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-white">{heading}</h2>
          <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">{description}</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
};
