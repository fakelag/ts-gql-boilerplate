import * as db from './database';

import 'babel-polyfill';

describe('Performing database tests', () => {
	test('Fetching users list', async () => {
		await expect(typeof(await db.UserModel.find())).toBe('object');
		await expect(Array.isArray(await db.UserModel.find())).toBe(true);
	});
});

afterAll(async () => {
	await db.connection.close();
});
