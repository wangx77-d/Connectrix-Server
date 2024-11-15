import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/withAuth';
import { updateUser } from '@/lib/userService'; // Adjust path to your database utility function
import { User } from '@/types/user'; // Import the User interface

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email: userEmail } = req.body;

    if (!userEmail) {
        return res.status(400).json({ message: 'User email is required' });
    }

    const updates: Partial<User> = req.body;

    try {
        // Perform the user update
        const updatedUser = await updateUser(userEmail, updates);

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User profile updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default withAuth(handler);
