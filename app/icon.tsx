import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Host-nation tricolor favicon (Canada · Mexico · USA). */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <div style={{ flex: 1, background: "#C8102E" }} />
        <div style={{ flex: 1, background: "#006847" }} />
        <div style={{ flex: 1, background: "#002868" }} />
      </div>
    ),
    { ...size },
  );
}
