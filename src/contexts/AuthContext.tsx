import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { auth, firebaseConfigStatus } from "@/services/firebase";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isSigningOut: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOutAdmin: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return undefined;
    }

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isSigningOut,
      async signIn(email, password) {
        if (!auth || !firebaseConfigStatus.configured) {
          throw new Error("firebase-not-configured");
        }
        await signInWithEmailAndPassword(auth, email.trim(), password);
      },
      async signOutAdmin() {
        if (!auth) {
          throw new Error("firebase-not-configured");
        }

        setIsSigningOut(true);
        try {
          await signOut(auth);
          // Keep the context in sync immediately after Firebase confirms sign-out.
          // onAuthStateChanged will also emit null, but this prevents a stale UI frame.
          setUser(null);
        } finally {
          setIsSigningOut(false);
        }
      },
    }),
    [isLoading, isSigningOut, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
