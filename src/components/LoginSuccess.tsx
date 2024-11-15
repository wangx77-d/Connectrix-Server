'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
// Define a proper type for userData
interface UserData {
  // Add the properties you expect from your userData
  email?: string;
  name?: string;
  // ... other properties
}

interface LoginSuccessProps {
  onLoginSuccess?: (userData: UserData) => void;
}

const LoginSuccess: React.FC<LoginSuccessProps> = ({
  onLoginSuccess,
}) => {
  const router = useRouter();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const userData = params.get('userData');

      if (token) {
        localStorage.setItem('authToken', token);

        if (userData) {
          const parsedUserData: UserData = JSON.parse(
            decodeURIComponent(userData)
          );
          onLoginSuccess?.(parsedUserData);
        }

        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Error processing login:', error);
      // Optionally navigate to an error page
      // navigate('/error');
    }
  }, [router, onLoginSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        {/* Success Message */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Login Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back! Redirecting you to dashboard...
          </p>
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginSuccess;
