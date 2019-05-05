import bodyParser = require('body-parser');
import express = require('express');
import path = require('path');
import webpack = require('webpack');
import sessions = require('client-sessions');
import config = require('../config/config.json');
import webpackMiddleWare = require('webpack-dev-middleware');
import webpackConfig = require('../config/webpack.config');

import * as db from './database';
import * as backend from './backend';

if (process.platform === 'win32') {
	const rl = require('readline').createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	rl.on('SIGINT', () => {
		process.emit(<any>'SIGINT');
	});
}

process.on('unhandledRejection', console.log);

['SIGINT', 'SIGTERM'].forEach((sig: any) => {
	process.on(sig, () => {
		process.exit();
	});
});

const app: express.Express = express();

app.use(bodyParser.json());
app.use(sessions({
	activeDuration: config.shared.sessionExtend * 60 * 1000,
	cookieName: 'session',
	duration: config.shared.sessionDuration * 60 * 1000,
	secret: config.backend.cookieSecret,
}));

app.get('/login', async (req: any, res: express.Response, next: express.NextFunction) => {
	const user = await db.UserModel.findOne({ name: 'FakeLag' }, {}, { lean: true }).select({ _id: 1 });

	if (user) {
		req.session = {
			user: user._id,
		};
	}

	next();
});

const httpServer = backend.init(app);

if (process.env.NODE_ENV !== 'production') {
	const compiler: webpack.Compiler = webpack(webpackConfig);

	const middleware = webpackMiddleWare(compiler, {
		publicPath: '',
		stats: 'errors-only',
	});

	app.use(middleware);
} else {
	app.use(express.static('build'));
}

app.get(/.*/, (req: express.Request, res: express.Response) => {
	res.sendFile(path.resolve('backend/public/index.html'));
});

httpServer.listen({ port: config.backend.port }, () => console.log(`Listening on ${config.backend.port}`));

export {};
