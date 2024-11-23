import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/withAuth';
import { getOrdersByUserId } from '@/lib/orderService';

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    try {
        const { user } = req as { user?: { userId: string } };

        if (!user?.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userId = user.userId;

        const order = await getOrdersByUserId(userId, true);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        return res.status(500).json({ message: 'Error fetching order' });
    }
};

export default withAuth(handler);
