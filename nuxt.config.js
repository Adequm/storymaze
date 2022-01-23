module.exports = {

  target: 'server',
  telemetry: false,

  head: {
    title: 'cooking-recipe-database',
    htmlAttrs: {
      lang: 'ru'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  css: [
    '@/assets/styles/cube.scss'
  ],

  plugins: [
    { src: '@/plugins/socket', ssr: false },
    { src: '@/plugins/local-storage', ssr: false },
    { src: '@/plugins/shared-mutations', ssr: false },
    // { src: '@/plugins/lodash-mixins', ssr: false },
  ],

  components: false,

  server: {
    port: process.env.PORT || 8234
  },

  bootstrapVue: {
    icons: true,
  },

  axios: {
    base_url: process.env.BASE_URL || 'http://localhost:3000/',
  },

  buildModules: [],

  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
  ],

  axios: {
    baseURL: '/',
  },

  build: {}
}
