"use client";
import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { getAuthToken, fetchCartItems } from "../service/storefront.api";
import { CartContext } from "../contexts/cart.context";
import Image from "next/image";

interface Cart {
  quantity: number;
  totalPrice: {
    value: number;
  };
  product: {
    name: string;
    code: string;
    images?: {
      url: string;
    }[];
    categories?: {
      name: string;
    }[];
    manufacturer: string;
  };
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<Cart[]>([]);
  const { cartId } = useContext(CartContext);

  useEffect(() => {
    async function fnFetchCartItems() {
      try {
        const authTokenResp: any = await getAuthToken().then((res) => res);
        const response: any = await fetchCartItems(authTokenResp.access_token, cartId).then((res) => res);
        setCartItems(response.entries);
      } catch (e) {
        window.alert("Error fetching cart items. Check console for details!");
        console.log(e);
      }
    }
    fnFetchCartItems();
  }, []);

  if (cartId && cartItems.length > 0) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateRows: "20px 1fr 20px",
          alignItems: "center",
          justifyItems: "center",
          padding: "32px",
          paddingBottom: "80px",
          gap: "64px",
          fontFamily: "var(--font-geist-sans)",
        }}
      >
        {" "}
        <strong></strong>
        <table style={{ borderCollapse: "collapse", width: "100rem" }}>
          <thead>
            <tr
              style={{
                marginTop: "20px",
                height: "6rem",
              }}
            >
              <th style={{ textAlign: "left" }}>Product Image</th>
              <th
                style={{
                  textAlign: "left",
                  paddingLeft: "40px",
                  paddingRight: "0.1rem",
                }}
              >
                Product Name
              </th>

              <th>Product Code</th>
              <th>Category</th>
              <th>Manufacturer</th>
              <th>Quantity</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr
                key={item.product.code}
                style={{
                  fontSize: "16px",
                  borderBottom: "1px solid #e0e0e0",
                  height: "6rem",
                }}
              >
                <td style={{ textAlign: "left" }}>
                  {item.product.images && item.product.images.length > 0 ? (
                    <Image
                      src={
                        item.product.images.length > 1
                          ? "https://api.cp96avkh5f-integrati2-d2-public.model-t.cc.commerce.ondemand.com/" +
                            item.product.images[1]?.url
                          : "https://api.cp96avkh5f-integrati2-d2-public.model-t.cc.commerce.ondemand.com/" +
                            item.product.images[0]?.url
                      }
                      alt={item.product.name}
                      width={100}
                      height={100}
                    />
                  ) : (
                    <div />
                  )}
                </td>
                <td>
                  <div
                    style={{
                      color: "#0047AB",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      maxWidth: "200px",
                      textAlign: "center",
                    }}
                  >
                    <strong>{item.product.name}</strong>
                  </div>
                </td>
                <td style={{ textAlign: "center" }}>{item.product.code}</td>
                <td style={{ textAlign: "center" }}>
                  {item.product.categories?.[0]?.name}
                </td>
                <td style={{ textAlign: "center" }}>
                  {item.product.manufacturer}
                </td>
                <td style={{ textAlign: "center" }}>{item.quantity}</td>

                <td style={{ textAlign: "center" }}>
                  {" "}
                  ${item.totalPrice.value.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full bg-[#00112c] text-white font-bold border border-solid border-black/[.250] transition-colors flex items-center justify-center hover:bg-[#2c3045] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-64"
            href="/checkout"
            rel="noopener noreferrer"
          >
            Continue to Checkout
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-rows-[480px_1fr_40px] items-center justify-items-center p-8 pb-20 gap-1 sm:p-1 font-[family-name:var(--font-geist-sans)]">
      <strong>Cart is empty. Add items to cart to proceed.</strong>
      <div>
        <Link
          className="rounded-full bg-[#00112c] text-white font-bold border border-solid border-black/[.250] transition-colors flex items-center justify-center hover:bg-[#2c3045] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-64"
          href="/"
          rel="noopener noreferrer"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
