import React, { useContext, useState, useEffect } from "react";
import { auth, provider } from "./initFirebase";
import { User, UserCredential, signInWithPopup, signOut } from "firebase/auth";

interface AuthContextType {
  currentUser: User | undefined;
  loading: boolean;

  logout: () => Promise<void>;

  signupWithGoogle: () => Promise<UserCredential>;
  loginWithGoogle: () => Promise<UserCredential>;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function useAuth() {
  return useContext(AuthContext) as AuthContextType;
}

export function AuthProvider(props: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] =
    useState<AuthContextType["currentUser"]>();
  const [loading, setLoading] = useState(true);

  // sign up with google, add user to postgres
  function signupWithGoogle() {
    const ret = async () => {
      const userCredential = await signInWithPopup(auth, provider);

      return userCredential;
    };
    return ret();
  }

  // login with google
  function loginWithGoogle() {
    // simply sign up
    return signupWithGoogle();
  }

  function logout() {
    setCurrentUser(undefined);
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (!user) {
        setCurrentUser(undefined);
      } else {
        setCurrentUser(user);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    logout,
    signupWithGoogle,
    loginWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && props.children}
    </AuthContext.Provider>
  );
}
