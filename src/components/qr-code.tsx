"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QRCodeComponentProps {
  value: string;
  size?: number;
  className?: string;
}

export default function QRCodeComponent({
  value,
  size = 200,
  className = "",
}: QRCodeComponentProps) {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const dataURL = await QRCode.toDataURL(value, {
          width: size,
          margin: 2,
          color: {
            dark: "#272756", // Custom text color
            light: "#FFFFFF", // White background
          },
        });
        setQrCodeDataURL(dataURL);
      } catch (error) {
        console.error("Error generating QR code:", error);
      } finally {
        setLoading(false);
      }
    };

    if (value) {
      generateQRCode();
    }
  }, [value, size]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="w-6 h-6 border-2 border-custom-button border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!qrCodeDataURL) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 rounded-lg text-gray-500 text-sm ${className}`}
        style={{ width: size, height: size }}
      >
        Failed to generate QR code
      </div>
    );
  }

  return (
    <img
      src={qrCodeDataURL}
      alt={`QR Code for ${value}`}
      className={`rounded-lg ${className}`}
      width={size}
      height={size}
    />
  );
}
