import React from 'react';
import gql from 'graphql-tag';
import { client, subscriptionClient } from '../link';

import App from './App';
import Login from '../components/Login';

import * as I from '../interfaces';

const Q_LOGIN = gql`
	query GetLogin {
		login {
			token,
			user {
				name
			}
		}
	}
`;

interface IRootStateProps {}
interface IRootActions {}

interface IRootState {
	fetched: boolean;
	login: I.ILoginData | null;
}

interface IRootProps extends IRootStateProps, IRootActions {}

class Root extends React.Component<IRootProps, IRootState> {
	public state: IRootState = {
		fetched: false,
		login: null,
	};

	constructor(props: IRootProps) {
		super(props);
	}

	public componentWillMount() {
		client.query({
			query: Q_LOGIN,
		}).then((result: any) => {
			if (result.data && result.data.login)
				this.login(result.data.login);
			else
				this.setState({ fetched: true });
		});
	}

	public login = (login: I.ILoginData) => {
		if (login && login.token) {
			subscriptionClient.on('connected', (a: any) => this.setState({ login, fetched: true }));
			subscriptionClient.on('reconnected', (a: any) => this.setState({ login, fetched: true }));
			subscriptionClient.connectionParams = () => login.token;
		} else {
			this.setState({ login: null });
		}
	}

	public render() {
		if (!this.state.fetched)
			return null;

		return (<React.Fragment>
				{this.state.login
					? <App login={this.state.login!} />
					: <Login key="MainLogin" />}
		</React.Fragment>);
	}
}

export default Root;
