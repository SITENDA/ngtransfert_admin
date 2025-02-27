import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  /* config options here */
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

