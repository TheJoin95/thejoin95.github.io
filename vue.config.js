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
};
