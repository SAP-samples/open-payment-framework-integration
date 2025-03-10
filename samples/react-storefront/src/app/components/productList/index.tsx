"use client";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../../contexts/cart.context";
import ProductCard from "../productCard";
import { getAuthToken, createCart, fetchProducts } from "@/app/service/storefront.api";
import "./productList.styles.scss";
import React from "react";

interface Product {
  baseProduct: string;
  name: string;
  price: {
    formattedValue: string;
  };
  code: string;
  images: {
    url: string;
  }[];
}

const ProductList = () => {
  const [products, setProducts] = useState([] as Product[]);
  const { cartId, setCartId } = useContext(CartContext);

  useEffect(() => {
    const initializeCartAndProducts = async () => {
      try {
        if (!cartId) {
          const authTokenResp: any = await getAuthToken();
          const cartResp: any = await createCart(authTokenResp.access_token);
          setCartId(cartResp.code);
        }
        const productsList = await fetchProducts();
        setProducts(productsList.products);
      } catch (e) {
        window.alert("Error fetching products. Check console for details!");
        console.error(e);
      }
    };
    initializeCartAndProducts();
  }, []);

  return (
    <div className="products-container">
      {products.map((product) => (
        <ProductCard
          key={product.code}
          product={product}
          cartId={cartId}
        />
      ))}
    </div>
  );
};

export default ProductList;

const styles = {
  pageContainer: {
    display: "grid",
    gridTemplateRows: "20px 1fr 20px",
    alignItems: "center",
    justifyItems: "center",
    minHeight: "100vh",
    padding: "70px",
    paddingBottom: "20px",
    gap: "16px",
    fontFamily: "var(--font-geist-sans)",
    sm: {
      padding: "20px",
    },
  },
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    paddingTop: "70px",
  } as React.CSSProperties,
};
