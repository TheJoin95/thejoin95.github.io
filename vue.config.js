module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/styles/global.scss";',
      },
    },
  },

  configureWebpack: {
    module: {
      rules: [{
        test: /\.md$/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'markdown-loader',
          },
        ],
      }],
    },
  },

  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      renderRoutes: [
        '/',
        '/blog',
        '/about',
        '/not-found',
        '/blog/2021-02-22-netflix-conver-generator-nuxtjs-konvajs',
        '/blog/2020-02-23-sorting-hat-experiment-webar-in-js',
        '/blog/2020-02-21-argumented-reality-brief-explanation',
        '/blog/2019-12-21-microfrontend-from-00-to-20s',
        '/blog/2019-06-28-puppeteer-skyscanner-scraper-nodejs',
        '/blog/2019-05-18-prenotare-appuntamento-passaporto-online',
        '/blog/2019-03-28-manage-record-dns-updater-register-python',
        '/blog/2018-06-25-how-add-amp-pages-jekyll',
        '/blog/2017-12-09-ionic-build-ios-app-without-mac-virtual-machine',
        '/blog/2017-12-01-configure-dynhost-ovh-raspberry-for-dynamic-dns',
        '/blog/2017-06-01-raspberry-wont-boot-make-backup-with-chroot-shell',
        '/blog/2017-05-17-automatically-connect-wifi-raspberry-dhcp-and-staticip',
        '/blog/2017-02-16-how-to-backup-all-collections-from-mongodb-on-raspberry',
      ],
      useRenderEvent: true,
      headless: true,
      onlyProduction: true,
    },
  },
};
