// StripeContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

// Create the context
const StripeContext = createContext({ stripe: null, loading: true });

// Create a custom hook to use the stripe context
export const useStripeContext = () => useContext(StripeContext);

// Create the provider component
export const StripeProvider = ({ publishableKey, children }: any) => {
  const [stripeInstance, setStripeInstance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Stripe
    const initializeStripe = async () => {
      try {
        const stripe = await loadStripe(publishableKey);
        setStripeInstance(stripe);
      } catch (error) {
        console.error("Failed to initialize Stripe:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeStripe();
  }, [publishableKey]);

  return (
    <StripeContext.Provider value={{ stripe: stripeInstance, loading }}>
      {children}
    </StripeContext.Provider>
  );
};
