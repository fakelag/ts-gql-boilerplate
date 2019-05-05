import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import ApolloClient from 'apollo-client';

const host: string = `${(window as any).config.domain}/graphql`;

const httpLink = createUploadLink({
	uri: `${(window as any).config.secure ? 'https' : 'http'}://${host}`,
});

export const subscriptionClient: any = new SubscriptionClient(`${(window as any).config.secure
	? 'wss' : 'ws'}://${host}`, {
	connectionParams: () => '',
	reconnect: true,
});

const wsLink = new WebSocketLink(subscriptionClient);

const link = split(
	({ query }) => {
		const node = getMainDefinition(query);
		return node.kind === 'OperationDefinition' && node.operation === 'subscription';
	},
	wsLink,
	httpLink,
);

export const cache = new InMemoryCache();
export const client = new ApolloClient({
	cache,
	link,
});
