import React, { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  CommonConfig,
  CommonCallback,
  OpfSdkApi,
  SubmitRequest,
} from "opf-sdk/dist/opf-sdk";
import { Env } from "@/app/constant";
import { CartContext } from "@/app/contexts/cart.context";
import { getAuthToken, fetchAccessCode, initializePayments, setDeliveryMode, placeOrder } from "@/app/service/storefront.api";

interface PaymentOptionProps {
  name: string;
  selected: boolean;
  payOption: any;
  selClick: () => void;
  cartId: string;
}

const PaymentOption: React.FC<PaymentOptionProps> = ({
  name,
  selected,
  payOption,
  selClick,
  cartId,
}) => {
  const [payData, setPayData] = React.useState<any>();
  const router = useRouter();
  const { clearCompleteCart, setCartId } = useContext(CartContext);

  useEffect(() => {
    if (payData) {
      if (payData.pattern === "HOSTED_FIELDS") {
        console.log("HOSTED_FIELDS");
        executeScriptFromHtml(
          payData.dynamicScript?.html,
          payData.dynamicScript?.jsUrls,
          payData.dynamicScript?.cssUrls
        );
      } else if (payData.pattern === "IFRAME") {
        console.log("IFRAME");
      } else if (payData.pattern === "FULL_PAGE") {
        console.log("FULL_PAGE");
      }
    }
  }, [payData]);

  const onClick = () => {
    selClick();
    initPayments(payOption?.id, cartId);
  };

  const executeScriptFromHtml = (
    html: string | undefined,
    jsUrls: [] | undefined,
    cssUrls: [] | undefined
  ) => {
    if (jsUrls) {
      const jsScript: HTMLScriptElement = document.createElement("script");
      jsScript.src = jsUrls[0].url;
      jsScript.async = true;
      jsScript.defer = true;
      jsScript.onload = () => {
        if (html) {
          const element = new DOMParser().parseFromString(html, "text/html");
          const script = element.getElementsByTagName("script");
          if (!script?.[0]?.innerText) {
            return;
          }
          Function(script[0].innerText)();
        }
      };
      document.head.appendChild(jsScript);
    }
  };

  const initPayments = async (payId: number, cartId: string) => {
    try {
      const authTokenResp: any = await getAuthToken();
      const accessCodeResp: any = await fetchAccessCode(authTokenResp.access_token, cartId);
      await setDeliveryMode(authTokenResp.access_token, cartId);
      await initializePayments(accessCodeResp.accessCode, payId).then((data) => {
        if (data.pattern === "HOSTED_FIELDS") {
          initOpfSdk(data.paymentSessionId, accessCodeResp.accessCode);
        }
        setPayData(data);
      });
    } catch (e) {
      window.alert("Error initializing selected payment config. Check console for details!");
      console.log(e);
    }
  };

  const initOpfSdk = (paymentSessionId: string, accessCode: string) => {
    /************************************************************************
     * OPF SDK Integration - Start
     ************************************************************************/
    // Configuration
    const cconfig = new CommonConfig();
    cconfig.baseSiteId = Env.CCV2_BASE_SITE_ID;
    cconfig.ccv2BaseUrl = Env.CCV2_BASE_URL;
    cconfig.opfBaseUrl = Env.OPF_BASE_URL_STOREFRONT;
    cconfig.commerceCloudPublicKey = Env.CCV2_PUBLIC_KEY;
    cconfig.defaultAuthorizationErrorRetriesCount = 2;

    // Callbacks
    const commonCallback = new CommonCallback();
    let isUiIndicatorActive = false;
    let orderNumber = "";
    commonCallback.accessCodeCallback = async (submit: SubmitRequest) => {
      const authTokenResp: any = await getAuthToken();
      return await fetchAccessCode(authTokenResp.access_token, cartId);
    };
    commonCallback.userIdCallback = () => {
      return "current";
    };
    commonCallback.cartIdCallback = () => {
      return cartId;
    };
    commonCallback.isUiIndicatorActive = () => {
      return isUiIndicatorActive;
    };
    commonCallback.startUiIndicator = () => {
      isUiIndicatorActive = true;
      const loadingOverlay = document.createElement("div");
      loadingOverlay.style.position = "fixed";
      loadingOverlay.style.top = "0";
      loadingOverlay.style.left = "0";
      loadingOverlay.style.width = "100%";
      loadingOverlay.style.height = "100%";
      loadingOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      loadingOverlay.style.zIndex = "9999";
      loadingOverlay.style.display = "flex";
      loadingOverlay.style.justifyContent = "center";
      loadingOverlay.style.alignItems = "center";
      loadingOverlay.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="spinner" style="border: 4px solid rgba(255, 255, 255, 0.3); border-top: 4px solid white; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;"></div>
            <div style="color: white; font-size: 24px; margin-top: 10px;">Processing...</div>
          </div>
        `;
      const style = document.createElement("style");
      style.innerHTML = `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `;
      document.head.appendChild(style);
      document.body.appendChild(loadingOverlay);
    };
    commonCallback.stopUiIndicator = () => {
      isUiIndicatorActive = false;
      const loadingOverlay = document.querySelector(
        "div[style*='z-index: 9999']"
      );
      if (loadingOverlay) {
        document.body.removeChild(loadingOverlay);
      }
      router.push("/orderConfirmation" + "?orderNumber=" + orderNumber);
    };
    commonCallback.orderPlacementCallback = async (status: any) => {
      const authTokenResp: any = await getAuthToken();
      const orderDetails = await placeOrder(authTokenResp.access_token, cartId);
      clearCompleteCart();
      setCartId("");
      orderNumber = orderDetails.code;
      return orderDetails;
    };
    commonCallback.successRedirectionCallback = () => {
      console.log("successRedirectionCallback");
    };
    commonCallback.failureRedirectionCallback = () => {
      clearCompleteCart();
      router.push("/orderFailure");
      console.log("failureRedirectionCallback");
    };
    commonCallback.throwPaymentError = () => {
      console.log("throwPaymentError");
    };

    // Initialize the OPF SDK
    const opfSdkApi = new OpfSdkApi();
    opfSdkApi.initialize(cconfig, commonCallback);
    opfSdkApi.registerGlobalFunctions(paymentSessionId);
    opfSdkApi.registerGlobalFunctionsRedirectParams([
      { key: "lang", value: "en" },
      { key: "curr", value: "USD" },
    ]);
  };

  return (
    <div
      className={`payment-option ${selected ? "selected" : ""}`}
      style={{
        marginBottom: "16px",
        border: "1px solid #ccc",
        padding: "16px",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: selected ? "#d3d3d3" : "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <input
          type="radio"
          checked={selected}
          onChange={onClick}
          style={{ marginRight: "10px" }}
        />
        {name}
      </div>
      {selected && (
        <div
          style={{
            marginTop: "16px",
            padding: "16px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            width: "100%",
          }}
        >
          {payData?.pattern === "FULL_PAGE" ? (
            <div>
              <div style={{ display: "flex", justifyContent: "left" }}>
                <button
                  className="cx-payment-link btn btn-primary"
                  onClick={() =>
                    (window.location.href = payData.destination.url)
                  }
                >
                  Place Order
                </button>
              </div>
            </div>
          ) : payData?.pattern === "HOSTED_FIELDS" ? (
            <div
              dangerouslySetInnerHTML={{ __html: payData.dynamicScript?.html }}
            ></div>
          ) : payData?.pattern === "IFRAME" && payData.destination?.url ? (
            !payData.destination?.form?.length ? (
              <iframe
                src={payData.destination.url}
                style={{ width: "100%", height: "400px", border: "none" }}
              ></iframe>
            ) : (
              <form
                action={payData.destination?.url}
                method={payData.destination?.method}
                encType={payData.destination?.contentType}
              >
                <fieldset>
                  {payData.destination?.form.map(
                    (
                      field: {
                        name: string | undefined;
                        value: string | number | readonly string[] | undefined;
                      },
                      index: React.Key | null | undefined
                    ) => (
                      <input
                        key={index}
                        type="hidden"
                        name={field?.name}
                        value={field?.value}
                      />
                    )
                  )}
                </fieldset>
                <input type="submit"
                    className="cx-payment-link btn btn-primary"
                    value="Place Order"
                  >
                  </input>
              </form>
            )
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentOption;
