import React from "react";

/**
 * Standard image wrapper: lazy by default, async decode, and an aspect-ratio
 * placeholder so images never cause layout shift. Pass `priority` for
 * above-the-fold images that should load eagerly.
 */
export default function Pic({
  src,
  alt = "",
  width,
  height,
  aspectRatio,
  priority = false,
  className,
  style,
  ...rest
}) {
  const ratio =
    aspectRatio ?? (width && height ? `${width} / ${height}` : undefined);
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={className}
      style={ratio ? { aspectRatio: ratio, ...style } : style}
      {...rest}
    />
  );
}
