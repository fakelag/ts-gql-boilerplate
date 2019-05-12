import express = require('express');
import mongoose from 'mongoose';

export interface IUserData {
	_id: any;
	name: string;
	passwd: string;
}

export interface IUser extends IUserData, mongoose.Document  {
	getUserName(): string;
}

export interface ISession {
	user: string | null | undefined;
}

export interface IRequest extends express.Request {
	session?: ISession;
}

export interface IGQLContext {
	req?: any;
	user: IUserData | null;
	isAuthenticated(): boolean;
	getUser(): Promise<IUser | null>;
}
