"use client";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  OpfKeyValueMap,
  OpfPaymentVerificationResponse,
  OpfPaymentVerificationResult,
} from "../data-model";
import {
  getAuthToken,
  placeOrder,
  verifyPayment,
} from "../service/storefront.api";
import { useEffect } from "react";
import Spinner from "../components/spinner/spinner";

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const router = useRouter();
  useEffect(() => {
    const verifyandPlaceOrder = async () => {
      if (searchParams.size !== 0 && orderNumber == null) {
        const queryParamsArray = Array.from(searchParams.entries());
        const paramsMap = Array<OpfKeyValueMap>();
        queryParamsArray.map(([key, value]) => {
          if (key !== "opfPaymentSessionId") {
            paramsMap.push({ key: key, value: value });
          }
        });
        const paymentPayLoad = {
          responseMap: Array<OpfKeyValueMap>(),
        };
        paymentPayLoad.responseMap = paramsMap;
        const paymentSessionId = searchParams.get("paymentSessionId") || "";
        const cartId = searchParams.get("opfOrderPaymentId") || "";
        try {
          const verifyResponse: OpfPaymentVerificationResponse =
            await verifyPayment(paymentSessionId, paymentPayLoad);
          if (
            verifyResponse.result === OpfPaymentVerificationResult.AUTHORIZED ||
            verifyResponse.result === OpfPaymentVerificationResult.DELAYED
          ) {
            console.log("Payment is successful");
            const authTokenResp: any = await getAuthToken();
            await placeOrder(authTokenResp.access_token, cartId).then(
              (orderResponse) => {
                if (orderResponse) {
                  console.log("Order placement successful");
                  router.push(
                    "/orderConfirmation" + "?orderNumber=" + orderResponse.code
                  );
                } else {
                  console.log("Order placement failed");
                  router.push("/orderFailure");
                }
              }
            );
          } else if (
            verifyResponse.result === OpfPaymentVerificationResult.UNAUTHORIZED
          ) {
            console.log("Payment is unauthorized");
            router.push("/orderFailure");
          } else if (
            verifyResponse.result === OpfPaymentVerificationResult.CANCELLED
          ) {
            console.log("Payment is cancelled");
            router.push("/cart");
          }
        } catch (err) {
          console.error(err);
          window.alert(
            "Failed to either verify payment or place the order. Check console for details!"
          );
          router.push("/orderFailure");
        }
      }
    };
    verifyandPlaceOrder();
  }, [searchParams, router, orderNumber]);

  if (!orderNumber) {
    if (searchParams.size !== 0) {
      return (
        <div className="h-screen flex items-center justify-center">
          <Spinner />
        </div>
      );
    }
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "10vh",
          padding: "180px",
          fontFamily: "var(--font-geist-sans)",
        }}
      >
        <h1
          style={{ fontSize: "2em", fontWeight: "bold", marginBottom: "20px" }}
        >
          Page Not Found
        </h1>
        <p style={{ fontSize: "1.2em", color: "#555", marginBottom: "20px" }}>
          The order number is missing or invalid.
        </p>
        <Link
          className="rounded-full bg-[#00112c] text-white font-bold border border-solid border-black/[.250] transition-colors flex items-center justify-center hover:bg-[#2c3045] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-64"
          href="/"
          rel="noopener noreferrer"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "10vh",
        padding: "180px",
        fontFamily: "var(--font-geist-sans)",
      }}
    >
      <Image
        aria-hidden
        src="https://www.mystoredemo.io/5f41650dba4105822471.svg"
        alt="Thank you"
        width={100}
        height={100}
        style={{ padding: "10px 0" }}
      />
      <Image
        aria-hidden
        src="https://www.mystoredemo.io/9799164eb042283a3c9d.svg"
        alt="Thank you for your order"
        width={100}
        height={150}
        style={{ padding: "10px 0" }}
      />
      <div
        style={{
          padding: "40px 20px 20px",
          textAlign: "center",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          maxWidth: "600px",
          margin: "30px 0",
        }}
      >
        <p style={{ fontSize: "1.2em", color: "#333" }}>
          Your order has been successfully placed. Your order number is{" "}
          <span
            style={{ fontWeight: "bold", fontSize: "1.4em", color: "#00112c" }}
          >
            {orderNumber}
          </span>
          .
        </p>
      </div>
      <Link
        className="rounded-full bg-[#00112c] text-white font-bold border border-solid border-black/[.250] transition-colors flex items-center justify-center hover:bg-[#2c3045] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-64"
        href="/orderHistory"
        rel="noopener noreferrer"
      >
        Go To Order History
      </Link>
    </div>
  );
}
