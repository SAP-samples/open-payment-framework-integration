"use client";
import { useContext } from "react";
import { CartContext } from "../../contexts/cart.context";
import Button from "../button";
import { getAuthToken, addCartItem } from "@/app/service/storefront.api";
import "./productCard.styles.scss";
import Image from "next/image";
import { toast } from 'react-toastify';

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

const ProductCard = ({
  product,
  cartId,
}: {
  product: Product;
  cartId: string;
}) => {
  const { name, price, images } = product;
  const { addItemToCart } = useContext(CartContext);

  const addProductToCart = async () => {
    try {
      const authTokenResp: any = await getAuthToken();
      await addCartItem(authTokenResp.access_token, cartId, product.code, 1);
      addItemToCart(product);
      toast.info("Item added to cart!", {
        position: "bottom-left",
      });
    } catch (e) {
      toast.error("Error adding item to cart. Check console for details!", {
        position: "bottom-left",
      });
    }
  };

  return (
    <div className="product-card-container">
      <Image
        src={
          images && images.length > 1
            ? "https://api.cp96avkh5f-integrati2-d2-public.model-t.cc.commerce.ondemand.com/" +
              images[1]?.url
            : "https://api.cp96avkh5f-integrati2-d2-public.model-t.cc.commerce.ondemand.com/" +
              images[0]?.url
        }
        alt={`${name}`}
        width={250}
        height={700}
      />
      <div className="footer">
        <div className="name">{name}</div>
        <br />
        <div className="price">{price.formattedValue}</div>
      </div>
      <Button buttonType="inverted" onClick={addProductToCart}>
        Add To Cart
      </Button>
    </div>
  );
};

export default ProductCard;
