import Link from "next/link";
import React from "react";

/** Onder het loginformulier: doorverwijzing naar de aanmeldpagina. */
export function AanmeldLink() {
  return (
    <p
      style={{
        marginTop: "24px",
        textAlign: "center",
        fontSize: "13px",
        color: "var(--theme-elevation-500, #9a968e)",
      }}
    >
      Nog geen account?{" "}
      <Link
        href="/aanmelden"
        style={{
          color: "#c9a24b",
          textDecoration: "underline",
          textUnderlineOffset: "3px",
        }}
      >
        Meld je aan
      </Link>
    </p>
  );
}
