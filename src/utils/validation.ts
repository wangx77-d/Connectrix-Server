export function validateEmail(email: string): boolean {
    const emailRegex =
        /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
    // Password must be at least 6 characters long, contain at least one number, one lowercase letter, one uppercase letter, and one special character
    const passwordRegex =
        /^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/;
    return passwordRegex.test(password);
}
