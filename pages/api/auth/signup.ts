import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { createUser, getUserByEmail } from '@/lib/userService';
import { validateEmail, validatePassword } from '@/utils/validation';

interface SignupRequestBody {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export default async function signupHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email, password, firstName, lastName } =
        req.body as SignupRequestBody;

    // Validate request body
    if (!email || !password) {
        return res
            .status(400)
            .json({ message: 'Email and password are required' });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email' });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    try {
        // Check if the user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user in the database
        await createUser({
            email,
            password: hashedPassword,
            name: `${firstName} ${lastName}`,
            picture: '',
            firstName,
            lastName,
            status: 'active',
            role: 'USER',
            authProvider: 'APP',
            token: '',
            refreshToken: '',
            formData: '',
        });

        res.redirect(201, '/login/success');
    } catch (error) {
        console.error('Error during sign-up:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
