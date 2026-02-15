export interface User {
    username: string;
    userid?: string;
    id?: string;
    [key: string]: any;
}

export interface AuthContextType {
    user: User | null;
    isSignedIn: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    refreshAuth: () => Promise<void>;
    loading: boolean;
}
