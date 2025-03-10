import Link from "next/link";
import Image from "next/image";

export default function OrderConfirmation() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "10vh",
      padding: "80px",
      fontFamily: "var(--font-geist-sans)",
    }}>
      <Image
        aria-hidden
        src="/payment_failure_icon.png"
        alt="Error"
        width={100}
        height={100}
      />
      <div style={{
        padding: "20px",
      }}>
      Sorry, your payment failed!
      </div>
      <Link
          className="rounded-full bg-[#00112c] text-white font-bold border border-solid border-black/[.250] transition-colors flex items-center justify-center hover:bg-[#2c3045] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-64"
          href="/checkout"
          rel="noopener noreferrer"
        >
          Try again
        </Link>
    </div>
  );
}
