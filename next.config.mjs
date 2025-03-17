const isStandalone = process.env.NEXT_OUTPUT_MODE === "standalone";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isStandalone ? "standalone" : undefined,
};

export default nextConfig;
