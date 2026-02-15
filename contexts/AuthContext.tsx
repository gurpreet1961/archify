import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { signIn as puterSignIn, signOut as puterSignOut, getUser } from '../lib/puter.action';
import type { AuthContextType, User } from '../app/types';

const DEFAULT_AUTH_STATE: AuthContextType = {
    user: null,
    isSignedIn: false,
    signIn: async () => { },
    signOut: async () => { },
    refreshAuth: async () => { },
    loading: true,
};

const AuthContext = createContext<AuthContextType>(DEFAULT_AUTH_STATE);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const initAuth = async () => {
        try {
            const currentUser = await getUser();
            setUser(currentUser);
        } catch (error) {
            console.error("Failed to fetch user on mount:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initAuth();
    }, []);

    const signIn = async () => {
        try {
            const signedInUser = await puterSignIn();
            if (signedInUser) {
                setUser(signedInUser);
            }
        } catch (error) {
            console.error("Sign in error:", error);
        }
    };

    const signOut = async () => {
        try {
            await puterSignOut();
            setUser(null);
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    const refreshAuth = async () => {
        await initAuth();
    };

    const value = {
        user,
        isSignedIn: !!user,
        signIn,
        signOut,
        refreshAuth,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
