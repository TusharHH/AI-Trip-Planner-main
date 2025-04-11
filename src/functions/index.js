import { onCall } from 'firebase-functions/v2/https';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe('sk_test_51R6FKRGjQv52GoWebjwbaaAEhSsbPuck0QdbwxEv2iewKyzYPrzJvunSspMAqJEtPyLw0Uj91VpktlgJivZm8IJl002avMe6M0');

export const createStripeCheckoutSession = onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new Error('You must be logged in to make a payment.');
  }

  try {
    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: data.priceId, // This must be a valid Stripe Price ID
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      metadata: {
        userId: context.auth.uid, // Store user ID for tracking
      },
    });

    return { checkoutUrl: session.url }; // Return checkout URL instead of session ID
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    throw new Error(error.message);
  }
});
import { onCall } from 'firebase-functions/v2/https';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe('sk_test_51R6FKRGjQv52GoWebjwbaaAEhSsbPuck0QdbwxEv2iewKyzYPrzJvunSspMAqJEtPyLw0Uj91VpktlgJivZm8IJl002avMe6M0');

export const createStripeCheckoutSession = onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new Error('You must be logged in to make a payment.');
  }

  try {
    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: data.priceId, // This must be a valid Stripe Price ID
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      metadata: {
        userId: context.auth.uid, // Store user ID for tracking
      },
    });

    return { checkoutUrl: session.url }; // Return checkout URL instead of session ID
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    throw new Error(error.message);
  }
});
