import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import bcrypt from 'bcryptjs';
import { getUserByEmail, updateUser } from '@/lib/userService';
import { generateToken } from '@/utils/jwt';
import { validateEmail } from '@/utils/validation';

// Initialize CORS middleware
const cors = Cors({
    origin: 'http://localhost:5176', // Frontend origin
    methods: ['GET', 'POST', 'OPTIONS'], // Allowed methods
});

// Helper function to run middleware
function runMiddleware(
    req: NextApiRequest,
    res: NextApiResponse,
    fn: Function
) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }
            resolve(result);
        });
    });
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Run CORS middleware
    await runMiddleware(req, res, cors);

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(204).end(); // No Content for preflight
    }

    console.log('Request received:', req.method, req.body);

    try {
        if (req.method !== 'POST') {
            res.status(405).json({ message: 'Method Not Allowed' });
            return;
        }

        // Manually parse the body if it's undefined
        let body = req.body;
        if (!body) {
            try {
                body = JSON.parse(
                    await new Promise((resolve, reject) => {
                        let data = '';
                        req.on('data', (chunk) => (data += chunk));
                        req.on('end', () => resolve(data));
                        req.on('error', reject);
                    })
                );
            } catch (err) {
                console.error('Error parsing body:', err);
                res.status(400).json({
                    message: 'Invalid request body',
                });
                return;
            }
        }

        console.log('Parsed body:', body);

        console.log('body type:', typeof body);

        const { email, password } = body;

        // Basic validation
        if (!email || !password) {
            console.log(
                'Validation failed: Missing email or password'
            );
            res.status(400).json({
                message: 'Email and password are required',
            });
            return;
        }

        if (!validateEmail(email)) {
            console.log('Validation failed: Invalid email format');
            res.status(400).json({ message: 'Invalid email' });
            return;
        }

        console.log('Fetching user from database...');
        const user = await getUserByEmail(email);
        if (!user) {
            console.log('User not found:', email);
            res.status(401).json({ message: 'User not found' });
            return;
        }

        console.log('Validating password...');
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );
        if (!isPasswordValid) {
            console.log('Invalid password for user:', email);
            res.status(401).json({
                message: 'Invalid email or password',
            });
            return;
        }

        console.log('Generating JWT...');
        const token = generateToken({
            userId: user.email,
            email: user.email,
            username: user.username,
        });

        console.log('Updating user with token...');
        await updateUser(user.email, { token });

        console.log('Login successful. Sending response...');
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (!res.headersSent) {
            console.warn(
                'No response sent. Sending fallback response.'
            );
            res.status(500).json({
                message: 'Internal server error',
            });
        }
        console.log('Handler finished execution.');
    }
}
