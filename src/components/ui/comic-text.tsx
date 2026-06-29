// @/components/ui/comic-text.tsx
"use client";

import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";





type ComicTextProps = {
  children: string;
  className?: string;
  style?: CSSProperties;
  fontSize?: number;
};

export function ComicText({
  children,
  className,
  style,
  fontSize = 5,
}: ComicTextProps) {
  if (typeof children !== "string") {
    throw new Error("children must be a string");
  }

  const dotColor = "#EF4444";
  const backgroundColor = "#FACC15";

  return (
    <div
      className={cn("select-none text-center", className)}
      style={
        {
          fontSize: `${fontSize}rem`,
          fontFamily: "'Bangers', 'Comic Sans MS', 'Impact', sans-serif",
          fontWeight: "900",
          WebkitTextStroke: `${fontSize * 0.35}px #000000`, // Thick black outline
          transform: "skewX(-10deg)",
          textTransform: "uppercase",
          filter: `
            drop-shadow(5px 5px 0px #000000) 
            drop-shadow(3px 3px 0px ${dotColor})
          `,
          backgroundColor: backgroundColor,
          backgroundImage: `radial-gradient(circle at 1px 1px, ${dotColor} 1px, transparent 0)`,
          backgroundSize: "8px 8px",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          ...style,
        }
      }
    >
      {children}
    </div>
  );

}