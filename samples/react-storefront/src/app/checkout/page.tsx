"use client";

import { useEffect, useState } from "react";
import { useContext } from "react";
import { CartContext } from "../contexts/cart.context";
import PaymentOption from "../components/payment-option";
import {
  getAuthToken,
  fetchCartItems,
  fetchAddresses,
  updateDeliveryAddress,
  fetchDeliveryModes,
  fetchPaymentOptions,
  updateBillingAddress,
} from "../service/storefront.api";
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
  };
}

interface Address {
  cellphone: string;
  country: {
    isocode: string;
  };
  defaultAddress: boolean;
  firstName: string;
  id: string;
  lastName: string;
  line1: string;
  line2: string;
  phone: string;
  postalCode: string;
  titleCode: string;
  town: string;
}

interface DeliveryMode {
  code: string;
  deliveryCost: {
    value: number;
  };
}

export default function Checkout() {
  const [paymentOptions, setPaymentOptions] = useState<any>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [cartItems, setCartItems] = useState<Cart[]>([]);
  const [address, setAddress] = useState<Address[]>([]);
  const { cartId } = useContext(CartContext);

  const [deliveryModes, setDeliveryModes] = useState<DeliveryMode[]>([]);

  const calculateTotalPrice = (items: Cart[]) => {
    return items.reduce((total, item) => total + item.totalPrice.value, 0);
  };
  const standardeliveryCost: number =
    deliveryModes.find((item: any) => item.code === "standard-gross")
      ?.deliveryCost.value ?? 0;
  const totalPrice: number = calculateTotalPrice(cartItems);
  const totalPriceWithDeliveryCost: number = totalPrice + standardeliveryCost;

  useEffect(() => {
    async function initializeCartForPayment() {
      try {
        const authTokenResp: any = await getAuthToken();
        const cartData: any = await fetchCartItems(
          authTokenResp.access_token,
          cartId
        );
        const { addresses }: any = await fetchAddresses(
          authTokenResp.access_token
        );
        const payloadForBillingAddress = {
          ... addresses[0],
          country : {
            isocode : addresses[0]?.country?.isocode,
          },
          region: {
            ...addresses[0]?.region,
            countryIso: addresses[0]?.country?.isocode,
          },
          shippingAddress: true,
          visibleInAddressBook: true,
          formattedAddress: `${addresses[0]?.line1}, ${addresses[0]?.line2}, ${addresses[0]?.town}, ${addresses[0]?.country?.isocode}, ${addresses[0]?.postalCode}`,
        };
        await updateBillingAddress(authTokenResp.access_token, cartId, payloadForBillingAddress);
        await updateDeliveryAddress(
          authTokenResp.access_token,
          cartId,
          addresses[0].id
        );
        const { deliveryModes }: any = await fetchDeliveryModes(
          authTokenResp.access_token,
          cartId
        );
        await fetchPaymentOptions().then((data) => {
          setPaymentOptions(
            (
              data as { value: { displayName: string; id: string }[] }
            ).value.map((option) => ({
              name: option.displayName,
              id: option.id,
            }))
          );
        });
        setCartItems(cartData.entries);
        setAddress(addresses);
        setDeliveryModes(deliveryModes);
      } catch (e) {
        window.alert(
          "Error loading checkout details or payment configs. Check console for details!"
        );
        console.log(e);
      }
    }
    initializeCartForPayment();
  }, []);

  return (
    <div style={styles.pageContainer}>
      <strong style={{ fontSize: "30px", marginTop: "40px" }}></strong>
      <div>
        <div style={styles.container}>
          <div style={{ ...styles.leftHalf, flex: 2 }}>
            {/* billing address section */}
            <div
              style={{
                textAlign: "left",
                border: "1px solid #ccc",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "25px",
              }}
            >
              <strong style={{ fontSize: "22px" }}>Billing Address</strong>

              <div style={{ marginBottom: "16px" }}></div>
              <div style={{ margin: 8, marginLeft: "22px" }}>
                {address.map((item) => (
                  <div key={item.id} style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <h4>
                        {item.titleCode.charAt(0).toUpperCase() +
                          item.titleCode.slice(1)}
                        {". "}
                        {item.firstName} {item.lastName},
                        <br />
                        {item.line1}, {item.line2},
                        <br />
                        {item.town}, {item.country.isocode} - {item.postalCode}.
                        <br />
                        {item.phone}
                      </h4>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* payment option section */}
            <div
              style={{
                textAlign: "left",
                border: "1px solid #ccc",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "25px",
              }}
            >
              <strong style={{ fontSize: "22px" }}>Payment Options</strong>
              <div style={{ marginBottom: "16px" }}></div>

              <div>
                {paymentOptions.map((option: any) => (
                  <PaymentOption
                    key={option.id}
                    name={option.name}
                    selected={selectedPayment === option.name}
                    payOption={option}
                    selClick={() => setSelectedPayment(option.name)}
                    cartId={cartId}
                  />
                ))}{" "}
              </div>
            </div>
          </div>

          <div style={{ ...styles.rightHalf, flex: 1.2 }}>
            <div
              style={{
                textAlign: "left",
                marginLeft: "auto",
                width: "80%",
              }}
            >
              <strong style={{ fontSize: "22px" }}>Order Summary</strong>
              <div style={{ marginBottom: "16px" }}></div>
              <div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr
                      style={{
                        justifyContent: "space-between",
                        marginTop: "20px",
                      }}
                    >
                      <th>Product Name</th>
                      <th style={{ textAlign: "left" }}>Quantity</th>
                      <th style={{ textAlign: "right" }}>Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr
                        key={item.product.code}
                        style={{
                          fontSize: "16px",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: "20px",
                          height: "9rem",
                        }}
                      >
                        <td>
                          {item.product.images &&
                          item.product.images.length > 0 ? (
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
                          <div
                            style={{
                              color: "#0047AB",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                              maxWidth: "200px",
                            }}
                          >
                            <strong>{item.product.name}</strong>
                          </div>
                        </td>
                        <td style={{ textAlign: "center" }}>{item.quantity}</td>

                        <td style={{ textAlign: "right" }}>
                          {" "}
                          ${item.totalPrice.value.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <hr
                  style={{
                    marginTop: "16px",
                    borderTop: "1px solid #000",
                    marginBottom: "20px",
                  }}
                />
                <div>
                  <div
                    style={{
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "20px",
                      }}
                    >
                      <p>Subtotal after discounts :</p>
                      <span> ${totalPrice.toFixed(2)}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "20px",
                        marginBottom: "20px",
                      }}
                    >
                      <div>
                        <p>
                          Standard Delivery :
                          <br />
                          <span style={{ color: "green" }}>
                            (3-5 business days)
                          </span>
                        </p>
                      </div>
                      <span>${standardeliveryCost}</span>
                    </div>
                    <hr
                      style={{
                        marginTop: "16px",
                        borderTop: "1px solid #000",
                        marginBottom: "20px",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "20px",
                        marginBottom: "40px",
                      }}
                    >
                      <strong>Total :</strong>
                      <strong>
                        <span> ${totalPriceWithDeliveryCost.toFixed(2)}</span>
                      </strong>{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    paddingTop: "70px",
    justifyContent: "center",
    width: "100rem",
  } as React.CSSProperties,
  leftHalf: {
    flex: 1,
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
  } as React.CSSProperties,
  address: {
    backgroundColor: "#ffffff",
    padding: "10px",
    borderBottom: "1px solid #ccc",
    textAlign: "center",
  } as React.CSSProperties,
  rightHalf: {
    flex: 1,
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  } as React.CSSProperties,
};
