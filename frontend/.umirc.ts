import {defineConfig} from "umi";

export default defineConfig({
  dva: {},
  title: 'AI-Platform',
  links: [
    {id: 'theme', rel: 'stylesheet', type: 'text/css'},
    {rel: 'shortcut icon', href: '/favicon.svg'}
  ],
  routes: [
    {
      path: "/",
      component: "@/layouts/BasicLayout",
      routes: [
        {path: "/", component: "@/pages/Chat"},
      ]
    },
  ],
  proxy: {
    "/rest": {
      target: "http://localhost:8080",
      changeOrigin: true,
      pathRewrite: {"^": ""}
    },
  },
  base: "/",
  outputPath: "dist",
});