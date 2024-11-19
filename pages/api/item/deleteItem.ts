import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/withAuth';
import { deleteItem } from '@/lib/itemService';

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> => {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    try {
        const { itemId } = req.body;

        if (!itemId) {
            return res.status(400).json({ message: 'Item ID is required' });
        }
        // Update the item
        const deletedItem = await deleteItem(itemId);

        return res.status(200).json(deletedItem);
    } catch (error) {
        console.error('Error deleting item:', error);
        return res.status(500).json({ message: 'Error deleting item' });
    }
};

export default withAuth(handler);
