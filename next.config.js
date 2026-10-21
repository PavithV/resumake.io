// @ts-check

/** @type {import('next').NextConfig} **/
const NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true
  },
  // Ship template files with the zip API route on serverless hosts (Vercel)
  experimental: {
    outputFileTracingIncludes: {
      '/api/generate-source': ['./public/templates/**']
    }
  }
}

module.exports = NextConfig
