module.exports = {
	presets: [
		[
			'@babel/env',
			'@babel/react-app',
			{
				targets: {
					node: 'current',
				},
			},
			'@babel/preset-typescript',
		],
	],
};
