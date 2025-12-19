"use client";
import { createContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { ReactNode } from 'react';

interface Product {
  baseProduct: string;
  name: string;
  price: {
    formattedValue: string;
  };
  code: string;
  images: {
    url: string;
  }[]
}

const addCartItem = (cartItems: any[], productToAdd: any) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === productToAdd.id
  );

  if (existingCartItem) {
    return cartItems.map((cartItem) =>
      cartItem.id === productToAdd.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
  }

  return [...cartItems, { ...productToAdd, quantity: 1 }];
};

const removeCartItem = (cartItems: any[], cartItemToRemove: any) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === cartItemToRemove.id
  );
  if (existingCartItem.quantity === 1) {
    return cartItems.filter((cartItem) => cartItem.id !== cartItemToRemove.id);
  }
  return cartItems.map((cartItem) =>
    cartItem.id === cartItemToRemove.id
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  );
};

const clearCartItem = (cartItems: any[], cartItemToClear: any) =>
  cartItems.filter((cartItem) => cartItem.id !== cartItemToClear.id);

export const CartContext = createContext<{
  cartItems: any[];
  addItemToCart: (product: Product) => void;
  removeItemFromCart: (product: Product) => void;
  clearItemFromCart: (product: Product) => void;
  clearCompleteCart: () => void;
  setCartCount: Dispatch<SetStateAction<number>>;
  cartCount: number;
  cartTotal: number;
  cartId: string;
  setCartId: Dispatch<SetStateAction<string>>;
}>({
  cartItems: [],
  addItemToCart: () => {},
  removeItemFromCart: () => {},
  clearItemFromCart: () => {},
  clearCompleteCart: () => {},
  setCartCount: () => {},
  cartCount: 0,
  cartTotal: 0,
  cartId: '',
  setCartId: () => {},
});

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartId, setCartId] = useState('');

  useEffect(() => {
    const newCartCount = cartItems.reduce(
      (total, cartItem) => total + cartItem.quantity,
      0
    );
    setCartCount(newCartCount);
  }, [cartItems]);

  useEffect(() => {
    const newCartTotal = cartItems.reduce(
      (total, cartItem) => total + cartItem.quantity * cartItem.price,
      0
    );
    setCartTotal(newCartTotal);
  }, [cartItems]);

  const addItemToCart = (Product: Product) => {
    setCartItems(addCartItem(cartItems, Product));
  };

  const removeItemFromCart = (Product: Product) => {
    setCartItems(removeCartItem(cartItems, Product));
  };

  const clearItemFromCart = (Product: Product) => {
    setCartItems(clearCartItem(cartItems, Product));
  };

  const clearCompleteCart = () => {
    setCartItems([]);
  }

  const value = {
    addItemToCart,
    removeItemFromCart,
    clearItemFromCart,
    clearCompleteCart,
    cartItems,
    cartCount,
    setCartCount,
    cartTotal,
    cartId,
    setCartId
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};