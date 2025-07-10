import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https', // The protocol (http, https)
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      }
    ],
  },
  /* config options here */
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

