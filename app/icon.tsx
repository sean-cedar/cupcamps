import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 2,
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ width: 8, height: 8, background: "#b5985a" }} />
            <div style={{ width: 8, height: 8, background: "#b5985a" }} />
            <div style={{ width: 8, height: 8, background: "#b5985a" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ width: 8, height: 8, background: "#b5985a" }} />
            <div style={{ width: 8, height: 8, background: "#b5985a" }} />
            <div
              style={{
                width: 8,
                height: 8,
                background: "#b5985a",
                borderRadius: "0 0 8px 0",
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
