export default {
  // 核心：确保包含所有使用 Tailwind 类的文件路径
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // React/Vue 项目的源码目录
    "./index.html", // 静态 HTML 文件
    // 若有其他目录，补充进去，比如 "./pages/**/*.vue"（Nuxt/Next 项目）
  ],
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
  corePlugins: {
    preflight: true,
  },
}