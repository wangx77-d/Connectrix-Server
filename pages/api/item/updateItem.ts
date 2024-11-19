import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/withAuth';
import { updateItem } from '@/lib/itemService';

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> => {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    try {
        const { itemId, ...updateData } = req.body;

        console.log(updateData);

        if (!itemId) {
            return res.status(400).json({ message: 'Item ID is required' });
        }
        // Update the item
        const updatedItem = await updateItem(itemId, updateData);

        return res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error updating item:', error);
        return res.status(500).json({ message: 'Error updating item' });
    }
};

export default withAuth(handler);
