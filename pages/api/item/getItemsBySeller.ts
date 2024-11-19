import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/withAuth';
import { getItemsBySellerId } from '@/lib/itemService';

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

        if (!userId) {
            return res.status(400).json({ message: 'Please login' });
        }

        const items = await getItemsBySellerId(userId);

        return res.status(200).json({ items });
    } catch (error) {
        console.error(
            'Error fetching items:',
            error instanceof Error ? error.message : 'Unknown error'
        );
        return res.status(500).json({ message: 'Error fetching items' });
    }
};

export default withAuth(handler);
