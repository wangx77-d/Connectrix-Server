import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/withAuth';
import { getItemByItemId } from '@/lib/itemService';

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    try {
        const { user } = req as { user?: { userId: string } };
        const userId = user?.userId;

        const { itemId } = req.query;

        if (!itemId || typeof itemId !== 'string') {
            return res
                .status(400)
                .json({ message: 'Valid item ID is required' });
        }

        const item = await getItemByItemId(itemId);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (item.sellerId !== userId) {
            return res.status(403).json({ message: 'Item not found' });
        }

        return res.status(200).json(item);
    } catch (error) {
        console.error('Error fetching item:', error);
        return res.status(500).json({ message: 'Error fetching item' });
    }
};

export default withAuth(handler);
