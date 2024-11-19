import axios from 'axios';
import { User } from '@/types/user';

export async function getUserByEmail(email: string): Promise<User | null> {
    const user = await axios.post(
        process.env.DB_RECORDS_API_URL + '/retrieveRecord',
        {
            tableName: 'Users-demo',
            key: {
                userId: email,
            },
        }
    );

    return user.data.data || null;
}

export async function createUser(user: {
    email: string;
    password: string;
    name: string;
    picture: string;
    firstName: string;
    lastName: string;
    status: string;
    role: string;
    authProvider: string;
    token: string;
    refreshToken: string;
    formData: string;
}): Promise<User> {
    const username = user.email.split('@')[0];

    const recordData = {
        userId: user.email,
        username: username,
        email: user.email,
        password: user.password,
        name: user.name,
        picture: user.picture,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        role: user.role,
        authProvider: user.authProvider,
        token: user.token,
        refreshToken: user.refreshToken,
        formData: user.formData,
        profit: 0,
        listOfItems: [],
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
    };

    const createRecordResponse = await axios.post(
        process.env.DB_RECORDS_API_URL ?? '',
        {
            tableName: 'Users-demo',
            data: recordData,
        }
    );

    return createRecordResponse.data.data || null;
}

export async function updateUser(
    email: string,
    updates: Partial<User>
): Promise<User | null> {
    const updateData = {
        ...updates,
        updatedAt: Date.now().toString(),
    };

    const updateResponse = await axios.put(
        process.env.DB_RECORDS_API_URL ?? '',
        {
            tableName: 'Users-demo',
            key: {
                userId: email,
            },
            data: updateData,
        }
    );

    return updateResponse.data.data || null;
}
