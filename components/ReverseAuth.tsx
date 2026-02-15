
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

interface ReverseAuthProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export const ReverseAuth = ({ children, redirectTo = '/' }: ReverseAuthProps) => {
    const { isSignedIn, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && isSignedIn) {
            navigate(redirectTo);
        }
    }, [isSignedIn, loading, navigate, redirectTo]);

    if (loading) {
        return null; // or a loading spinner
    }

    if (isSignedIn) {
        return null; // Will redirect
    }

    return <>{children}</>;
};
