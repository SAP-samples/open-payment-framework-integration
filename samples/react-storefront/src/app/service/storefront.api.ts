import { access } from "fs/promises";
import { Env } from "../constant";
import { ApiHttpUtil, CallType } from "@/app/utils/api-http-util";

async function get(endpoint: string) {
  const response = await fetch(`${Env.CCV2_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return handleResponse(response);
}

async function post(endpoint: string, data?: any) {
  const response = await fetch(`${Env.CCV2_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  return response.json();
}

async function fetchProducts() {
  return get(
    "/products/search?fields=products(code%2Cname%2Csummary%2Cconfigurable%2CconfiguratorType%2Cmultidimensional%2Cprice(FULL)%2Cimages(DEFAULT)%2Cstock(FULL)%2CaverageRating%2CvariantOptions%2CbaseProduct%2CpriceRange(maxPrice(formattedValue)%2CminPrice(formattedValue)))%2Cfacets%2Cbreadcrumbs%2Cpagination(DEFAULT)%2Csorts(DEFAULT)%2CfreeTextSearch%2CcurrentQuery%2CkeywordRedirectUrl&query=%3Arelevance%3AallCategories%3Abrand_88&pageSize=12&lang=en&curr=USD"
  );
}

export { fetchProducts, get, post };

export const getAuthToken = async () => {
  const url = Env.CCV2_AUTH_URL;
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const params: { [key: string]: string } = {
    client_id: Env.CCV2_CLIENT_ID,
    client_secret: Env.CCV2_CLIENT_SECRET,
    grant_type: "password",
    username: Env.CCV2_USER_ID,
    password: Env.CCV2_USER_PASSWORD,
  };
  const body = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&");
  return new ApiHttpUtil(CallType.COMMERCE_CLOUD, headers).post(url, body);
};

export const createCart = async (access_token: string) => {
  const url = `${Env.CCV2_BASE_URL}/users/current/carts`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${access_token}`,
  };
  return new ApiHttpUtil(CallType.COMMERCE_CLOUD, headers).post(url);
};

export const addCartItem = async (
  access_token: string,
  cartId: string,
  productCode: string,
  quantity: number
) => {
  const url = `${Env.CCV2_BASE_URL}/users/current/carts/${cartId}/entries?lang=en&curr=USD`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${access_token}`,
  };
  const payload = {
    product: {
      code: productCode,
    },
    quantity: quantity,
  };
  return new ApiHttpUtil(CallType.COMMERCE_CLOUD, headers).post(url, payload);
};

export const fetchCartItems = async (access_token: string, cartId: string) => {
  const url = `${Env.CCV2_BASE_URL}/users/current/carts/${cartId}?fields=DEFAULT,potentialProductPromotions,appliedProductPromotions,potentialOrderPromotions,appliedOrderPromotions,entries(totalPrice(formattedValue),product(images(FULL),stock(FULL)),basePrice(formattedValue,value),updateable),totalPrice(formattedValue),totalItems,totalPriceWithTax(formattedValue),totalDiscounts(value,formattedValue),subTotal(formattedValue),totalUnitCount,deliveryItemsQuantity,deliveryCost(formattedValue),totalTax(formattedValue,%20value),pickupItemsQuantity,net,appliedVouchers,productDiscounts(formattedValue),user,saveTime,name,description&lang=en&curr=USD`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${access_token}`,
  };
  return new ApiHttpUtil(CallType.COMMERCE_CLOUD, headers).get(url);
};

export const fetchCartFields = async (access_token: string, cartId: string) => {
  const url = `${Env.CCV2_BASE_URL}/users/current/carts/${cartId}?fields=deliveryAddress(FULL),deliveryMode(FULL),paymentInfo(FULL)&lang=en&curr=USD`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `bearer ${access_token}`,
  };
  return new ApiHttpUtil(CallType.COMMERCE_CLOUD, headers).get(url);
};

export const fetchAddresses = async (access_token: string) => {
  const url = `${Env.CCV2_BASE_URL}/users/current/addresses?lang=en&curr=USD`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `bearer ${access_token}`,
  };
  return new ApiHttpUtil(CallType.COMMERCE_CLOUD, headers).get(url);
};

export const updateDeliveryAddress = async (
  access_token: string,
  cartId: string,
  addressId: string
) => {
  const url = `${Env.CCV2_BASE_URL}/users/current/carts/${cartId}/addresses/delivery?addressId=${addressId}&lang=en&curr=USD`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `bearer ${access_token}`,
  };
  return new ApiHttpUtil(CallType.COMMERCE_CLOUD, headers).put(url, {});
};

export const updateBillingAddress = async (
  access_token: string,
  cartId: string,
  payload: any
) => {
  const url = `${Env.CCV2_BASE_URL}/users/current/carts/${cartId}/addresses/billing?lang=en&curr=USD`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `bearer ${access_token}`,
  };
  return new ApiHttpUtil(CallType.COMMERCE_CLOUD, headers).put(url, payload);
};

export const fetchDeliveryModes = async (
  access_token: string,
  cartId: string
) => {
  const url = `${Env.CCV2_BASE_URL}/users/current/carts/${cartId}/deliverymodes?lang=en&curr=USD`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `bearer ${access_token}`,
  };
  return new ApiHttpUtil(CallType.COMMERCE_CLOUD, headers).get(url);
};

export const fetchPaymentOptions = async () => {
  const url = `${Env.OPF_BASE_URL_STOREFRONT}/${Env.CCV2_BASE_SITE_ID}${Env.OPF_GET_ACTIVE_CONFIGS}`;
  const headers = {
    "Content-Type": "application/json",
    "sap-commerce-cloud-public-key": Env.CCV2_PUBLIC_KEY,
  };
  return new ApiHttpUtil(CallType.OPF, headers).get(url);
};

export const fetchAccessCode = async (access_token: string, cartId: string) => {
  const url = `${Env.CCV2_BASE_URL}/users/current/carts/${cartId}/accessCode?lang=en&curr=USD`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${access_token}`,
  };
  return new ApiHttpUtil(CallType.COMMERCE_CLOUD, headers).post(url);
};

