import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { getUserByEmail, updateUser } from '@/lib/userService';
import { generateToken } from '@/utils/jwt';
import { validateEmail } from '@/utils/validation';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res
            .status(400)
            .json({ message: 'Email and password are required' });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email' });
    }

    try {
        // Retrieve the user from the database
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Compare provided password with hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token for the user
        const token = generateToken({
            userId: user.email,
            email: user.email,
            username: user.username,
        });

        await updateUser(user.email, { token });

        // const redirectUrl = `/login/success?token=${encodeURIComponent(
        //     token
        // )}&id=${encodeURIComponent(user.email)}`;
        // res.redirect(302, redirectUrl);

        // tmp
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
