import { NextApiRequest, NextApiResponse } from 'next';
import { createOrder } from '@/lib/orderService';
import { withAuth } from '@/lib/withAuth';

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const buyerId = (req as any).user?.userId;
        if (!buyerId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const {
            item: { itemId, sellerId },
            totalAmount,
        } = req.body;

        const order = await createOrder({
            buyerId,
            sellerId,
            itemId,
            totalAmount,
        });

        return res.status(200).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({
            message: 'Error creating order',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export default withAuth(handler);
