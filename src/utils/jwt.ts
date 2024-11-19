import { NextApiRequest, NextApiResponse } from 'next';
import jwt, { JwtPayload } from 'jsonwebtoken';
import axios from 'axios';

const JWT_SECRET = process.env.JWT_SECRET || 'connectrix-secret'; // Ensure this is set in production
const JWT_EXPIRES_IN = '24h';
const GOOGLE_PUBLIC_KEYS_URL = 'https://www.googleapis.com/oauth2/v3/certs';

interface JWTPayload {
    userId: string;
    email: string;
    username: string;
}

// Generate a self-signed JWT
export const generateToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

// Validate token based on type (Google or self-generated)
export async function validateToken(token: string): Promise<JwtPayload | null> {
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded || typeof decoded === 'string') {
        console.error('Invalid token format');
        return null;
    }

    const payload = decoded.payload as JwtPayload;

    // Identify if the token is a Google ID token
    if (
        payload.iss === 'accounts.google.com' ||
        payload.iss === 'https://accounts.google.com'
    ) {
        return validateGoogleIdToken(token);
    } else {
        // Validate as a self-generated JWT
        return validateSelfGeneratedJwt(token);
    }
}

// Middleware for protected routes
export const authMiddleware = async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: (err?: any) => void
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res
                .status(401)
                .json({ message: 'Authorization header is missing' });
        }

        console.log('authHeader', authHeader);

        // const token = authHeader.split(' ')[1];
        const token = authHeader;
        console.log('token', token);

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = await validateToken(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Extend the NextApiRequest type to include user
        (req as NextApiRequest & { user: JwtPayload }).user = decoded;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

// Validate Google ID token
async function validateGoogleIdToken(
    idToken: string
): Promise<JwtPayload | null> {
    try {
        const { data: publicKeys } = await axios.get(GOOGLE_PUBLIC_KEYS_URL);
        const decodedHeader = jwt.decode(idToken, { complete: true });

        // decodedToken {
        //   header: {
        //     alg: 'RS256',
        //     kid: '1dc0f172e8d6ef382d6d3a231f6c197dd68ce5ef',
        //     typ: 'JWT'
        //   },
        //   payload: {
        //     iss: 'https://accounts.google.com',
        //     azp: '544069305312-8mkfju7ch19mm4t36qkpaurmnb6i3j4l.apps.googleusercontent.com',
        //     aud: '544069305312-8mkfju7ch19mm4t36qkpaurmnb6i3j4l.apps.googleusercontent.com',
        //     sub: '101397159814810674163',
        //     email: 'gw0602.teaching@gmail.com',
        //     email_verified: true,
        //     at_hash: 'nh4au_7E-cxd4SGrjaERpg',
        //     name: 'Gordon Wang',
        //     picture: 'https://lh3.googleusercontent.com/a/ACg8ocIe-_VB6xI11_xiG3I2ororZsOASmCB21GdRNWfwldm2GgAog=s96-c',
        //     given_name: 'Gordon',
        //     family_name: 'Wang',
        //     iat: 1731636064,
        //     exp: 1731639664
        //   },
        //   signature: 'Ca5VlYtHNeBlTfNojZk_71f6WfL5t4YENg_vHhUTP28SXdKiNEspHwZhzEvBiTCz_oTwElzUumRgraqREbzR5Fng7Qk0JQiMceZcSuqT29O6fl5KuK4Gc9CqiI2w_BShsbJFYFDAGwxKIY5J49htc5xIIUELxD3nEdKGPCFYJvMdHFYUyrscIXy6rnfacjJufuO-aXMYd794_7EWmQ9FNLLyUd5JgRLSiQWlBJ_JXg_ZoqugFy1MEHopYil62oCfwVoWV2ZrpFKtVCTEH0KR0PiWa6luWtXSoo8ytu_ib1KrNkDR2fiLzR5s33HhWUXpChJOuLhz0jU4J4GfLXAzAQ'
        // }

        if (!decodedHeader || typeof decodedHeader === 'string') {
            throw new Error('Invalid token structure');
        }
        const key = publicKeys.keys.find(
            (k: { kid: string }) => k.kid === decodedHeader.header.kid
        );
        if (!key) {
            throw new Error('Key not found for token');
        }

        const publicKey = `-----BEGIN CERTIFICATE-----\n${key.x5c[0]}\n-----END CERTIFICATE-----`;

        const payload = jwt.verify(idToken, publicKey, {
            algorithms: ['RS256'],
            audience: process.env.GOOGLE_CLIENT_ID, // Ensure this is set in your environment
        });

        return payload as JwtPayload;
    } catch (error) {
        console.error('Google ID token validation failed:', error);
        return null;
    }
}

// Validate self-generated JWT
function validateSelfGeneratedJwt(token: string): JwtPayload | null {
    try {
        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return payload;
    } catch (error) {
        console.error('Self-generated JWT validation failed:', error);
        return null;
    }
}
