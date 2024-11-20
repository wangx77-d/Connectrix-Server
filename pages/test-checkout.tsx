// pages/test-checkout.tsx
import { useEffect } from 'react';
import getStripe from '@/lib/stripe/stripe';

const TestCheckout = () => {
    useEffect(() => {
        const fetchSessionAndRedirect = async () => {
            try {
                // Make the request to create a checkout session
                const response = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const { id } = await response.json();

                // Redirect to checkout using the session ID
                const stripe = await getStripe();
                const result = await stripe?.redirectToCheckout({
                    sessionId: id,
                });

                console.log('result', result);

                // Handle errors (if any)
                if (result?.error) {
                    console.error(result.error.message);
                }
            } catch (error) {
                console.error('Error creating checkout session:', error);
            }
        };

        fetchSessionAndRedirect();
    }, []);

    return <div>Redirecting to Stripe Checkout...</div>;
};

export default TestCheckout;
