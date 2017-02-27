const path = require('path')
module.exports = {
	// entry: [path.resolve(__dirname, '../src/Gesture.js')],
	entry: ['./src/Gestrue.js'],
	output: {
		path: path.resolve(__dirname, '../dist/'),
		publicPath: '/',
		filename: 'Gestrue.js',
		library: 'Gestrue',
		libraryTarget: 'umd'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader'
			}
		]
	},
	devtool: '#eval-source-map'
}