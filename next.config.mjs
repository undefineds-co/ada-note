/** @type { import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  redirects: {
    source: '/',
    destination: '/journal',
  },
}

export default nextConfig
