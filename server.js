const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./build/webpack.dev.conf.js')

config.entry.unshift("webpack-dev-server/client?http://localhost:8080/")
const compiler = webpack(config)
const server = new WebpackDevServer(compiler, {})
server.listen(8080)
