import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Always resolve page metadata before streaming the body, so title, description,
  // canonical and Open Graph tags are in <head> for every client, not only known bots.
  htmlLimitedBots: /.*/,
};

export default nextConfig;
