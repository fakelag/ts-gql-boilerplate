import express = require('express');
import fs = require('fs');
import gql from 'graphql-tag';
import http from 'http';
import jwt from 'jsonwebtoken';
import config from '../config/config.json';

import { ApolloServer } from 'apollo-server-express';
import { GraphQLUpload } from 'graphql-upload';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
// import { PubSub, withFilter } from 'graphql-subscriptions';

import * as db from './database';
import * as I from './interfaces';

// enum SubscriptionEvents {
// 	EVENT_CREATED = '@@event/created',
// }

// interface IFileUpload {
// 	filename: string;
// 	mimetype: string;
// 	encoding: string;
// 	createReadStream(): fs.ReadStream | null | undefined;
// }

// const loginFilter = async (ctx: any, resource: any) => {
// 	const user = await ctx.getUser();

// 	if (!user)
// 		return false;

// 	return (user._id.toString() === resource._owner);
// };

export const init = (app: express.Express) => {
	// const pubSub = new PubSub();

	const schemaString: string = fs.readFileSync('backend/schema.graphql').toString();
	const typeDefs: any = gql`${schemaString}`;

	const resolvers = {
		// Mutation: {
		// 	replaceThis: async (root: any, args: any, ctx: I.IGQLContext) => {
		// 		const user = await ctx.getUser();

		// 		if (!user)
		// 			return false;

		// 		return true;
		// 	},
		// },
		Query: {
			login: async (root: any, args: any, ctx: I.IGQLContext) => {
				const user = await ctx.getUser();

				if (!user)
					return null;

				return {
					token: jwt.sign(user.toObject(), config.backend.wsSecret),
					user,
				};
			},
		},
		// Subscription: {
		// 	replaceThis: {
		// 		resolve: (payload: any, args: any, ctx: I.IGQLContext) => {
		// 			return payload;
		// 		},
		// 		subscribe: withFilter(() => pubSub.asyncIterator(SubscriptionEvents.FILE_ADDED),
		// 			(payload: any, variables: any, ctx: any): Promise<boolean> => loginFilter(ctx, payload),
		// 		),
		// 	},
		// },
		Upload: GraphQLUpload,
	};

	const context = async (ctx: { req: any, connection: any }) => {
		if (ctx.connection) {
			return {
				...ctx.connection.context,
				getUser: async function(): Promise<I.IUser | null> {
					if (!this.isAuthenticated())
						return null;

					return db.UserModel.findOne({ _id: this.user });
				},
				isAuthenticated: function(): boolean {
					return !!this.user;
				},
			};
		}

		return {
			getUser: async function(): Promise<I.IUser | null> {
				if (!this.isAuthenticated())
					return null;

				return db.UserModel.findOne({ _id: this.user });
			},
			isAuthenticated: function(): boolean {
				return (this.req && this.req.session && this.user);
			},
			req: ctx.req,
			user: ctx.req.session.user,
		};
	};

	const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers });
	const server: ApolloServer = new ApolloServer({
		context,
		schema,
		subscriptions: {
			onConnect: async (connectionParams: object | string, webSocket: any, ctx: any) => {
				if (!connectionParams || typeof (connectionParams) !== 'string') {
					webSocket.close();
					return {};
				}

				return new Promise((resolve, reject) => {
					jwt.verify(connectionParams, config.backend.wsSecret,
					async (err: jwt.VerifyErrors | undefined, decoded: any) => {
						if (err || !decoded || typeof (decoded) !== 'object') {
							webSocket.close();
							resolve({});
						} else {
							const user: I.IUser | null = await db.UserModel.findOne({ _id: decoded._id });

							if (!user) {
								webSocket.close();
								resolve({});
							} else {
								resolve({ user: decoded });
							}
						}
					});
				});
			},
			onDisconnect: async (webSocket: any, context: any) => {
				context.initPromise.then(async (ctx: I.IGQLContext) => {
					// disconnect..
				});
			},
		},
		uploads: {
			maxFileSize: 10000000, // 10 MB
		},
	});

	server.applyMiddleware({ app });

	const httpServer = http.createServer(app);
	server.installSubscriptionHandlers(httpServer);
	return httpServer;
};
