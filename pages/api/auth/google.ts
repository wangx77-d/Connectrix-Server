import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleApiService } from '@/external-apis';
import {
    createUser,
    getUserByEmail,
    updateUser,
} from '@/lib/userService'; // Assuming these functions interact with the DB

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { code } = req.query;

        if (!code || typeof code !== 'string') {
            return res
                .status(400)
                .json({ error: 'Authorization code is required' });
        }

        // Get Google service instance
        const googleApiService = GoogleApiService.getInstance();

        // Get tokens and user info from Google
        const { tokens, userInfo } =
            await googleApiService.handleGoogleAuth(code);

        const { email, name, given_name, family_name, picture } =
            userInfo;
        const { id_token, refresh_token } = tokens;

        try {
            const existingUser = await getUserByEmail(email);
            if (existingUser) {
                await updateUser(existingUser.email, {
                    token: id_token,
                    refreshToken: refresh_token,
                });
            } else {
                await createUser({
                    email,
                    password: '',
                    name,
                    picture,
                    firstName: given_name,
                    lastName: family_name,
                    status: 'active',
                    role: 'USER',
                    authProvider: 'GOOGLE',
                    token: id_token,
                    refreshToken: refresh_token,
                    formData: JSON.stringify({ userInfo, tokens }),
                });
            }
        } catch (error) {
            console.error('Error user record:', error);
        }

        const redirectUrl = 'http://localhost:5176/profile';

        // return res.status(200).json({
        //     message: 'Authentication successful',
        //     token: id_token,
        //     refreshToken: refresh_token,
        //     user: {
        //         email,
        //         name,
        //         givenName: given_name,
        //         familyName: family_name,
        //         picture,
        //     },
        // });

        return res.redirect(302, redirectUrl);
    } catch (error) {
        console.error('Google callback error:', error);
        return res.status(500).json({
            error: 'Authentication failed',
            details:
                process.env.NODE_ENV === 'development'
                    ? error instanceof Error
                        ? error.message
                        : String(error)
                    : undefined,
        });
    }
}
