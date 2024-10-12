const { readFileSync } = require('fs');
const { resolve } = require('path');

const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

const packageJson = JSON.parse(
  readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8')
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io']
  },
  env: {
    NEXT_PUBLIC_APP_NAME: packageJson.name,
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
};

module.exports = withNextIntl(nextConfig);
