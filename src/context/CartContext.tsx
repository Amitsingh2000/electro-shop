import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, Product } from '../types/product';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        };
      }
      
      const newItems = [...state.items, { ...action.payload, quantity: 1 }];
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }
    
    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }
    
    case 'CLEAR_CART':
      return initialState;
    
    default:
      return state;
  }
};

interface CartContextType extends CartState {
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (id: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};