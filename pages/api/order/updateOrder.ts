import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/withAuth';
import { updateOrder } from '@/lib/orderService';

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> => {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    try {
        const { orderId, ...updateData } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: 'Order ID is required' });
        }
        // Update the item
        const updatedOrder = await updateOrder(orderId, updateData);

        return res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error updating item:', error);
        return res.status(500).json({ message: 'Error updating item' });
    }
};

export default withAuth(handler);
