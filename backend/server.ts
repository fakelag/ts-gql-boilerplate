import bodyParser = require('body-parser');
import express = require('express');
import path = require('path');
import webpack = require('webpack');
import sessions = require('client-sessions');
import config = require('../config/config.json');
import webpackMiddleWare = require('webpack-dev-middleware');
import webpackConfig = require('../config/webpack.config');

import * as I from './interfaces';
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

app.post('/login', async (req: I.IRequest, res: express.Response, next: express.NextFunction) => {
	if (!req.body.name)
		return res.sendStatus(400);

	if (!req.body.passwd)
		return res.sendStatus(400);

	const user: I.IUser | null = await db.UserModel.findOne({ name: req.body.name, passwd: req.body.passwd },
		{}, { lean: true }).select({ _id: 1 });

	if (user) {
		req.session = {
			user: user._id,
		};

		res.send(user._id);
	} else {
		res.sendStatus(401);
	}

	return true;
});

app.get('/logout', async (req: I.IRequest, res: express.Response, next: express.NextFunction) => {
	req.session! = {
		user: null,
	};

	res.redirect('/');
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
