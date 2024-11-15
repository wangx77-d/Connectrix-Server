import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/withAuth';
import { getUserByEmail } from '@/lib/userService';
import { User } from '@/types/user';

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> => {
    const { email: userEmail } = req.body;

    if (!userEmail) {
        res.status(400).json({ message: 'User email not found in token' });
        return;
    }

    try {
        // Fetch user details
        const user: User | null = await getUserByEmail(userEmail);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Respond with user data (excluding sensitive fields if necessary)
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default withAuth(handler);
