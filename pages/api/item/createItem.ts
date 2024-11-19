import { NextApiRequest, NextApiResponse } from 'next';
import { createItem } from '@/lib/itemService';
import { withAuth } from '@/lib/withAuth';

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    try {
        const userId = (req as any).user?.userId;
        const {
            title,
            description,
            price,
            category,
            relatedGame,
            status,
            imgUrl,
            rating,
            formData,
        } = req.body;

        // Validate required fields
        if (!title || !description || !price || !category) {
            return res.status(400).json({
                message: 'Missing required fields',
            });
        }

        // Validate price is a positive number
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({
                message: 'Price must be a positive number',
            });
        }

        const item = await createItem({
            sellerId: userId,
            title,
            description,
            price,
            category,
            relatedGame,
            status,
            imgUrl,
            rating,
            formData,
        });

        return res.status(200).json({
            message: 'Item created successfully',
            data: item,
        });
    } catch (error) {
        console.error('Error creating item:', error);
        return res.status(500).json({
            message: 'Error creating item',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export default withAuth(handler);
