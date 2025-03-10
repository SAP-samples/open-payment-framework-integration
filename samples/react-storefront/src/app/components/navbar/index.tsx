"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import { CartContext } from "../../contexts/cart.context";

const Navbar = () => {
  const { cartCount } = useContext(CartContext);
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "80px",
          zIndex: 1000,
          backgroundColor: "rgba(255, 255, 255, 1)",
        }}
      >
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <Link
              className="text-2xl font-bold"
              href="/"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Brush Script MT', cursive",
                fontSize: "50px",
                margin: "0 auto",
                color: "0F52BA",
                backgroundColor: "white",
              }}
            >
              OPF Sample Storefront{" "}
            </Link>
            <Link href="/cart" rel="noopener noreferrer">
              <>
                <div
                  className="flex items-center"
                  style={{
                    backgroundColor: "#f0f0f0",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  <Image
                    aria-hidden
                    src="/cart.svg"
                    alt="Cart icon"
                    width={20}
                    height={20}
                  />
                  <span
                    className="item-count"
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      marginLeft: "5px",
                    }}
                  >
                    {cartCount}
                  </span>
                </div>
              </>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
