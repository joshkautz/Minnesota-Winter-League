// React
import { createContext, } from 'react';

// Firebase Hooks
import { useAuthState, useSignOut, } from 'react-firebase-hooks/auth';

// Winter League
import { auth, } from '../firebase/auth';
import { AuthContextType } from '@/types/AuthContextType';
import { Props } from '@/interfaces/Props';

const AuthContext = createContext<AuthContextType | null>(null);

const AuthContextProvider = ({ children } : Props) => {
  const [authValue, authLoading, authError] = useAuthState(auth);
  const [signOut, signOutLoading, signOutError] = useSignOut(auth);

  return (
    <AuthContext.Provider
      value={{
        auth: auth,
        authValue: authValue,
        authLoading: authLoading,
        authError: authError,
        signOut: signOut,
        signOutLoading: signOutLoading,
        signOutError: signOutError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export {
  AuthContext,
  AuthContextProvider,
};
