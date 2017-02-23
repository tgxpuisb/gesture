const webpack = require('webpack')
const merge = require('webpack-merge')
const config = require('./build/webpack.prod.conf.js')

// debug
webpack(config, function(err, stats){
	if(err){
		throw err
	}else{
		console.log(stats.toString({colors: true, chunks: false, children: false}))
	}
})

// relase
const relaseConfig = merge(config, {
	output: {
		filename: 'Gestrue.min.js'
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			beautify: false,
			comments: false,
			compress: {
	            warnings: true,
	            drop_console: false, // 不删除console
	        }
		})
	]
})
webpack(relaseConfig, function(err, stats){
	if(err){
		throw err
	}else{
		console.log(stats.toString({colors: true, chunks: false, children: false}))
	}
})
