const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoBasePath = "/Resueltoservicios";

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? repoBasePath : ""
  },
  ...(isGithubPages
    ? {
        output: "export",
        basePath: repoBasePath,
        assetPrefix: `${repoBasePath}/`,
        trailingSlash: true,
        images: {
          unoptimized: true
        }
      }
    : {
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
                { key: "X-Frame-Options", value: "DENY" }
              ]
            }
          ];
        }
      })
};

export default nextConfig;
