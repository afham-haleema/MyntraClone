import React, { useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect } from 'react';
import { CartContext } from '../context/CartContext';

const stripePromise = loadStripe('pk_test_51QcWS6KOopA7saH3rjrewHY0Y6SMesp6d2PQOqJoePf4tXptERgmp17BPefBwuTfS27v4WfMMv9qtSP5WOT0jl0l00cD8NDb8E');

function Checkout({ cartItems, totalAmount , address}) {
  const {clearCart}=useContext(CartContext)
  const shipping = totalAmount > 1000 ? 0 : 50;

  const handleStripeCheckout = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token=user?.token

    if(!token){
      alert("No token found")
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        cartItems,
        totalAmount: totalAmount + shipping,
        address:address
      }),
    });

    const session = await response.json();
    if (!session.id) {
      console.error("Stripe session ID missing:", session);
      alert("Failed to create Stripe session.");
      return;
    }
    console.log("Redirecting to Stripe with session:", session);

    const stripe = await stripePromise;
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      alert(result.error.message);
    }

    await clearCart();
  };

  

  // Automatically trigger checkout when component mounts
  useEffect(() => {
    handleStripeCheckout();
  }, []);

  return null;
}

export default Checkout;
