// Mapea los códigos de error de Firebase a nuestras claves de traducción.
export const getErrorMessageKey = (errorCode: string): string => {
    switch (errorCode) {
        case 'auth/weak-password':
            return 'auth.errorWeakPassword';
        case 'auth/invalid-email':
            return 'auth.errorInvalidEmail';
        case 'auth/user-not-found':
        case 'auth/invalid-credential':
            return 'auth.errorInvalidCredential';
        case 'auth/email-already-in-use':
            return 'auth.errorEmailInUse';
        case 'auth/network-request-failed':
            return 'auth.errorNetwork';
        default:
            return 'auth.errorDefault';
    }
};