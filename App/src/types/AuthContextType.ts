// types.AuthContextType.ts
import { Auth, AuthError, User } from 'firebase/auth';

export type AuthContextType = {
    auth: Auth,
    authValue: User | null | undefined,
    authLoading: boolean,
    authError: Error | undefined,
    signOut:  () => Promise<boolean>,
    signOutLoading: boolean,
    signOutError: AuthError | Error | undefined,
};