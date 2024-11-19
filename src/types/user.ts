import { Item } from './Item';
export interface User {
    username: string;
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
    profit: number;
    listOfItems: Partial<Item>[];
}
