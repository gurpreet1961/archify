import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { signIn as puterSignIn, signOut as puterSignOut, getUser } from '../lib/puter.action';

const DEFAULT_AUTH_STATE: AuthContext = {
    isSignedIn: false,
    isAuthReady: false,
    userName: null,
    userId: null,
    signIn: async () => false,
    signOut: async () => false,
    refreshAuth: async () => false,
};

const AuthCtx = createContext<AuthContext>(DEFAULT_AUTH_STATE);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    const refreshAuth = async (): Promise<boolean> => {
        try {
            const currentUser: any = await getUser();
            if (currentUser) {
                setIsSignedIn(true);
                setUserName(currentUser.username ?? null);
                setUserId(currentUser.uuid ?? currentUser.id ?? null);
                return true;
            }
            setIsSignedIn(false);
            setUserName(null);
            setUserId(null);
            return false;
        } catch (error) {
            console.error("Failed to refresh auth:", error);
            setIsSignedIn(false);
            setUserName(null);
            setUserId(null);
            return false;
        } finally {
            setIsAuthReady(true);
        }
    };

    useEffect(() => {
        refreshAuth();
    }, []);

    const signIn = async (): Promise<boolean> => {
        try {
            const signedInUser: any = await puterSignIn();
            if (signedInUser) {
                setIsSignedIn(true);
                setUserName(signedInUser.username ?? null);
                setUserId(signedInUser.uuid ?? signedInUser.id ?? null);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Sign in error:", error);
            return false;
        }
    };

    const signOut = async (): Promise<boolean> => {
        try {
            await puterSignOut();
            setIsSignedIn(false);
            setUserName(null);
            setUserId(null);
            return true;
        } catch (error) {
            console.error("Sign out error:", error);
            return false;
        }
    };

    const value: AuthContext = {
        isSignedIn,
        isAuthReady,
        userName,
        userId,
        signIn,
        signOut,
        refreshAuth,
    };

    return (
        <AuthCtx.Provider value={value}>
            {children}
        </AuthCtx.Provider>
    );
};

export const useAuth = () => useContext(AuthCtx);
