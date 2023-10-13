/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  basePath: process.env.NODE_ENV === "production" ? "/nft-pawn-shop" : undefined,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
