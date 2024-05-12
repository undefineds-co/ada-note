/** @type { import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  redirects: () => [
    {
      source: '/',
      destination: '/journal',
      permanent: false,
    },
  ],
}

export default nextConfig
