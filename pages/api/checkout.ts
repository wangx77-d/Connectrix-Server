// pages/api/checkout_sessions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-10-28.acacia',
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log('req', req.headers);
    if (req.method === 'POST') {
        try {
            // Example session creation logic
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'Sample Product',
                            },
                            unit_amount: 200, // 20 USD in cents
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${
                    req.headers.origin || process.env.LOCAL_URL
                }/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${
                    req.headers.origin || process.env.LOCAL_URL
                }/cancel`,
            });

            res.status(200).json({ id: session.id });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}
