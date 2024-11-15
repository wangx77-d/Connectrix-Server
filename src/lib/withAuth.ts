import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { authMiddleware } from '@/utils/jwt';

const EXCLUDED_ROUTES = ['/api/auth/signup', '/api/auth/login'];

export function withAuth(handler: NextApiHandler) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        if (EXCLUDED_ROUTES.includes(req.url || '')) {
            // If the route is excluded, call the original handler directly
            return handler(req, res);
        }

        // Use a Promise to handle async middleware behavior
        await new Promise<void>((resolve, reject) => {
            authMiddleware(req, res, (result: any) => {
                if (result instanceof Error) return reject(result);
                resolve();
            });
        });

        // If authentication passes, call the original handler
        return handler(req, res);
    };
}
