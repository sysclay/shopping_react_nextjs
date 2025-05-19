import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Evita errores de ESLint en producción
  },
};

export default nextConfig;
