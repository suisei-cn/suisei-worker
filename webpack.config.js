const path = require('path')

module.exports = {
  target: 'webworker',
  resolve: {
    alias: {
      fs: path.resolve(__dirname, 'src/fakefs.js'),
    },
  },
  mode: 'production',
  optimization: {
    usedExports: true,
  },
}
