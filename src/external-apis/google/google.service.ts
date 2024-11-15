import axios from 'axios';
import { GoogleTokenResponse, GoogleUserInfo } from './types';

export class GoogleApiService {
    private static instance: GoogleApiService;

    private constructor() {}

    public static getInstance(): GoogleApiService {
        if (!GoogleApiService.instance) {
            GoogleApiService.instance = new GoogleApiService();
        }
        return GoogleApiService.instance;
    }

    async handleGoogleAuth(code: string): Promise<{
        tokens: GoogleTokenResponse;
        userInfo: GoogleUserInfo;
    }> {
        const tokens = await this.exchangeCodeForTokens(code);
        const userInfo = await this.getUserInfo(tokens.access_token);
        return { tokens, userInfo };
    }

    private async exchangeCodeForTokens(
        code: string
    ): Promise<GoogleTokenResponse> {
        try {
            const response = await axios.post(
                'https://oauth2.googleapis.com/token',
                null,
                {
                    params: {
                        code,
                        client_id: process.env.GOOGLE_CLIENT_ID,
                        client_secret: process.env.GOOGLE_CLIENT_SECRET,
                        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                        grant_type: 'authorization_code',
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error('Token exchange error:', error);
            throw new Error('Failed to exchange code for tokens');
        }
    }

    private async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
        try {
            const response = await axios.get(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('User info fetch error:', error);
            throw new Error('Failed to fetch user information');
        }
    }
}
