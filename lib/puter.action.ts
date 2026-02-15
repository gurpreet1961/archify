
// @ts-ignore
import puter from '@heyputer/puter.js';

export const signIn = async () => {
    try {
        const user = await puter.auth.signIn();
        return user;
    } catch (error) {
        console.error("Sign in failed:", error);
        return null;
    }
};

export const signOut = async () => {
    try {
        await puter.auth.signOut();
    } catch (error) {
        console.error("Sign out failed:", error);
    }
};

export const getUser = async () => {
    try {
        const user = await puter.auth.getUser();
        return user;
    } catch (error) {
        // If not signed in or error, return null
        return null;
    }
};

export const isSignedIn = async () => {
    return puter.auth.isSignedIn();
}
