import HtmlWebpackPlugin = require('html-webpack-plugin');
import path = require('path');
import TerserWebpackPlugin = require('terser-webpack-plugin');
import webpack = require('webpack');
import cfg = require('./config.json');

const cssLoader: string[] = ['style-loader', 'css-loader', 'sass-loader'];
const isProduction: boolean = (process.env.NODE_ENV === 'production');
const root: string = path.resolve(path.join(__dirname, '../../'));

const config: webpack.Configuration = {
	context: root,
	devtool: (isProduction ? undefined : 'cheap-module-source-map'),
	entry: [
		path.join(root, '/frontend/index.tsx'),
	],
	mode: isProduction ? 'production' : 'development',
	module: {
		rules: [
			{
				test: /\.(scss|css)$/,
				use: cssLoader,
			},
			{
				exclude: /(node_modules)/,
				test: /.js$/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				exclude: /(node_modules)/,
				test: /.tsx$/,
				use: {
					loader: 'ts-loader',
				},
			},
			{
				test: /\.(gif|ttf|eot|svg|png|jpg|jpeg|woff2?)$/,
				use: 'url-loader?name=[name].[ext]',
			},
		],
	},
	output: {
		filename: 'bundle.js',
		path: path.join(root, isProduction ? '/backend/build' : '/backend/public'),
		sourceMapFilename: 'bundle.js.map',
	},
	plugins: (isProduction ? [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			inject: false,
			template: path.join(root, '/backend/public/index.html'),
		}),
		new TerserWebpackPlugin({
			cache: true,
			parallel: true,
			terserOptions: {
				keep_classnames: false,
				keep_fnames: false,
				mangle: true,
				toplevel: false,
			},
		}),
	] : [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			inject: false,
			template: path.join(root, '/backend/public/index.html'),
		}),
	]).concat([ /* Shared plugins */
		new webpack.DefinePlugin({
			'window.config': {
				domain: JSON.stringify(cfg.shared.domain),
				secure: JSON.stringify(cfg.shared.secure),
				sessionDuration: JSON.stringify(cfg.shared.sessionDuration),
				sessionExtend: JSON.stringify(cfg.shared.sessionExtend),
			},
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV),
			},
		}),
	]),
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.json'],
	},
};

module.exports = config;
