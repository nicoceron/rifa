"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "hsl(0 0% 100%)",
          "--normal-text": "hsl(222.2 84% 4.9%)",
          "--normal-border": "hsl(214.3 31.8% 91.4%)",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          background: "hsl(0 0% 100%)",
          color: "hsl(222.2 84% 4.9%)",
          border: "1px solid hsl(214.3 31.8% 91.4%)",
          borderRadius: "8px",
          boxShadow:
            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          opacity: "1",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
