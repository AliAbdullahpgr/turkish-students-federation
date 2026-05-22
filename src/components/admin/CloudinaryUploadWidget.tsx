"use client";

import { cloneElement, isValidElement, useCallback, useEffect, useRef } from "react";

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        config: object,
        callback: (error: unknown, result: unknown) => void
      ) => {
        open: () => void;
        destroy: () => void;
      };
    };
  }
}

interface CloudinaryResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

interface CloudinaryUploadWidgetProps {
  onUpload: (result: CloudinaryResult) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export default function CloudinaryUploadWidget({
  onUpload,
  children,
  disabled = false,
}: CloudinaryUploadWidgetProps) {
  const widgetRef = useRef<{ open: () => void; destroy: () => void } | null>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    script.onload = () => {
      scriptLoaded.current = true;
    };
    document.body.appendChild(script);

    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
      }
    };
  }, []);

  const openWidget = useCallback(() => {
    if (disabled) return;
    if (!window.cloudinary) return;

    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
        uploadPreset: "ptob_uploads",
        folder: "ptob",
        multiple: false,
        maxFiles: 1,
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
        maxFileSize: 5_000_000,
        sources: ["local", "url", "camera"],
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#0B3D2E",
            tabIcon: "#0B3D2E",
            menuIcons: "#0B3D2E",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#3CB371",
            action: "#E30A17",
            inactiveTabIcon: "#999999",
            error: "#E30A17",
            inProgress: "#3CB371",
            complete: "#3CB371",
            sourceBg: "#F5F5F5",
          },
          fonts: {
            "'Inter', sans-serif": "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap",
          },
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error: unknown, result: any) => {
        if (!error && result?.event === "success") {
          onUpload({
            public_id: result.info.public_id,
            secure_url: result.info.secure_url,
            url: result.info.url,
            width: result.info.width,
            height: result.info.height,
            format: result.info.format,
            resource_type: result.info.resource_type,
          });
        }
      }
    );

    widgetRef.current.open();
  }, [disabled, onUpload]);

  if (isValidElement<{ onClick?: () => void; disabled?: boolean }>(children) && children.type === "button") {
    return cloneElement(children, {
      onClick: openWidget,
      disabled,
    });
  }

  return <button type="button" onClick={openWidget} disabled={disabled} className="cursor-pointer">{children}</button>;
}
