import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Calculadora de importação de carros dos EUA para o Brasil";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0f172a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "#2563eb",
          }}
        />

        {/* Car emoji */}
        <div style={{ fontSize: 110, marginBottom: 24 }}>🚗</div>

        {/* Main headline */}
        <div
          style={{
            fontSize: 54,
            fontWeight: 700,
            color: "#f8fafc",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: 16,
            padding: "0 80px",
          }}
        >
          Calcule o custo de importar um carro dos EUA 🇺🇸 → 🇧🇷
        </div>

        {/* Taxes subtitle */}
        <div
          style={{
            fontSize: 26,
            color: "#94a3b8",
            textAlign: "center",
            marginBottom: 48,
          }}
        >
          II · IPI · PIS · COFINS · ICMS · Frete · Desembaraço
        </div>

        {/* Domain badge */}
        <div
          style={{
            background: "#1e293b",
            border: "2px solid #334155",
            borderRadius: 12,
            padding: "12px 32px",
            fontSize: 26,
            fontWeight: 600,
            color: "#3b82f6",
          }}
        >
          carroimportado.com
        </div>
      </div>
    ),
    size
  );
}