export const setDeliveryMode = async (access_token: string, cartId: string) => {
  const url = `${Env.CCV2_BASE_URL}/users/current/carts/${cartId}/deliverymode?deliveryModeId=standard-gross&lang=en&curr=USD`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `bearer ${access_token}`,
  };
  return new ApiHttpUtil(CallType.COMMERCE_CLOUD, headers).put(url, {});
};

export const initializePayments = async (
  accessCode: string,
  paymentConfigId: number
) => {
  const url = `${Env.OPF_BASE_URL_STOREFRONT}/${Env.CCV2_BASE_SITE_ID}${Env.OPF_POST_INIT_PAYMENTS}`;
  const headers = {
    "Content-Type": "application/json",
    "sap-commerce-cloud-access-code": `${accessCode}`,
    "sap-commerce-cloud-public-key": Env.CCV2_PUBLIC_KEY,
    "accept-language": "en-US",
  };
  const body = {
    configurationId: paymentConfigId,
    channel: "BROWSER",
    resultURL: "https://localhost:4200/orderConfirmation",
    cancelURL: "https://localhost:4200/cart",
  };
  return new ApiHttpUtil(CallType.OPF, headers).post(url, body);
};

export const placeOrder = async (access_token: string, cartId: string) => {
  const url = `${Env.CCV2_BASE_URL}/users/current/orders/paymentAuthorizedOrderPlacement?fields=FULL&cartId=${cartId}&termsChecked=true&lang=en&curr=USD`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `bearer ${access_token}`,
  };
  return new ApiHttpUtil(CallType.COMMERCE_CLOUD, headers).post(url);
};

export const fetchOrderHistory = async (access_token: string) => {
  const url = `${Env.CCV2_BASE_URL}/users/current/orders?pageSize=10&lang=en&curr=USD`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${access_token}`,
  };
  return new ApiHttpUtil(CallType.COMMERCE_CLOUD, headers).get(url);
};

export const verifyPayment = async (cartId: string, paymentPayLoad: any) => {
  const url = `${Env.OPF_BASE_URL_STOREFRONT}/${Env.CCV2_BASE_SITE_ID}${Env.OPF_POST_INIT_PAYMENTS}/${cartId}${Env.OPF_POST_VERIFY_PAYMENTS}`;
  const headers = {
    "Content-Type": "application/json",
    "sap-commerce-cloud-public-key": Env.CCV2_PUBLIC_KEY,
  };
  return new ApiHttpUtil(CallType.OPF, headers).post(url, paymentPayLoad);
};
