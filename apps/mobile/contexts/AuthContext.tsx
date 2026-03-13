import { AuthService } from "@/services/AuthService";
import { IUser } from "@/types/IUser";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

// ---- Types ----

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (
    email: string,
    password: string,
    name: string,
  ) => Promise<string | null>;
  logout: () => Promise<void>;
}

// ---- Context ----

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check if we already have a valid session.
  useEffect(() => {
    async function loadUser() {
      const { user } = await AuthService.getMe();
      setUser(user);
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const handleLogin = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      const { user, error } = await AuthService.login(email, password);
      if (error) return error;
      setUser(user);
      return null;
    },
    [],
  );

  const handleRegister = useCallback(
    async (
      email: string,
      password: string,
      name: string,
    ): Promise<string | null> => {
      const { user, error } = await AuthService.register(email, password, name);
      if (error) return error;
      // user will be set but session may be null if email confirmation
      // is required — in that case user stays null in context until they
      // confirm and log in.
      setUser(user);
      return null;
    },
    [],
  );

  const handleLogout = useCallback(async () => {
    await AuthService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
