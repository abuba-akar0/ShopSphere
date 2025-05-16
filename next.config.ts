require('dotenv').config();

import type {NextConfig} from 'next';
import type {Configuration as WebpackConfig} from 'webpack';

const nextConfig = {
  webpack: (config: WebpackConfig) => {
    if (!config.module) {
      config.module = { rules: [] };
    }
    if (!config.module.rules) {
      config.module.rules = [];
    }

    config.module.rules.push({
      test: /\.html$/,
      use: 'html-loader',
    });

    // Add polyfills for Node.js core modules
    if (!config.resolve) {
      config.resolve = { fallback: {} };
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      tls: false,
      'timers/promises': false,
      dns: false,
      'fs/promises': false,
    };

    return config;
  },
};

module.exports = nextConfig;