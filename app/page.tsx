import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lvetica — Coming Soon",
  description: "We're working on something great. Check back soon.",
};

export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#fff",
      fontFamily: "sans-serif",
      textAlign: "center",
      padding: "24px",
    }}>
      <img
        src="/mad-designer.png"
        alt="Under maintenance"
        style={{ width: "100%", maxWidth: "480px", marginBottom: "32px" }}
      />
      <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#111", marginBottom: "12px" }}>
        We&apos;re working on it
      </h1>
      <p style={{ fontSize: "16px", color: "#666", maxWidth: "360px", lineHeight: 1.6 }}>
        Our site is currently under maintenance. We&apos;ll be back shortly.
      </p>
    </div>
  );
}
