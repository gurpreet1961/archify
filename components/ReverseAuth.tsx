
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

interface ReverseAuthProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export const ReverseAuth = ({ children, redirectTo = '/' }: ReverseAuthProps) => {
    const { isSignedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isSignedIn) {
            navigate(redirectTo);
        }
    }, [isSignedIn, navigate, redirectTo]);

    if (isSignedIn) {
        return null; // Will redirect
    }

    return <>{children}</>;
};
