import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/withAuth'; // Adjust the import path based on where you placed withAuth

// Define interface for the extended request
interface ExtendedNextApiRequest extends NextApiRequest {
    user: {
        userId: string;
        email: string;
    };
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    // If middleware passes, req.user will contain the decoded token payload
    const { userId } = req.user;

    // Your protected route logic here
    res.status(200).json({
        message: 'Protected data',
        user: { userId },
    });
};

export default withAuth(handler as any);
