import type { NextConfig } from "next";

// Условный static export — включается env-переменной NEXT_STATIC_EXPORT=true
// (используется GitHub Actions при деплое на Pages).
// Без неё проект работает в обычном режиме `next start` (на сервере, port 3000).
const isStatic = process.env.NEXT_STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(isStatic && {
    output: "export",
    basePath: "/revivebase",
    assetPrefix: "/revivebase/",
    images: { unoptimized: true },
    trailingSlash: true,
  }),
};

export default nextConfig;
