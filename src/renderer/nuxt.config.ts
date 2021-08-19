import * as webpack from 'webpack'

// courtesy of https://github.com/282Haniwa/nuxt-electron-example

const isProduction = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'development'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-dev
  dev: isDev,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'test-adding-electron-to-create-nuxt-app',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-router
  router: {
    // NOTE:
    // Electronはmodeが'hash'じゃないと動かないらしい
    // (初期値 mode: 'history' だとダメ)
    // https://qiita.com/282Haniwa/items/a3b0a7d3c622ad82ac8d#electron%E3%81%A7nuxtjs%E3%82%92%E4%BD%BF%E3%81%86%E3%81%9F%E3%82%81%E3%81%AE%E8%A8%AD%E5%AE%9A%E3%82%92%E3%81%99%E3%82%8B
    mode: 'hash',
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config: webpack.Configuration) {
      // NOTE:
      // 本番のときは相対パスにする
      // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build#extend
      if (!isDev && config.output) config.output.publicPath = './_nuxt/'

      config.node = {
        __dirname: !isProduction,
        __filename: !isProduction,
      }
    },
    // NOTE:
    // 本番のときは相対パスにする
    // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build#publicpath
    publicPath: !isDev ? './_nuxt/' : '/_nuxt/',
  },

  // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-generate
  generate: {
    dir: '../../dist/nuxt-build',
  },

  // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-telemetry
  telemetry: false,
}
