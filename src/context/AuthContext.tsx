import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SIGNUP_START' }
  | { type: 'SIGNUP_SUCCESS'; payload: User }
  | { type: 'SIGNUP_FAILURE' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'SIGNUP_START':
      return {
        ...state,
        isLoading: true,
      };
    
    case 'LOGIN_SUCCESS':
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    
    case 'LOGIN_FAILURE':
    case 'SIGNUP_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in real app, this would be an API call
      if (email && password.length >= 6) {
        const user: User = {
          id: Date.now().toString(),
          email,
          name: email === 'admin@electroshop.com' ? 'Admin User' : email.split('@')[0],
          avatar: email === 'admin@electroshop.com' 
            ? `https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100`
            : `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100`,
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SIGNUP_START' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration - in real app, this would be an API call
      if (name && email && password.length >= 6) {
        const user: User = {
          id: Date.now().toString(),
          email,
          name,
          avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100`,
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        dispatch({ type: 'SIGNUP_SUCCESS', payload: user });
        return true;
      } else {
        dispatch({ type: 'SIGNUP_FAILURE' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SIGNUP_FAILURE' });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};