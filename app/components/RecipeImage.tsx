"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const DEFAULT_RECIPE_IMAGE = "/images/salad.jpeg";

type RecipeImageProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
};

export default function RecipeImage({
  src,
  alt,
  fallbackSrc = DEFAULT_RECIPE_IMAGE,
  onError,
  ...props
}: RecipeImageProps) {
  const requestedSrc = src?.trim() || fallbackSrc;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageSrc = failedSrc === requestedSrc ? fallbackSrc : requestedSrc;

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={alt}
      unoptimized
      onError={(event) => {
        if (imageSrc !== fallbackSrc) {
          setFailedSrc(imageSrc);
        }
        onError?.(event);
      }}
    />
  );
}
