import React from "react";

/**
 * ARTCHY-branding voor het beheerpaneel, in plaats van het
 * Payload-logo. "Logo" staat groot op de loginpagina; "Icoon" is het
 * kleine merkteken linksboven in het paneel.
 */

export function Logo() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-taji.png"
        alt=""
        width={72}
        height={72}
        style={{ objectFit: "contain", borderRadius: "8px" }}
      />
      <span
        style={{
          fontSize: "28px",
          fontWeight: 700,
          letterSpacing: "0.25em",
        }}
      >
        ARTCHY
      </span>
      <span
        style={{
          fontSize: "11px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#c9a24b",
        }}
      >
        Beheerpaneel
      </span>
    </div>
  );
}

export function Icoon() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-taji.png"
      alt="ARTCHY"
      width={26}
      height={26}
      style={{ objectFit: "contain", borderRadius: "5px" }}
    />
  );
}
