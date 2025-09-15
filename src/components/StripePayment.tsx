'use client';

import { useState } from 'react';
// Temporarily disabled Stripe imports due to compatibility issues
// import { loadStripe } from '@stripe/stripe-js';
// import {
//   Elements,
//   CardElement,
//   useStripe,
//   useElements
// } from '@stripe/react-stripe-js';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentIntent: { id: string; status: string }) => void;
  onError: (error: string) => void;
  metadata?: Record<string, string>;
}

function PaymentForm({ amount, onSuccess, onError, metadata }: PaymentFormProps) {
  // const stripe = useStripe();
  // const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Temporarily disabled Stripe functionality
    setError('Payment functionality is temporarily disabled for maintenance.');
    onError('Payment functionality is temporarily disabled for maintenance.');
    return;

    // if (!stripe || !elements) {
    //   return;
    // }

    // setLoading(true);
    // setError(null);

    // try {
    //   // Create payment intent
    //   const response = await fetch('/api/stripe/create-payment-intent', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       amount,
    //       currency: 'usd',
    //       metadata: {
    //         ...metadata,
    //         timestamp: new Date().toISOString(),
    //       },
    //     }),
    //   });

    //   const { clientSecret, error: apiError } = await response.json();

    //   if (apiError) {
    //     throw new Error(apiError);
    //   }

    //   // Confirm payment
    //   const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
    //     clientSecret,
    //     {
    //       payment_method: {
    //         card: elements.getElement(CardElement)!,
    //       },
    //     }
    //   );

    //   if (stripeError) {
    //     throw new Error(stripeError.message);
    //   }

    //   if (paymentIntent.status === 'succeeded') {
    //     onSuccess(paymentIntent);
    //   }
    // } catch (err) {
    //   const errorMessage = err instanceof Error ? err.message : 'Payment failed';
    //   setError(errorMessage);
    //   onError(errorMessage);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-300 rounded-lg">
        <div className="text-gray-500 text-center py-8">
          Payment form temporarily disabled for maintenance
        </div>
        {/* <CardElement
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
        /> */}
      </div>
      
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={true}
        className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold cursor-not-allowed"
      >
        Payment Disabled
      </button>
    </form>
  );
}

interface StripePaymentProps {
  amount: number;
  onSuccess: (paymentIntent: { id: string; status: string }) => void;
  onError: (error: string) => void;
  metadata?: Record<string, string>;
}

export default function StripePayment({ amount, onSuccess, onError, metadata }: StripePaymentProps) {
  return (
    <PaymentForm
      amount={amount}
      onSuccess={onSuccess}
      onError={onError}
      metadata={metadata}
    />
    // <Elements stripe={stripePromise}>
    //   <PaymentForm
    //     amount={amount}
    //     onSuccess={onSuccess}
    //     onError={onError}
    //     metadata={metadata}
    //   />
    // </Elements>
  );
}
