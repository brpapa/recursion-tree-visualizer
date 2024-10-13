module.exports = function () {
  /** @type {import('next').NextConfig} */
  const config = {
    compiler: {
      styledComponents: true
    },
    experimental: {
      typedRoutes: true,
      scrollRestoration: true,
    },
  }

  return config
}
