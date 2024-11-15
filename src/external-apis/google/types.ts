export interface GoogleTokenResponse {
    access_token: string;
    id_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
    refresh_token: string;
}

export interface GoogleUserInfo {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
}
