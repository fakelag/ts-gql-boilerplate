import mongoose from 'mongoose';

import * as I from './interfaces';

if (process.env.NODE_ENV === 'development')
	mongoose.set('debug', true);

let UserModel: mongoose.Model<I.IUser>;

const db = mongoose.createConnection('mongodb://localhost:27017/ts-gql-boilerplate');

const userSchema: mongoose.Schema = new mongoose.Schema({
	name: String,
	passwd: String,
});

userSchema.methods.getUserName = function(this: I.IUser): string {
	return this.name;
};

UserModel = db.model<I.IUser>('User', userSchema);

export {
	db as connection,
	UserModel,
};
