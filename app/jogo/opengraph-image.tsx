import { ImageResponse } from "next/og";

export const alt = "Adivinhe o Preço — jogo de carros dos EUA do carroimportado.com";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: "#f97316" }} />

        <div style={{ fontSize: 110, marginBottom: 20 }}>🗺️🚗</div>

        <div style={{ fontSize: 72, fontWeight: 800, color: "#f8fafc", marginBottom: 12 }}>Adivinhe o Preço</div>

        <div style={{ fontSize: 32, color: "#94a3b8", textAlign: "center", marginBottom: 44, padding: "0 100px" }}>
          Escolha um estado dos EUA, veja o carro e chute o preço. Um desafio novo por dia.
        </div>

        <div
          style={{
            background: "#1e293b",
            border: "2px solid #334155",
            borderRadius: 12,
            padding: "12px 32px",
            fontSize: 28,
            fontWeight: 600,
            color: "#3b82f6",
          }}
        >
          carroimportado.com/jogo
        </div>
      </div>
    ),
    size,
  );
}
