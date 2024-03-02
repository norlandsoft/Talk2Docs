import {defineConfig} from "umi";

export default defineConfig({
  dva: {},
  title: 'Talk-2-Documents',
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
    "/sse": {
      target: "http://localhost:8080",
      changeOrigin: true,
      pathRewrite: {"^": ""},
      // 'onProxyReq': function(proxyReq, req, res) {
      //   proxyReq.setHeader('connection', 'keep-alive');
      // },
      'onProxyRes': function(proxyRes, req, res) {
        proxyRes.headers['Content-Encoding'] = 'chunked';
      },
    }
  },
  base: "/",
  outputPath: "dist",
});