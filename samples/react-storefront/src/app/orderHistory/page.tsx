"use client";
import React, { useEffect, useState } from "react";
import { fetchOrderHistory, getAuthToken } from "../service/storefront.api";

interface Order {
  code: string;
  statusDisplay: string;
  placed: string;
  total: {
    formattedValue: string;
  };
}

const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getOrderHistory = async () => {
      try {
        const authTokenResp: any = await getAuthToken();
        const orderHistory: any = await fetchOrderHistory(
          authTokenResp.access_token
        );
        setOrders(orderHistory.orders);
      } catch (err) {
        window.alert(
          "Failed to fetch order history. Check console for details!"
        );
        setError("Failed to fetch order history");
      } finally {
        setLoading(false);
      }
    };
    getOrderHistory();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: "120px", fontFamily: "Arial, sans-serif" }}>
      <h1
        style={{
          textAlign: "center",
          color: "#333",
          fontSize: "2em",
          fontWeight: "bold",
        }}
      >
        Order History
      </h1>
      {orders.length === 0 ? (
        <div style={{ textAlign: "center", color: "#999", padding: "50px" }}>
          No orders found
        </div>
      ) : (
        <div>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {orders.map((order) => (
              <li
                key={order.code}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  margin: "10px 0",
                  padding: "10px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h2 style={{ margin: "0 0 10px 0", color: "#555" }}>
                  Order ID: {order.code}
                </h2>
                <p style={{ margin: "5px 0", color: "#777" }}>
                  Date:{" "}
                  {new Date(order.placed).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p style={{ margin: "5px 0", color: "#777" }}>
                  Status: {order.statusDisplay}
                </p>
                <p style={{ margin: "5px 0", color: "#777" }}>
                  Total Price: {order.total.formattedValue}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
